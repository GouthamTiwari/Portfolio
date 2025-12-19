import React from 'react';
import { useMorseTap } from '../hooks/useMorseTap';

const MorseTap: React.FC = () => {
  const {
    tappedText,
    tappedMorse,
    isTapping,
    tapButtonProps,
    clear,
  } = useMorseTap();

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-6 text-center shadow-2xl shadow-black/20 h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-gray-200">Morse Tap</h2>
        <p className="text-gray-500">Practice sending! Click or hold Spacebar.</p>
      </div>
      
      <div className="w-full min-h-[100px] bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center flex-grow">
        <p 
          className="text-4xl font-semibold text-gray-100 h-12" 
          aria-live="polite"
          aria-label="Decoded text"
        >
          {tappedText || <span className="text-gray-600">Text appears here</span>}
        </p>
        <p 
          className="font-mono text-xl text-cyan-400 tracking-widest h-8"
          aria-live="polite"
          aria-label="Tapped morse code"
        >
          {tappedMorse || <span className="text-gray-600">...---...</span>}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          {...tapButtonProps}
          className={`w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-700 text-gray-300 font-bold text-2xl select-none transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/50
            ${isTapping ? 'scale-95 bg-cyan-500/20 border-cyan-500' : 'hover:border-gray-500'}`}
          aria-label="Tap button for morse code input"
        >
          TAP
        </button>
        <button
          onClick={clear}
          className="px-6 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-full font-semibold hover:bg-gray-700 hover:border-cyan-500 transition-all disabled:opacity-50"
          aria-label="Clear tapped input"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default MorseTap;