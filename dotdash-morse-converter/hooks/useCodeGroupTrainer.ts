import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useMorseAudio } from './useMorseAudio';
import { textToMorse } from '../utils/morseConverter';

interface CodeGroupTrainerProps {
    characterWpm: number;
    effectiveWpm: number;
    isFarnsworthEnabled: boolean;
    toneFrequency: number;
}

export interface CodeGroupTrainerState {
    score: number;
    attempts: number;
    currentGroup: string | null;
    guess: string;
    feedback: {
        isCorrect: boolean;
        correctAnswer: string;
    } | null;
    isPlaying: boolean;
    isSessionActive: boolean;
}

const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const generateCodeGroup = () => {
    let group = '';
    for (let i = 0; i < 5; i++) {
        group += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
    }
    return group;
};


export const useCodeGroupTrainer = (props: CodeGroupTrainerProps) => {
    const [state, setState] = useState<CodeGroupTrainerState>({
        score: 0,
        attempts: 0,
        currentGroup: null,
        guess: '',
        feedback: null,
        isPlaying: false,
        isSessionActive: false,
    });
    
    const timeoutIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    const audio = useMorseAudio({
        onPlaybackTick: (symbol) => {
            if (symbol === null) { // null signifies playback has stopped
                setState(s => ({...s, isPlaying: false}));
            }
        },
        ...props,
    });

    // Effect for robust cleanup on unmount
    useEffect(() => {
        return () => {
            timeoutIds.current.forEach(clearTimeout);
            audio.stop();
        };
    }, [audio]);

    const safeSetTimeout = (callback: () => void, delay: number) => {
        const id = setTimeout(() => {
            timeoutIds.current.delete(id);
            callback();
        }, delay);
        timeoutIds.current.add(id);
    };

    const playChallenge = useCallback((challenge: string) => {
        if (!challenge) return;
        const morse = textToMorse(challenge);
        setState(s => ({ ...s, isPlaying: true }));
        audio.play(morse);
    }, [audio]);

    const playNext = useCallback(() => {
        const nextChallenge = generateCodeGroup();
        
        setState(s => ({
            ...s,
            currentGroup: nextChallenge,
            guess: '',
            feedback: null,
        }));
        
        playChallenge(nextChallenge);
    }, [playChallenge]);

    const replayCurrent = useCallback(() => {
        if (state.currentGroup) {
            playChallenge(state.currentGroup);
        }
    }, [state.currentGroup, playChallenge]);

    const setGuess = useCallback((value: string) => {
        setState(s => ({ ...s, guess: value.toUpperCase() }));
    }, []);

    const checkGuess = useCallback(() => {
        if (!state.currentGroup || state.guess.trim() === '' || state.isPlaying) return;

        const isCorrect = state.guess.trim() === state.currentGroup;

        setState(s => ({
            ...s,
            score: isCorrect ? s.score + 1 : s.score,
            attempts: s.attempts + 1,
            feedback: {
                isCorrect,
                correctAnswer: s.currentGroup!,
            }
        }));
        
        if (isCorrect) {
            safeSetTimeout(playNext, 1200);
        } else {
            playChallenge(state.currentGroup!);
            safeSetTimeout(playNext, 2500);
        }

    }, [state.guess, state.currentGroup, state.isPlaying, playNext, playChallenge]);

    const startSession = useCallback(() => {
        setState(s => ({
            ...s,
            isSessionActive: true,
            score: 0,
            attempts: 0,
            feedback: null,
            guess: '',
        }));
        safeSetTimeout(playNext, 100);
    }, [playNext]);


    const actions = useMemo(() => ({
        replayCurrent: () => !state.isPlaying && replayCurrent(),
        setGuess,
        checkGuess,
        startSession,
    }), [replayCurrent, setGuess, checkGuess, startSession, state.isPlaying]);
    
    return {
        state,
        actions,
    };
};