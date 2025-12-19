import React, { useState, useCallback } from 'react';
import { useMorseAudio, MorseSymbol } from '../hooks/useMorseAudio';
import { PlayIcon, PauseIcon, StopIcon } from './icons/AudioIcons';
import SOSButton from './SOSButton';
import WaveformVisualizer from './WaveformVisualizer';

interface ConverterProps {
  inputText: string;
  onInputChange: (text: string) => void;
  morseCode: string;
  onMorseChange: (morse: string) => void;
  characterWpm: number;
  effectiveWpm: number;
  isFarnsworthEnabled: boolean;
  toneFrequency: number;
}

const Flasher: React.FC<{ isFlashing: boolean }> = ({ isFlashing }) => (
    <div 
        className={`fixed inset-0 z-50 pointer-events-none morse-shockwave ${isFlashing ? 'active' : ''}`} 
    />
);

const ArrowsRightLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" />
    </svg>
);

const Converter: React.FC<ConverterProps> = ({ inputText, onInputChange, morseCode, onMorseChange, characterWpm, effectiveWpm, isFarnsworthEnabled, toneFrequency }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [useFlasher, setUseFlasher] = useState(false);

  const handlePlaybackTick = useCallback((symbol: MorseSymbol | null) => {
    const isActive = symbol === '.' || symbol === '-';
    if(useFlasher) {
        setIsFlashing(isActive);
    }
  }, [useFlasher]);

  const { status, play, pause, resume, stop, analyserNode } = useMorseAudio({
    onPlaybackTick: handlePlaybackTick,
    characterWpm,
    effectiveWpm,
    isFarnsworthEnabled,
    toneFrequency,
  });

  const handlePlayPause = useCallback(() => {
    if (status === 'playing') {
      pause();
    } else if (status === 'paused') {
      resume();
    } else {
      play(morseCode);
    }
  }, [status, morseCode, play, pause, resume]);

  return (
    <>
      <Flasher isFlashing={isFlashing} />
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/20">
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter Text..."
            className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-colors"
            aria-label="Text Input"
          />
          
          <div className="absolute md:static top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 p-2 bg-gray-900/50 md:bg-transparent rounded-full z-10" aria-hidden="true">
              <ArrowsRightLeftIcon />
          </div>

          <textarea
            value={morseCode}
            onChange={(e) => onMorseChange(e.target.value)}
            placeholder="Enter Morse Code..."
            className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono tracking-widest text-cyan-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
            aria-label="Morse Code Output/Input"
          />
        </div>
        <div className="flex items-center justify-between mt-2 p-3 bg-gray-900 rounded-full border border-gray-800 gap-4">
          <div className="flex items-center gap-2">
             <SOSButton wpm={characterWpm} useFlasher={useFlasher} toneFrequency={toneFrequency} />
             <button
              onClick={handlePlayPause}
              disabled={!morseCode}
              className="w-12 h-12 flex items-center justify-center bg-cyan-500 text-black rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
              aria-label={status === 'playing' ? 'Pause Morse Code Audio' : 'Play Morse Code Audio'}
            >
              {status === 'playing' ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              onClick={stop}
              disabled={status === 'stopped'}
              className="w-12 h-12 flex items-center justify-center bg-gray-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
              aria-label="Stop Morse Code Audio"
            >
              <StopIcon />
            </button>
          </div>
          <div className="flex-grow mx-2">
            <WaveformVisualizer analyserNode={analyserNode} />
          </div>
          <div className="flex-shrink-0">
             <label htmlFor="flasher-toggle" className="flex items-center cursor-pointer">
              <span className="mr-2 text-gray-400 text-sm">Flasher</span>
              <div className="relative">
                  <input type="checkbox" id="flasher-toggle" className="sr-only" checked={useFlasher} onChange={() => setUseFlasher(!useFlasher)} />
                  <div className="block bg-gray-700 w-10 h-6 rounded-full"></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useFlasher ? 'translate-x-full bg-cyan-400' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Converter;