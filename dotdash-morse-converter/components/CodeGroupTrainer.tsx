import React, { useEffect, useRef } from 'react';
import { useCodeGroupTrainer, CodeGroupTrainerState } from '../hooks/useCodeGroupTrainer';
import { PlayIcon } from './icons/AudioIcons';

interface CodeGroupTrainerProps {
    characterWpm: number;
    effectiveWpm: number;
    isFarnsworthEnabled: boolean;
    toneFrequency: number;
}

const FeedbackDisplay: React.FC<{ state: CodeGroupTrainerState }> = ({ state }) => {
    if (state.feedback === null) {
        return <p className="text-gray-500 h-6">Guess the 5-character group!</p>;
    }
    if (state.feedback.isCorrect) {
        return <p className="text-green-400 h-6">Correct! Next challenge...</p>;
    }
    return <p className="text-red-400 h-6">Incorrect! The answer was <span className="font-bold font-mono tracking-widest">{state.feedback.correctAnswer}</span></p>;
};

const CodeGroupTrainer: React.FC<CodeGroupTrainerProps> = (props) => {
    const { state, actions } = useCodeGroupTrainer(props);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            actions.checkGuess();
        }
    };

    // Auto-focus the input when a new challenge is presented
    useEffect(() => {
        if (!state.feedback && !state.isPlaying) {
            inputRef.current?.focus();
        }
    }, [state.currentGroup, state.feedback, state.isPlaying]);

    if (!state.isSessionActive) {
        return (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 text-center shadow-2xl shadow-black/20 h-full">
                <div className="w-full">
                    <h2 className="text-3xl font-bold text-gray-200">Code Group Trainer</h2>
                    <p className="text-gray-500">Practice copying random 5-character groups to build speed.</p>
                </div>
                <button 
                    onClick={actions.startSession}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 text-black rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95"
                >
                    <PlayIcon />
                    <span>Start Training</span>
                </button>
            </div>
        )
    }

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4 text-center shadow-2xl shadow-black/20 h-full">
            <div className="w-full">
                <h2 className="text-3xl font-bold text-gray-200">Code Group Trainer</h2>
                <p className="text-gray-500">Listen, then type the group.</p>
            </div>

            <div className="w-full min-h-[80px] bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center flex-grow gap-2">
                <div className="text-xl font-semibold text-gray-100" aria-live="polite">
                    Score: <span className="text-cyan-400">{state.score} / {state.attempts}</span>
                </div>
                <FeedbackDisplay state={state} />
            </div>
            
            <div className="flex items-center gap-3 w-full">
                 <button
                    onClick={actions.replayCurrent}
                    disabled={state.isPlaying}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-cyan-500 text-black rounded-full transition-all hover:scale-105 active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                    aria-label="Replay morse sound"
                    >
                    <PlayIcon />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    value={state.guess}
                    onChange={(e) => actions.setGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!!state.feedback || state.isPlaying}
                    className={`w-full h-12 text-center bg-gray-800 border-2 border-gray-700 rounded-lg text-lg md:text-xl font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300 disabled:bg-gray-900 disabled:cursor-not-allowed font-mono tracking-widest`}
                    placeholder="5-CHAR GROUP"
                    maxLength={5}
                    aria-label="Your guess"
                />
                 <button
                    onClick={actions.checkGuess}
                    disabled={!!state.feedback || state.guess.trim() === '' || state.isPlaying}
                    className="px-5 py-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-full font-semibold hover:bg-gray-700 hover:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Check
                </button>
            </div>
        </div>
    );
};

export default CodeGroupTrainer;