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
  // Get bat position based on swing timing
  const swingProgress = Math.min(1, Math.max(0, (swingTiming - pitchTiming + 400) / 400));
  
  // Calculate bat tip position during swing
  const getBatPosition = (progress: number) => {
    const batLength = 90; // Length of bat in pixels
    const batterX = window.innerWidth / 2 + 80; // Batter's x position
    const batterY = window.innerHeight * 0.85; // Batter's y position
    
    let angle = 0;
    let translateX = 0;
    
    if (progress < 0.2) {
      angle = 45 - (progress / 0.2) * 15;
      translateX = 0;
    } else if (progress < 0.4) {
      angle = 30 - ((progress - 0.2) / 0.2) * 30;
      translateX = -((progress - 0.2) / 0.2) * 15;
    } else if (progress < 0.5) {
      angle = ((progress - 0.4) / 0.1) * 90;
      translateX = -15 - ((progress - 0.4) / 0.1) * 5;
    } else if (progress < 0.7) {
      angle = 90 + ((progress - 0.5) / 0.2) * 70;
      translateX = -20 + ((progress - 0.5) / 0.2) * 5;
    } else {
      angle = 160 + ((progress - 0.7) / 0.3) * 30;
      translateX = -15 + ((progress - 0.7) / 0.3) * 15;
    }
    
    // Convert angle to radians
    const rad = angle * Math.PI / 180;
    
    // Calculate bat handle and tip positions
    const handleX = batterX - 20 + translateX;
    const handleY = batterY;
    
    const tipX = handleX + Math.cos(rad) * batLength;
    const tipY = handleY + Math.sin(rad) * batLength;
    
    return {
      handle: { x: handleX, y: handleY },
      tip: { x: tipX, y: tipY },
      angle: rad
    };
  };
  
  // Check if bat intersects with ball
  const batPos = getBatPosition(swingProgress);
  
  // Function to calculate distance from a point to a line segment
  const distanceToLineSegment = (
    point: Position,
    lineStart: Position,
    lineEnd: Position
  ): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate distance from ball to bat (as a line segment)
  const distanceToBat = distanceToLineSegment(
    ballPosition,
    batPos.handle,
    batPos.tip
  );
  
  // If the ball is close enough to the bat, it's a hit
  const hitThreshold = 30; // Increased hit detection radius
  if (distanceToBat < hitThreshold) {
    // Quality of contact depends on:
    // 1. Distance from bat (closer is better)
    // 2. Angle of bat (horizontal is better for line drives)
    const distanceQuality = 1 - (distanceToBat / hitThreshold);
    const angleQuality = Math.abs(Math.cos(batPos.angle)); // 1 when horizontal, 0 when vertical
    
    const contactQuality = (distanceQuality * 0.7) + (angleQuality * 0.3);
    
    if (contactQuality > 0.8) {
      return SwingResult.HOME_RUN;
    } else if (contactQuality > 0.5) {
      return SwingResult.HIT;
    } else {
      return SwingResult.FOUL;
    }
  }
  
  return SwingResult.MISS;
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