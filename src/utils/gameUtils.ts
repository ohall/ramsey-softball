import { PitchSettings, PitchType, Position, SwingResult } from './types';

// Generate a random pitch
export const generatePitch = (): PitchSettings => {
  const pitchTypes: PitchType[] = ['fastball', 'curveball', 'changeup'];
  const randomIndex = Math.floor(Math.random() * pitchTypes.length);
  const type = pitchTypes[randomIndex];
  
  let speed = 0;
  let curve = 0;
  
  switch (type) {
    case 'fastball':
      speed = 80 + Math.random() * 20; // 80-100
      curve = Math.random() * 10; // 0-10
      break;
    case 'curveball':
      speed = 60 + Math.random() * 15; // 60-75
      curve = 30 + Math.random() * 20; // 30-50
      break;
    case 'changeup':
      speed = 50 + Math.random() * 15; // 50-65
      curve = 10 + Math.random() * 20; // 10-30
      break;
  }
  
  return { type, speed, curve };
};

// Calculate result of a swing based on timing and position
export const calculateSwingResult = (
  swingTiming: number, 
  pitchTiming: number,
  swingPosition: Position,
  ballPosition: Position
): SwingResult => {
  // Timing difference (0 is perfect)
  const timingDiff = Math.abs(swingTiming - pitchTiming);
  
  // Position difference (0 is perfect)
  const positionDiff = Math.sqrt(
    Math.pow(swingPosition.x - ballPosition.x, 2) +
    Math.pow(swingPosition.y - ballPosition.y, 2)
  );
  
  // Calculate quality of contact (0-1, 1 is perfect)
  const timingQuality = Math.max(0, 1 - (timingDiff / 300)); // 300ms window
  const positionQuality = Math.max(0, 1 - (positionDiff / 50)); // 50px window
  const contactQuality = timingQuality * positionQuality;
  
  // Determine result based on contact quality
  const random = Math.random();
  if (contactQuality < 0.2) {
    return SwingResult.MISS;
  } else if (contactQuality < 0.4) {
    return random < 0.8 ? SwingResult.FOUL : SwingResult.MISS;
  } else if (contactQuality < 0.7) {
    return random < 0.7 ? SwingResult.HIT : SwingResult.FOUL;
  } else {
    return random < 0.3 ? SwingResult.HOME_RUN : SwingResult.HIT;
  }
};

// Get a random item from an array
export const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Calculate pitch trajectory point at a given time
export const calculatePitchPosition = (
  time: number, // 0-1 represents pitch progress
  pitch: PitchSettings,
  startPos: Position,
  endPos: Position
): Position => {
  // Linear interpolation for basic position
  const baseX = startPos.x + (endPos.x - startPos.x) * time;
  const baseY = startPos.y + (endPos.y - startPos.y) * time;
  
  // Add curve effect (parabolic for y, sinusoidal for x)
  const curveFactorX = (pitch.type === 'curveball') ? pitch.curve / 30 : pitch.curve / 60;
  const curveFactorY = pitch.curve / 40;
  
  // X curve (left-right movement)
  const curveX = Math.sin(time * Math.PI) * curveFactorX * (pitch.type === 'curveball' ? 1 : -1);
  
  // Y curve (vertical movement, more pronounced in middle of pitch)
  const curveY = Math.sin(time * Math.PI) * curveFactorY;
  
  return {
    x: baseX + curveX * (endPos.x - startPos.x),
    y: baseY + curveY * (endPos.y - startPos.y)
  };
};