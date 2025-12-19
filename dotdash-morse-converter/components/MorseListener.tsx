import React from 'react';
import { useMorseListener } from '../hooks/useMorseListener';
import { ListenIcon } from './icons/NavIcons';

const MorseListener: React.FC = () => {
    const { status, morse, text, start, stop } = useMorseListener();

    const getStatusContent = () => {
        switch (status) {
            case 'idle':
                return {
                    title: 'Start Listening',
                    description: 'Click the button and tap morse code near your microphone.'
                };
            case 'permission_denied':
                return {
                    title: 'Microphone Access Denied',
                    description: 'Please grant microphone permissions in your browser settings to use this feature.'
                };
            case 'listening':
                return {
                    title: 'Listening...',
                    description: 'The microphone is active. Try tapping on your desk!'
                };
             case 'error':
                return {
                    title: 'An Error Occurred',
                    description: 'Could not access the microphone. Please ensure it is connected and not in use by another application.'
                };
            default:
                return {
                    title: 'Morse Listener',
                    description: 'An unknown state occurred.'
                };
        }
    };

    const { title, description } = getStatusContent();
    const isListening = status === 'listening';
    const isButtonDisabled = status === 'permission_denied' || status === 'error';

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-6 text-center shadow-2xl shadow-black/20">
            <div className="w-full">
                <h2 className="text-3xl font-bold text-gray-200">{title}</h2>
                <p className="text-gray-500">{description}</p>
            </div>
            
            <div className="w-full min-h-[100px] bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center">
                <p 
                    className="text-4xl font-semibold text-gray-100 h-12" 
                    aria-live="polite"
                    aria-label="Decoded text"
                >
                    {text || <span className="text-gray-600">Text appears here</span>}
                </p>
                <p 
                    className="font-mono text-xl text-cyan-400 tracking-widest h-8"
                    aria-live="polite"
                    aria-label="Detected morse code"
                >
                    {morse || <span className="text-gray-600">...---...</span>}
                </p>
            </div>

            <button
                onClick={isListening ? stop : start}
                disabled={isButtonDisabled}
                className={`w-32 h-32 rounded-full flex items-center justify-center border-2 text-gray-300 font-bold text-lg select-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed
                    ${isListening 
                        ? 'bg-red-500/20 border-red-500 animate-pulse' 
                        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                    }`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
                {isListening ? 'STOP' : <ListenIcon />}
            </button>
        </div>
    );
};

export default MorseListener;
