import React, { useEffect, useState } from 'react';
import { Chant, DUGOUT_CHANTS } from '../utils/types';
import { getRandomItem } from '../utils/gameUtils';
import { ChantBubble } from './StyledComponents';

interface DugoutChantProps {
  isActive: boolean;
  onChantComplete?: () => void;
}

const DugoutChant: React.FC<DugoutChantProps> = ({ isActive, onChantComplete }) => {
  const [currentChant, setCurrentChant] = useState<Chant | null>(null);
  const [showChant, setShowChant] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowChant(false);
      return;
    }

    // Start generating random chants
    const generateRandomChant = () => {
      const chant = getRandomItem(DUGOUT_CHANTS);
      setCurrentChant(chant);
      setShowChant(true);

      // Hide chant after its duration
      const timeout = setTimeout(() => {
        setShowChant(false);
        
        if (onChantComplete) {
          onChantComplete();
        }
        
        // Maybe generate another chant after a random interval
        if (isActive && Math.random() > 0.3) {
          const nextChantDelay = 1000 + Math.random() * 3000;
          setTimeout(generateRandomChant, nextChantDelay);
        }
      }, chant.duration);

      return () => clearTimeout(timeout);
    };

    // Start the chant generation with an initial delay
    const initialDelay = 500 + Math.random() * 1500;
    const timeout = setTimeout(generateRandomChant, initialDelay);
    
    return () => clearTimeout(timeout);
  }, [isActive, onChantComplete]);

  if (!showChant || !currentChant) return null;

  return (
    <ChantBubble duration={currentChant.duration}>
      {currentChant.text}
    </ChantBubble>
  );
};

export default DugoutChant;