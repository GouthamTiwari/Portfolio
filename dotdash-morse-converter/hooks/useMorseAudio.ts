import { useState, useRef, useCallback, useEffect } from 'react';

type PlaybackStatus = 'playing' | 'paused' | 'stopped';
export type MorseSymbol = '.' | '-' | ' ' | '/';

// Callback that fires for each symbol, allowing UI to sync
type onPlaybackTick = (symbol: MorseSymbol | null) => void;

interface UseMorseAudioProps {
  onPlaybackTick: onPlaybackTick;
  characterWpm?: number;
  effectiveWpm?: number;
  isFarnsworthEnabled?: boolean;
  toneFrequency?: number;
}


export const useMorseAudio = ({
  onPlaybackTick,
  characterWpm = 20,
  effectiveWpm = 10,
  isFarnsworthEnabled = false,
  toneFrequency = 750,
}: UseMorseAudioProps) => {
  const [status, setStatus] = useState<PlaybackStatus>('stopped');
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morseQueueRef = useRef<MorseSymbol[]>([]);
  const currentPositionRef = useRef<number>(0);

  // Use a ref to hold the latest callback without causing effects to re-run
  const onPlaybackTickRef = useRef(onPlaybackTick);
  useEffect(() => {
    onPlaybackTickRef.current = onPlaybackTick;
  }, [onPlaybackTick]);

  // Calculate timing based on WPM and Farnsworth settings
  const charDotDuration = 1200 / characterWpm;
  const effDotDuration = isFarnsworthEnabled ? (1200 / effectiveWpm) : charDotDuration;

  const timing = {
    DOT_DURATION: charDotDuration,
    DASH_DURATION: charDotDuration * 3,
    SYMBOL_GAP: charDotDuration,       // Gap within a character
    LETTER_GAP: effDotDuration * 3,  // Gap between characters
    WORD_GAP: effDotDuration * 7,    // Gap between words
  };

  const cleanupAudio = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch(e) { /* Already stopped */ }
      oscillatorRef.current = null;
    }
    if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
    }
    setAnalyserNode(null);
    onPlaybackTickRef.current(null);
  }, []); // Empty dependency array makes this callback stable

  const stop = useCallback(() => {
    currentPositionRef.current = 0;
    morseQueueRef.current = [];
    cleanupAudio();
    setStatus('stopped');
  }, [cleanupAudio]);
  
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const context = audioContextRef.current;
    cleanupAudio();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(toneFrequency, context.currentTime);
    gain.gain.setValueAtTime(0, context.currentTime);

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(context.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainRef.current = gain;
    setAnalyserNode(analyser);

  }, [cleanupAudio, toneFrequency]);

  const playSound = useCallback((duration: number) => {
    if (!gainRef.current || !audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    // Smooth ramp up and down to avoid clicking sounds
    gainRef.current.gain.setValueAtTime(0, now);
    gainRef.current.gain.linearRampToValueAtTime(0.5, now + 0.01);
    gainRef.current.gain.linearRampToValueAtTime(0, now + duration / 1000);
  }, []);

  const processQueue = useCallback(() => {
    if (currentPositionRef.current >= morseQueueRef.current.length) {
      stop();
      return;
    }
    
    const symbol = morseQueueRef.current[currentPositionRef.current];
    currentPositionRef.current++;
    onPlaybackTickRef.current(symbol);

    let duration = 0;
    let gap = timing.SYMBOL_GAP;

    switch (symbol) {
      case '.':
        duration = timing.DOT_DURATION;
        playSound(duration);
        break;
      case '-':
        duration = timing.DASH_DURATION;
        playSound(duration);
        break;
      case ' ':
        gap = timing.LETTER_GAP - timing.SYMBOL_GAP;
        break;
      case '/':
        gap = timing.WORD_GAP - timing.SYMBOL_GAP;
        break;
    }

    timeoutRef.current = setTimeout(processQueue, duration + gap);
  }, [playSound, stop, timing]);

  const play = useCallback((morseCode: string) => {
    initializeAudio();
    const validSymbols = morseCode.split('').filter(s => ['.', '-', ' ', '/'].includes(s));
    morseQueueRef.current = validSymbols as MorseSymbol[];
    currentPositionRef.current = 0;
    setStatus('playing');
    processQueue();
  }, [initializeAudio, processQueue]);
  
  const pause = useCallback(() => {
    if (status !== 'playing') return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    cleanupAudio();
    setStatus('paused');
  }, [status, cleanupAudio]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    initializeAudio();
    setStatus('playing');
    processQueue();
  }, [status, initializeAudio, processQueue]);
  
  useEffect(() => {
    return () => {
        cleanupAudio();
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, [cleanupAudio]);

  return { status, play, pause, resume, stop, analyserNode };
};
