import React, { useState, useRef, useCallback } from 'react';
// Removed react-spring due to typing issues
import { GameState, SwingResult, Position, PitchSettings, GameStats } from '../utils/types';
import { generatePitch, calculateSwingResult, calculatePitchPosition } from '../utils/gameUtils';
import useSwipeDetection from '../hooks/useSwipeDetection';
import useSoundEffects from '../hooks/useSoundEffects';
import DugoutChant from './DugoutChant';
import {
  GameContainer,
  GameField,
  Pitcher,
  Batter,
  Ball as BallStyled,
  Scoreboard,
  ScoreItem,
  ControlsContainer,
  Button,
  HomePlate,
  ResultMessage,
  StadiumBackground,
  GameOverlay,
  OverlayContent,
  OverlayTitle,
  OverlayText,
  GameTitle,
  DebugMessage,
  DebugButton
} from './StyledComponents';

const Game: React.FC = () => {
  // Refs
  const gameFieldRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  
  // State - Start in BATTING state for immediate interaction
  const [gameState, setGameState] = useState<GameState>(GameState.BATTING);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    strikes: 0,
    balls: 0,
    outs: 0,
    inning: 1,
    isTopInning: true
  });
  const [isPitching, setIsPitching] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [ballVisible, setBallVisible] = useState(true);
  const [currentPitch, setCurrentPitch] = useState<PitchSettings | null>(null);
  const [resultMessage, setResultMessage] = useState<{ text: string, type: 'success' | 'error' | 'neutral' } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState({ title: '', text: '' });
  
  // Ball position animation - position directly in front of pitcher for visibility
  const ballStartPosition = React.useMemo(() => ({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight * 0.35 
  }), []);
  
  const ballEndPosition = React.useMemo(() => ({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight * 0.65 
  }), []);
  
  const ballPositionRef = useRef<Position>(ballStartPosition);
  const pitchTimingRef = useRef<number>(0);
  
  // Simplified ball position state
  const [ballPosition, setBallPosition] = useState<Position>(ballStartPosition);
  
  // Sound effects
  const { playSound } = useSoundEffects();
  
  // Initialize a new at-bat
  const startNewAtBat = useCallback(() => {
    // Always keep ball visible and start in batting state for easier gameplay
    setGameState(GameState.BATTING);
    setBallVisible(true);
    setResultMessage(null);
    // Reset ball position to make it clearly visible
    setBallPosition(ballStartPosition);
  }, [ballStartPosition]);
  
  // Reset inning
  const resetInning = useCallback(() => {
    setStats(prev => ({
      ...prev,
      balls: 0,
      strikes: 0,
      outs: 0,
      inning: prev.isTopInning ? prev.inning : prev.inning + 1,
      isTopInning: !prev.isTopInning
    }));
    startNewAtBat();
  }, [startNewAtBat]);
  
  // Reset count
  const resetCount = useCallback(() => {
    setStats(prev => ({
      ...prev,
      balls: 0,
      strikes: 0
    }));
    startNewAtBat();
  }, [startNewAtBat]);
  
  // Define pitch function separately to fix dependency cycle
  const pitchFn = () => {
    if (gameState !== GameState.WAITING) return;
    
    // Generate a new pitch
    const pitch = generatePitch();
    setCurrentPitch(pitch);
    
    // Start pitching animation
    setIsPitching(true);
    setGameState(GameState.PITCHING);
    
    // Pitcher windup animation
    setTimeout(() => {
      setBallVisible(true);
      playSound('pitch');
      
      // Calculate pitch speed/duration
      const pitchDuration = 2000 - pitch.speed * 10; // 1000-2000ms based on speed
      pitchTimingRef.current = Date.now() + pitchDuration;
      
      // Animate ball position over time
      const interval = 16; // ms (60fps)
      let time = 0;
      const animateBall = () => {
        time += interval;
        const progress = Math.min(time / pitchDuration, 1);
        
        const position = calculatePitchPosition(
          progress, 
          pitch, 
          ballStartPosition, 
          ballEndPosition
        );
        
        ballPositionRef.current = position;
        setBallPosition(position);
        
        if (progress < 1) {
          requestAnimationFrame(animateBall);
        } else {
          // Pitch complete
          setGameState(GameState.BATTING);
          
          // If the user doesn't swing, it's either a ball or a strike
          setTimeout(() => {
            pitchResultFn(false);
          }, 300);
        }
      };
      
      requestAnimationFrame(animateBall);
    }, 500); // Wait for pitcher windup
    
    // Reset pitching animation
    setTimeout(() => {
      setIsPitching(false);
    }, 500);
  };
  
  // Handle pitch animation (memoized version)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePitch = useCallback(pitchFn, [
    gameState, 
    playSound, 
    ballStartPosition, 
    ballEndPosition, 
    setBallPosition,
    // Note: pitchResultFn is not in the deps array to avoid circular dependency
  ]);
  
  // Define handlePitchResult function separately to avoid circular dependency
  const pitchResultFn = (didSwing: boolean) => {
    if (!currentPitch) return;
    
    let newStats = { ...stats };
    let resultType: 'success' | 'error' | 'neutral' = 'neutral';
    let resultText = '';
    
    if (didSwing) {
      // User swung at the pitch
      const swingResult = calculateSwingResult(
        Date.now(),
        pitchTimingRef.current,
        { x: window.innerWidth / 2, y: window.innerHeight * 0.8 }, // Swing position
        ballPositionRef.current
      );
      
      switch (swingResult) {
        case SwingResult.MISS:
          newStats.strikes++;
          resultText = 'Strike!';
          resultType = 'error';
          playSound('miss');
          break;
          
        case SwingResult.FOUL:
          // Foul balls are strikes unless you already have 2 strikes
          if (newStats.strikes < 2) {
            newStats.strikes++;
          }
          resultText = 'Foul Ball!';
          resultType = 'neutral';
          playSound('foul');
          break;
          
        case SwingResult.HIT:
          resultText = 'Hit!';
          resultType = 'success';
          newStats.score++;
          playSound('hit');
          break;
          
        case SwingResult.HOME_RUN:
          resultText = 'Home Run!';
          resultType = 'success';
          newStats.score += 4; // Assuming bases loaded
          playSound('homeRun');
          playSound('cheer');
          break;
      }
    } else {
      // User didn't swing
      // Determine if the pitch is a ball or strike
      // For simplicity, let's say 30% of pitches are balls
      if (Math.random() < 0.3) {
        newStats.balls++;
        resultText = 'Ball!';
        resultType = 'neutral';
      } else {
        newStats.strikes++;
        resultText = 'Strike!';
        resultType = 'error';
        playSound('strike');
      }
    }
    
    // Check for walk or strikeout
    if (newStats.strikes >= 3) {
      newStats.outs++;
      resultText = 'Strikeout!';
      resultType = 'error';
    } else if (newStats.balls >= 4) {
      newStats.score++;
      resultText = 'Walk!';
      resultType = 'success';
    }
    
    // Check for inning end
    if (newStats.outs >= 3) {
      setOverlayContent({
        title: `End of ${newStats.isTopInning ? 'Top' : 'Bottom'} ${newStats.inning}`,
        text: `Score: ${newStats.score}`,
      });
      setShowOverlay(true);
      
      // We'll also reset the inning
      setTimeout(() => {
        resetInning();
        setShowOverlay(false);
      }, 3000);
    }
    
    // Update state
    setStats(newStats);
    setResultMessage({ text: resultText, type: resultType });
    setGameState(GameState.BETWEEN_PLAYS);
    
    // Clear result message and prepare for next pitch after a delay
    setTimeout(() => {
      if (newStats.strikes < 3 && newStats.balls < 4 && newStats.outs < 3) {
        startNewAtBat();
      } else if (newStats.strikes >= 3 || newStats.balls >= 4) {
        resetCount();
      }
    }, 2000);
  };
  
  // Handle the result of a pitch (memoized version)
  const handlePitchResult = useCallback(pitchResultFn, [
    currentPitch, 
    playSound, 
    resetCount, 
    resetInning, 
    startNewAtBat, 
    stats
  ]);
  
  // Handle swing
  const handleSwing = useCallback(() => {
    if (gameState !== GameState.BATTING) return;
    
    setIsSwinging(true);
    playSound('swing');
    
    // Reset swing animation after it completes
    setTimeout(() => {
      setIsSwinging(false);
    }, 300);
    
    // Calculate result
    handlePitchResult(true);
    setGameState(GameState.BETWEEN_PLAYS);
  }, [gameState, handlePitchResult, playSound]);
  
  // Debug function to help test the game
  const handleDebugClick = useCallback((e: React.MouseEvent) => {
    // Click to toggle between swinging and pitching
    if (gameState === GameState.BATTING) {
      handleSwing();
    } else if (gameState === GameState.WAITING) {
      handlePitch();
    } else if (gameState === GameState.BETWEEN_PLAYS) {
      startNewAtBat();
    }
  }, [gameState, handleSwing, handlePitch, startNewAtBat]);

  // Touch/swipe events
  const swipeEvents = {
    onSwipeStart: () => {},
    onSwipeMove: () => {},
    onSwipeEnd: () => {
      if (gameState === GameState.BATTING) {
        handleSwing();
      }
    },
    onTap: () => {
      // Use the same debug handling for taps
      if (gameState === GameState.WAITING) {
        handlePitch();
      } else if (gameState === GameState.BATTING) {
        handleSwing();
      } else if (gameState === GameState.BETWEEN_PLAYS) {
        startNewAtBat();
      }
    }
  };
  
  useSwipeDetection(gameFieldRef, swipeEvents);
  
  return (
    <GameContainer>
      <GameTitle>Ramsey Softball at Finch Park (State: {gameState})</GameTitle>
      
      <Scoreboard>
        <ScoreItem>
          <span>SCORE</span>
          <span>{stats.score}</span>
        </ScoreItem>
        <ScoreItem>
          <span>BALLS</span>
          <span>{stats.balls}</span>
        </ScoreItem>
        <ScoreItem>
          <span>STRIKES</span>
          <span>{stats.strikes}</span>
        </ScoreItem>
        <ScoreItem>
          <span>OUTS</span>
          <span>{stats.outs}</span>
        </ScoreItem>
        <ScoreItem>
          <span>INNING</span>
          <span>{stats.inning} {stats.isTopInning ? '▲' : '▼'}</span>
        </ScoreItem>
      </Scoreboard>
      
      <GameField 
        ref={gameFieldRef} 
        onClick={handleDebugClick}
      >
        <StadiumBackground />
        <Pitcher isPitching={isPitching} />
        <Batter isSwinging={isSwinging} />
        <HomePlate />
        
        {gameState === GameState.BATTING && (
          <DebugButton onClick={handleSwing}>HIT BALL!</DebugButton>
        )}
        <div ref={ballRef} style={{ 
          position: 'absolute',
          left: ballPosition.x - 20, /* Center ball by offsetting width/2 (now 40px) */
          top: ballPosition.y - 20,  /* Center ball by offsetting height/2 (now 40px) */
          transition: 'left 16ms linear, top 16ms linear',
          zIndex: 100
        }}>
          <BallStyled visible={ballVisible} />
        </div>
        
        <DugoutChant isActive={gameState === GameState.BATTING || gameState === GameState.PITCHING} />
        
        <DebugMessage>
          {gameState === GameState.BATTING ? 
            'Click or tap to swing!' : 
            gameState === GameState.WAITING ? 
              'Click or tap to pitch!' : 
              'Click or tap to continue'}
        </DebugMessage>
        
        {resultMessage && (
          <ResultMessage type={resultMessage.type}>
            {resultMessage.text}
          </ResultMessage>
        )}
        
        <GameOverlay visible={showOverlay}>
          <OverlayContent>
            <OverlayTitle>{overlayContent.title}</OverlayTitle>
            <OverlayText>{overlayContent.text}</OverlayText>
          </OverlayContent>
        </GameOverlay>
      </GameField>
      
      <ControlsContainer>
        <Button 
          highlight={gameState === GameState.BATTING}
          onClick={
            gameState === GameState.WAITING ? handlePitch : 
            gameState === GameState.BATTING ? handleSwing : 
            startNewAtBat
          }
        >
          {gameState === GameState.WAITING ? 'Pitch!' : 
           gameState === GameState.BATTING ? 'Swing!' : 
           gameState === GameState.BETWEEN_PLAYS ? 'Next Pitch' :
           'Continue'}
        </Button>
      </ControlsContainer>
    </GameContainer>
  );
};

export default Game;