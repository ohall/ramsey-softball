import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

interface SoundEffects {
  pitch: Howl;
  swing: Howl;
  hit: Howl;
  homeRun: Howl;
  foul: Howl;
  crowd: Howl;
  cheer: Howl;
  strike: Howl;
  miss: Howl;
}

export const useSoundEffects = () => {
  const soundsRef = useRef<Partial<SoundEffects>>({});
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    
    // Initialize sound effects
    // Note: In a real app, we would have actual sound files here
    // For now, we're using placeholder URLs that would be replaced with actual assets
    soundsRef.current = {
      pitch: new Howl({ src: ['/sounds/pitch.mp3'], volume: 0.5 }),
      swing: new Howl({ src: ['/sounds/swing.mp3'], volume: 0.8 }),
      hit: new Howl({ src: ['/sounds/hit.mp3'], volume: 0.9 }),
      homeRun: new Howl({ src: ['/sounds/home_run.mp3'], volume: 1.0 }),
      foul: new Howl({ src: ['/sounds/foul.mp3'], volume: 0.7 }),
      crowd: new Howl({ src: ['/sounds/crowd.mp3'], volume: 0.3, loop: true }),
      cheer: new Howl({ src: ['/sounds/cheer.mp3'], volume: 0.8 }),
      strike: new Howl({ src: ['/sounds/strike.mp3'], volume: 0.7 }),
      miss: new Howl({ src: ['/sounds/miss.mp3'], volume: 0.6 }),
    };
    
    loadedRef.current = true;
    
    // Start ambient crowd noise
    soundsRef.current.crowd?.play();
    
    return () => {
      // Clean up sounds on unmount
      Object.values(soundsRef.current).forEach(sound => {
        if (sound && sound.playing()) {
          sound.stop();
        }
      });
    };
  }, []);

  const playSound = (soundName: keyof SoundEffects) => {
    const sound = soundsRef.current[soundName];
    if (sound) {
      sound.play();
    }
  };

  return { playSound };
};

export default useSoundEffects;