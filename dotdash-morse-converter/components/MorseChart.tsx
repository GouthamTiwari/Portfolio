import React from 'react';
import { MORSE_CODE_MAP } from '../constants';

const MorseChart: React.FC = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/20 h-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Morse Reference</h2>
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2">
        {characters.map(char => (
          <div 
            key={char}
            className="flex flex-col items-center justify-center p-2 bg-gray-900 border border-gray-800 rounded-lg aspect-square transition-all duration-200 hover:bg-gray-800 hover:border-cyan-500 hover:scale-105"
          >
            <span className="text-xl sm:text-2xl font-bold text-gray-200">{char}</span>
            <span className="text-sm sm:text-base font-mono text-cyan-400">{MORSE_CODE_MAP[char as keyof typeof MORSE_CODE_MAP]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MorseChart;