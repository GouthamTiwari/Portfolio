
import React, { useState, useCallback, useRef } from 'react';
import { MORSE_CODE_FUN_FACTS } from '../constants';

const FunFactGenerator: React.FC = () => {
  const [fact, setFact] = useState<string | null>(null);
  const factIndexRef = useRef(0);

  const showNextFact = useCallback(() => {
    setFact(MORSE_CODE_FUN_FACTS[factIndexRef.current]);
    // Move to the next index, looping back to 0 if at the end
    factIndexRef.current = (factIndexRef.current + 1) % MORSE_CODE_FUN_FACTS.length;
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4 text-center shadow-2xl shadow-black/20">
      <h3 className="text-xl font-bold text-gray-300">Did You Know?</h3>
      <div className="min-h-[60px] flex items-center justify-center">
        {fact ? (
          <p className="text-lg text-cyan-300 italic">"{fact}"</p>
        ) : (
          <p className="text-gray-500">Click the button to get a fun fact about Morse code!</p>
        )}
      </div>
      <button
        onClick={showNextFact}
        className="px-6 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-full font-semibold hover:bg-gray-700 hover:border-cyan-500 transition-all"
      >
        {fact ? 'Show Another Fact' : 'Get a Fun Fact'}
      </button>
    </div>
  );
};

export default FunFactGenerator;
