import { useState, useEffect, useRef, TouchEvent } from 'react';
import { Position } from '../utils/types';

interface SwipeEvents {
  onSwipeStart?: (position: Position) => void;
  onSwipeMove?: (position: Position, velocity: Position) => void;
  onSwipeEnd?: (position: Position, velocity: Position) => void;
  onTap?: (position: Position) => void;
}

export const useSwipeDetection = (targetRef: React.RefObject<HTMLElement | null>, events: SwipeEvents) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });
  const velocityRef = useRef<Position>({ x: 0, y: 0 });
  
  // Configuration
  const TAP_THRESHOLD = 10; // px
  const SWIPE_THRESHOLD = 30; // px

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
      const touch = e.touches[0];
      const position = { x: touch.clientX, y: touch.clientY };
      
      setIsSwiping(true);
      setStartPosition(position);
      setCurrentPosition(position);
      lastPositionRef.current = position;
      lastTimeRef.current = Date.now();
      velocityRef.current = { x: 0, y: 0 };
      
      if (events.onSwipeStart) {
        events.onSwipeStart(position);
      }
    };

    const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
      if (!isSwiping) return;
      
      const touch = e.touches[0];
      const position = { x: touch.clientX, y: touch.clientY };
      setCurrentPosition(position);
      
      // Calculate velocity
      const now = Date.now();
      if (lastTimeRef.current) {
        const deltaTime = now - lastTimeRef.current;
        if (deltaTime > 0) {
          velocityRef.current = {
            x: (position.x - lastPositionRef.current.x) / deltaTime * 1000, // px/s
            y: (position.y - lastPositionRef.current.y) / deltaTime * 1000  // px/s
          };
        }
      }
      
      lastTimeRef.current = now;
      lastPositionRef.current = position;
      
      if (events.onSwipeMove) {
        events.onSwipeMove(position, velocityRef.current);
      }
    };

    const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
      if (!isSwiping) return;
      
      const distanceMoved = Math.sqrt(
        Math.pow(currentPosition.x - startPosition.x, 2) +
        Math.pow(currentPosition.y - startPosition.y, 2)
      );
      
      if (distanceMoved < TAP_THRESHOLD && events.onTap) {
        // It's a tap
        events.onTap(currentPosition);
      } else if (distanceMoved > SWIPE_THRESHOLD && events.onSwipeEnd) {
        // It's a swipe
        events.onSwipeEnd(currentPosition, velocityRef.current);
      }
      
      setIsSwiping(false);
    };

    element.addEventListener('touchstart', handleTouchStart as any);
    element.addEventListener('touchmove', handleTouchMove as any);
    element.addEventListener('touchend', handleTouchEnd as any);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart as any);
      element.removeEventListener('touchmove', handleTouchMove as any);
      element.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [targetRef, events, isSwiping, startPosition, currentPosition]);

  return {
    isSwiping,
    currentPosition,
    startPosition
  };
};

export default useSwipeDetection;