import React from 'react';
import { MORSE_PROSIGNS_MAP } from '../constants';

const ProsignsChart: React.FC = () => {
  const prosigns = Object.entries(MORSE_PROSIGNS_MAP);

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/20 h-full">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-200">Pro-Signs Quick Reference</h2>
      <div className="space-y-3">
        {prosigns.map(([key, value]) => (
          <div 
            key={key}
            className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:border-cyan-500"
          >
            <div>
                <p className="text-base font-semibold text-gray-200">{value.name}</p>
                <p className="text-sm text-gray-500">Procedural Signal</p>
            </div>
            <div className="text-right">
                <span className="text-lg font-mono text-cyan-400 tracking-widest">{value.morse}</span>
                <p className="text-sm font-bold text-gray-400">({key})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProsignsChart;
