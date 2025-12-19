import React from 'react';

interface SettingsProps {
    characterWpm: number;
    setCharacterWpm: (wpm: number) => void;
    effectiveWpm: number;
    setEffectiveWpm: (wpm: number) => void;
    isFarnsworthEnabled: boolean;
    setIsFarnsworthEnabled: (enabled: boolean) => void;
    toneFrequency: number;
    setToneFrequency: (freq: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    characterWpm, setCharacterWpm,
    effectiveWpm, setEffectiveWpm,
    isFarnsworthEnabled, setIsFarnsworthEnabled,
    toneFrequency, setToneFrequency 
}) => {

  const handleEffectiveWpmChange = (value: number) => {
    // Effective WPM cannot be higher than character WPM
    if (value < characterWpm) {
        setEffectiveWpm(value);
    }
  };

  const maxEffectiveWpm = characterWpm > 5 ? characterWpm - 1 : 4;


  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/20 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-300">Settings</h2>
      <div className="space-y-8">
        <div>
          <label htmlFor="character-wpm-slider" className="block mb-2 text-lg font-medium text-gray-300">
            Character Speed: <span className="font-bold text-cyan-400">{characterWpm} WPM</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">The speed at which individual dits and dahs are sent.</p>
          <input
            id="character-wpm-slider"
            type="range"
            min="5"
            max="40"
            step="1"
            value={characterWpm}
            onChange={(e) => setCharacterWpm(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            aria-label="Character Speed Slider"
          />
           <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 (Slow)</span>
                <span>40 (Fast)</span>
            </div>
        </div>

        <div className="border-t border-gray-800 pt-8 space-y-4">
             <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-300">Farnsworth Method</h3>
                    <p className="text-sm text-gray-500 mt-1">Practice with faster characters but longer pauses between them.</p>
                </div>
                <label htmlFor="farnsworth-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="farnsworth-toggle" className="sr-only" checked={isFarnsworthEnabled} onChange={() => setIsFarnsworthEnabled(!isFarnsworthEnabled)} />
                        <div className="block bg-gray-700 w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isFarnsworthEnabled ? 'translate-x-full bg-cyan-400' : ''}`}></div>
                    </div>
                </label>
            </div>
            {isFarnsworthEnabled && (
                <div>
                    <label htmlFor="effective-wpm-slider" className="block mb-2 text-lg font-medium text-gray-300">
                        Effective Speed: <span className="font-bold text-cyan-400">{effectiveWpm} WPM</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-3">The overall speed including the extended pauses. Must be slower than character speed.</p>
                    <input
                        id="effective-wpm-slider"
                        type="range"
                        min="2"
                        max={maxEffectiveWpm}
                        step="1"
                        value={effectiveWpm}
                        onChange={(e) => handleEffectiveWpmChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        aria-label="Effective Speed Slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>2 WPM</span>
                        <span>{maxEffectiveWpm} WPM</span>
                    </div>
                </div>
            )}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <label htmlFor="tone-slider" className="block mb-2 text-lg font-medium text-gray-300">
            Audio Tone: <span className="font-bold text-cyan-400">{toneFrequency} Hz</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">Change the frequency (pitch) of the Morse code audio tone.</p>
          <input
            id="tone-slider"
            type="range"
            min="400"
            max="1000"
            step="10"
            value={toneFrequency}
            onChange={(e) => setToneFrequency(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            aria-label="Audio Tone Frequency Slider"
          />
           <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>400 (Low)</span>
                <span>1000 (High)</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;