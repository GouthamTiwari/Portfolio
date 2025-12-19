import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useMorseAudio } from './useMorseAudio';
import { PRACTICE_WORDS } from '../constants';
import { textToMorse } from '../utils/morseConverter';

export type PracticeMode = 'letters' | 'words';

interface EchoTrainerProps {
    characterWpm: number;
    effectiveWpm: number;
    isFarnsworthEnabled: boolean;
    toneFrequency: number;
}

export interface EchoTrainerState {
    score: number;
    attempts: number;
    mode: PracticeMode;
    currentCharacter: string | null;
    guess: string;
    feedback: {
        isCorrect: boolean;
        correctAnswer: string;
    } | null;
    isPlaying: boolean;
    isSessionActive: boolean;
}

const PRACTICE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');
const CHALLENGE_LISTS: Record<PracticeMode, string[]> = {
    letters: PRACTICE_CHARS,
    words: PRACTICE_WORDS,
};

export const useEchoTrainer = (props: EchoTrainerProps) => {
    const [state, setState] = useState<EchoTrainerState>({
        score: 0,
        attempts: 0,
        mode: 'letters',
        currentCharacter: null,
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

    const playNext = useCallback((mode: PracticeMode) => {
        const challengeList = CHALLENGE_LISTS[mode];
        const randomIndex = Math.floor(Math.random() * challengeList.length);
        const nextChallenge = challengeList[randomIndex];
        
        setState(s => ({
            ...s,
            currentCharacter: nextChallenge,
            guess: '',
            feedback: null,
        }));
        
        playChallenge(nextChallenge);
    }, [playChallenge]);

    const replayCurrent = useCallback(() => {
        if (state.currentCharacter) {
            playChallenge(state.currentCharacter);
        }
    }, [state.currentCharacter, playChallenge]);

    const setGuess = useCallback((value: string) => {
        setState(s => ({ ...s, guess: value.toUpperCase() }));
    }, []);

    const checkGuess = useCallback(() => {
        if (!state.currentCharacter || state.guess.trim() === '' || state.isPlaying) return;

        const isCorrect = state.guess.trim() === state.currentCharacter;

        setState(s => ({
            ...s,
            score: isCorrect ? s.score + 1 : s.score,
            attempts: s.attempts + 1,
            feedback: {
                isCorrect,
                correctAnswer: s.currentCharacter!,
            }
        }));
        
        if (isCorrect) {
            // Automatically play the next one after a correct guess
            safeSetTimeout(() => playNext(state.mode), 1200);
        } else {
            // Replay the sound of the correct answer, then move on
            playChallenge(state.currentCharacter!);
            safeSetTimeout(() => playNext(state.mode), 2500); // Longer delay to allow listening and reading
        }

    }, [state.guess, state.currentCharacter, state.isPlaying, state.mode, playNext, playChallenge]);
    
    const setMode = useCallback((newMode: PracticeMode) => {
        if (state.mode === newMode) return;
        audio.stop();
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current.clear();

        setState(s => ({
            ...s,
            mode: newMode,
            score: 0,
            attempts: 0,
            feedback: null,
            guess: '',
            currentCharacter: null,
        }));
        // Use a timeout and pass the newMode directly to playNext to avoid closure issues with stale state.
        safeSetTimeout(() => playNext(newMode), 100);
    }, [playNext, audio, state.mode]);

    const startSession = useCallback(() => {
        setState(s => ({
            ...s,
            isSessionActive: true,
            score: 0,
            attempts: 0,
            feedback: null,
            guess: '',
        }));
        safeSetTimeout(() => playNext(state.mode), 100);
    }, [playNext, state.mode]);


    const actions = useMemo(() => ({
        replayCurrent: () => !state.isPlaying && replayCurrent(),
        setGuess,
        checkGuess,
        setMode,
        startSession,
    }), [replayCurrent, setGuess, checkGuess, setMode, startSession, state.isPlaying]);
    
    return {
        state,
        actions,
    };
};