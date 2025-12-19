import { useState, useRef, useCallback, useEffect } from 'react';
import { morseToText } from '../utils/morseConverter';

// Timing constants (in milliseconds)
const DOT_THRESHOLD = 180;
const LETTER_GAP_THRESHOLD = 500;
const WORD_GAP_THRESHOLD = 1200;

// Audio analysis constants
const MIN_RMS_THRESHOLD = 0.015; // Minimum sensitivity for sound detection
const PEAK_DETECTION_FACTOR = 1.8; // How much louder a sound has to be than the previous sample to be considered a 'peak'
const SMOOTHING_TIME_CONSTANT = 0.1;

type ListenerStatus = 'idle' | 'listening' | 'permission_denied' | 'error';

export const useMorseListener = () => {
    const [status, setStatus] = useState<ListenerStatus>('idle');
    const [morse, setMorse] = useState('');
    const [text, setText] = useState('');

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    
    const soundStartRef = useRef<number>(0);
    const silenceStartRef = useRef<number>(0);
    const morseRef = useRef('');
    const lastRmsRef = useRef(0);

    const updateMorse = useCallback((newMorse: string) => {
        morseRef.current = newMorse;
        setMorse(newMorse);
        setText(morseToText(newMorse));
    }, []);

    const processSilence = useCallback((duration: number) => {
        if (duration > WORD_GAP_THRESHOLD) {
            if (!morseRef.current.endsWith(' / ') && morseRef.current.trim().length > 0) {
                updateMorse(morseRef.current.trim() + ' / ');
            }
        } else if (duration > LETTER_GAP_THRESHOLD) {
            if (!morseRef.current.endsWith(' ') && morseRef.current.trim().length > 0) {
                 updateMorse(morseRef.current + ' ');
            }
        }
    }, [updateMorse]);

    const processSound = useCallback((duration: number) => {
        const symbol = duration < DOT_THRESHOLD ? '.' : '-';
        updateMorse(morseRef.current + symbol);
    }, [updateMorse]);


    const analyze = useCallback(() => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        let sumSquares = 0.0;
        for (const amplitude of dataArray) {
            const normalized = amplitude / 128.0 - 1.0;
            sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / bufferLength);

        // Peak detection logic: a sound is a sharp increase above a minimum threshold.
        const isSound = (rms > MIN_RMS_THRESHOLD) && (rms > lastRmsRef.current * PEAK_DETECTION_FACTOR);
        const now = performance.now();

        if (isSound) {
            if (soundStartRef.current === 0) { // Sound just started
                soundStartRef.current = now;
                const silenceDuration = now - silenceStartRef.current;
                if (silenceStartRef.current > 0) {
                   processSilence(silenceDuration);
                }
            }
        } else { // It's silent
            if (soundStartRef.current > 0) { // Sound just ended
                const soundDuration = now - soundStartRef.current;
                processSound(soundDuration);
                soundStartRef.current = 0;
                silenceStartRef.current = now;
            }
        }
        
        lastRmsRef.current = rms;
        animationFrameRef.current = requestAnimationFrame(analyze);
    }, [processSound, processSilence]);


    const start = useCallback(async () => {
        if (status === 'listening' || !navigator.mediaDevices?.getUserMedia) {
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;

            const source = context.createMediaStreamSource(stream);
            const analyser = context.createAnalyser();
            analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
            analyser.fftSize = 2048;

            source.connect(analyser);
            analyserRef.current = analyser;
            
            setStatus('listening');
            soundStartRef.current = 0;
            silenceStartRef.current = performance.now();
            lastRmsRef.current = 0;
            animationFrameRef.current = requestAnimationFrame(analyze);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            if(err instanceof DOMException && err.name === 'NotAllowedError') {
                 setStatus('permission_denied');
            } else {
                 setStatus('error');
            }
        }
    }, [status, analyze]);

    const stop = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        
        // Final check for any lingering sounds/silences
        const now = performance.now();
         if (soundStartRef.current > 0) {
            const soundDuration = now - soundStartRef.current;
            processSound(soundDuration);
        } else if (silenceStartRef.current > 0) {
            const silenceDuration = now - silenceStartRef.current;
            processSilence(silenceDuration);
        }

        setStatus('idle');
    }, [processSound, processSilence]);
    
    useEffect(() => {
        return () => {
            // Cleanup on unmount
            stop();
        };
    }, [stop]);

    return { status, morse, text, start, stop };
};