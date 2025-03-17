import styled, { keyframes, css } from 'styled-components';

// Game Container
export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background-color: #8CC152; /* Grass green */
  font-family: 'Arial', sans-serif;
  touch-action: none; /* Prevent browser handling of touch events */
`;

// Game Field
export const GameField = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, #9ACD32 0%, #8CC152 70%);
  
  /* Add field lines for better contrast with ball */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 1;
  }
`;

// Scoreboard
export const Scoreboard = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #333;
  color: white;
  padding: 10px;
  font-family: 'Courier New', monospace;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  > span:first-child {
    font-weight: bold;
    font-size: 1rem;
  }
  
  > span:last-child {
    font-size: 1.2rem;
    margin-top: 5px;
  }
`;

// Pitcher animation
const windupAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px) rotate(-5deg); }
  100% { transform: translateY(0) rotate(0); }
`;

export const Pitcher = styled.div<{ isPitching: boolean }>`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 70px;
  background-color: #3399FF;
  border-radius: 50% 50% 10px 10px;
  z-index: 5;
  
  ${props => props.isPitching && css`
    animation: ${windupAnimation} 0.5s ease-in-out;
  `}
  
  /* Head */
  &:before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 25px;
    background-color: #FFA07A;
    border-radius: 50%;
    z-index: 6;
  }
  
  /* Arms */
  &:after {
    content: '';
    position: absolute;
    top: 15px;
    right: -15px;
    width: 40px;
    height: 10px;
    background-color: #3399FF;
    border-radius: 5px;
    transform: rotate(-20deg);
  }
`;

// Batter animation - only for the bat, not the whole batter
const swingAnimation = keyframes`
  0% { 
    transform: rotate(-45deg);
  }
  60% { 
    transform: rotate(100deg);
  }
  100% { 
    transform: rotate(90deg);
  }
`;

export const Batter = styled.div<{ isSwinging: boolean }>`
  position: absolute;
  bottom: 15%;
  left: calc(50% + 40px); /* Position batter next to home plate */
  transform: translateX(-50%);
  width: 40px;
  height: 70px;
  background-color: #FF6347;
  border-radius: 50% 50% 10px 10px;
  z-index: 5;
  
  /* Head */
  &:before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 25px;
    background-color: #FFA07A;
    border-radius: 50%;
    z-index: 6;
  }
  
  /* Bat */
  &:after {
    content: '';
    position: absolute;
    top: 15px;
    left: -10px;
    width: 80px;
    height: 8px;
    background-color: #8B4513;
    border-radius: 4px;
    transform-origin: left center;
    transform: rotate(-45deg);
    z-index: 4;
    ${props => props.isSwinging && css`
      animation: ${swingAnimation} 0.2s ease-in-out forwards;
    `}
  }
`;

// Ball animation
const spinAnimation = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

export const Ball = styled.div<{ visible: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  border: 3px solid #CC0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s;
  z-index: 1000;
  
  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid #CC0000;
    border-top-color: transparent;
    border-left-color: transparent;
    animation: ${spinAnimation} 0.5s linear infinite;
  }
  
  /* Add outer glow to make ball extremely visible */
  &:after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    z-index: -1;
    animation: pulse 1s infinite alternate;
  }
  
  @keyframes pulse {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
`;

// Controls
export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #444;
  color: white;
`;

export const DebugButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  padding: 20px 30px;
  border-radius: 20px;
  border: none;
  z-index: 999;
  cursor: pointer;
  font-weight: bold;
`;

export const Button = styled.button<{ highlight?: boolean }>`
  padding: 16px 24px;
  background-color: ${props => props.highlight ? '#2ECC71' : '#E74C3C'};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 6px 0 ${props => props.highlight ? '#27AE60' : '#C0392B'};
  transition: all 0.1s;
  width: 80%;
  max-width: 300px;
  margin: 16px auto;
  letter-spacing: 1px;
  animation: ${props => props.highlight ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  &:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 ${props => props.highlight ? '#27AE60' : '#C0392B'};
  }
  
  &:disabled {
    background-color: #95A5A6;
    box-shadow: 0 4px 0 #7F8C8D;
    cursor: not-allowed;
    animation: none;
  }
`;

// Dugout chant animation
const popInOut = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  10% { transform: translateY(0); opacity: 1; }
  90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

export const ChantBubble = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: white;
  border-radius: 15px;
  padding: 10px 15px;
  max-width: 200px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: ${props => 
    css`${popInOut} ${props.duration / 1000}s ease-in-out forwards`};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 20px;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

// Base
export const Base = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: white;
  transform: rotate(45deg);
`;

// Home plate
export const HomePlate = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: white;
  clip-path: polygon(0% 30%, 30% 0%, 70% 0%, 100% 30%, 50% 100%);
  border: 2px solid #333;
  z-index: 3;
  
  &:after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(139, 69, 19, 0.3); /* Dirt circle around home plate */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
`;

// Result Message
export const ResultMessage = styled.div<{ type: 'success' | 'error' | 'neutral' }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 25px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return 'rgba(46, 204, 113, 0.9)';
      case 'error': return 'rgba(231, 76, 60, 0.9)';
      default: return 'rgba(52, 152, 219, 0.9)';
    }
  }};
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

// Stadium background
export const StadiumBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
  z-index: -1;
  
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background-color: #795548;
    border-radius: 50% 50% 0 0;
  }
`;

// Overlay for between plays
export const GameOverlay = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const OverlayContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 80%;
`;

export const OverlayTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
`;

export const OverlayText = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color: #555;
`;

// Title and Header
export const GameTitle = styled.h1`
  text-align: center;
  color: #2C3E50;
  background-color: #FFFFFF;
  padding: 10px;
  margin: 0;
  font-size: 1.5rem;
  border-bottom: 2px solid #BDC3C7;
`;

export const DebugMessage = styled.div`
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 22px;
  font-weight: bold;
  z-index: 1000;
  text-align: center;
  pointer-events: none;
  max-width: 80%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  animation: fadeInOut 3s infinite;
  
  @keyframes fadeInOut {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
`;