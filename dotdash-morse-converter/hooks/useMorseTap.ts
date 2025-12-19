import { useState, useRef, useCallback, useEffect } from 'react';
import { morseToText } from '../utils/morseConverter';

// Timing constants (in milliseconds)
const DOT_THRESHOLD = 220; // Anything held less than this is a dot
const LETTER_GAP_THRESHOLD = 700; // Pause longer than this to create a new letter
const WORD_GAP_THRESHOLD = 1500; // Pause longer than this to create a new word

export const useMorseTap = () => {
  const [tappedMorse, setTappedMorse] = useState('');
  const [tappedText, setTappedText] = useState('');
  const [isTapping, setIsTapping] = useState(false);

  const pressTimeRef = useRef<number>(0);
  const letterGapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordGapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentMorseRef = useRef('');

  useEffect(() => {
    currentMorseRef.current = tappedMorse;
  }, [tappedMorse]);

  const clearTimers = () => {
    if (letterGapTimerRef.current) clearTimeout(letterGapTimerRef.current);
    if (wordGapTimerRef.current) clearTimeout(wordGapTimerRef.current);
  };
  
  const handleMorseUpdate = (newMorse: string) => {
    setTappedMorse(newMorse);
    setTappedText(morseToText(newMorse));
  };
  
  const handlePress = useCallback(() => {
    clearTimers();
    setIsTapping(true);
    pressTimeRef.current = Date.now();
  }, []);

  const handleRelease = useCallback(() => {
    setIsTapping(false);
    const releaseTime = Date.now();
    const duration = releaseTime - pressTimeRef.current;
    const symbol = duration < DOT_THRESHOLD ? '.' : '-';
    
    const newMorse = currentMorseRef.current + symbol;
    handleMorseUpdate(newMorse);

    letterGapTimerRef.current = setTimeout(() => {
        handleMorseUpdate(newMorse + ' ');
    }, LETTER_GAP_THRESHOLD);

    wordGapTimerRef.current = setTimeout(() => {
        handleMorseUpdate(newMorse.trim() + ' / ');
    }, WORD_GAP_THRESHOLD);
  }, []);

  const clear = useCallback(() => {
    clearTimers();
    setTappedMorse('');
    setTappedText('');
  }, []);

  // Keyboard support (Spacebar)
  useEffect(() => {
    let spacePressed = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        spacePressed = true;
        e.preventDefault();
        handlePress();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spacePressed = false;
        e.preventDefault();
        handleRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimers();
    };
  }, [handlePress, handleRelease]);
  
  const tapButtonProps = {
    onMouseDown: handlePress,
    onMouseUp: handleRelease,
    onMouseLeave: () => {
        if(isTapping) handleRelease();
    },
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      handlePress();
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      handleRelease();
    },
  };

  return { tappedText, tappedMorse, isTapping, tapButtonProps, clear };
};