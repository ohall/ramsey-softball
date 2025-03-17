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
  width: 30px;
  height: 60px;
  background-color: #3399FF;
  border-radius: 50% 50% 10px 10px;
  
  ${props => props.isPitching && css`
    animation: ${windupAnimation} 0.5s ease-in-out;
  `}
  
  &:before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background-color: #FFA07A;
    border-radius: 50%;
  }
`;

// Batter animation
const swingAnimation = keyframes`
  0% { transform: rotate(0); }
  50% { transform: rotate(-45deg); }
  100% { transform: rotate(45deg); }
`;

export const Batter = styled.div<{ isSwinging: boolean }>`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 60px;
  background-color: #FF6347;
  border-radius: 50% 50% 10px 10px;
  
  ${props => props.isSwinging && css`
    animation: ${swingAnimation} 0.3s ease-in-out;
  `}
  
  &:before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background-color: #FFA07A;
    border-radius: 50%;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 10px;
    right: -40px;
    width: 50px;
    height: 10px;
    background-color: #8B4513;
    border-radius: 5px;
    transform-origin: left center;
    transform: rotate(-20deg);
  }
`;

// Ball animation
const spinAnimation = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

export const Ball = styled.div<{ visible: boolean }>`
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #CC0000;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s;
  
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 50%;
    border: 1px solid #CC0000;
    border-top-color: transparent;
    border-left-color: transparent;
    animation: ${spinAnimation} 0.5s linear infinite;
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

export const Button = styled.button`
  padding: 12px 20px;
  background-color: #E74C3C;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 8px 0;
  cursor: pointer;
  box-shadow: 0 4px 0 #C0392B;
  transition: all 0.1s;
  
  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #C0392B;
  }
  
  &:disabled {
    background-color: #95A5A6;
    box-shadow: 0 4px 0 #7F8C8D;
    cursor: not-allowed;
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
  width: 25px;
  height: 25px;
  background-color: white;
  clip-path: polygon(0% 30%, 30% 0%, 70% 0%, 100% 30%, 50% 100%);
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