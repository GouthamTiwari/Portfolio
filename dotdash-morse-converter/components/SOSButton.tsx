import React, { useState, useCallback, useEffect } from 'react';
import { useMorseAudio, MorseSymbol } from '../hooks/useMorseAudio';

interface SOSButtonProps {
    wpm: number;
    useFlasher: boolean;
    toneFrequency: number;
}

const SOS_MORSE = '... --- ...';

const SOSButton: React.FC<SOSButtonProps> = ({ wpm, useFlasher, toneFrequency }) => {
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isSosFlashing, setIsSosFlashing] = useState(false);
    
    // This state is just to re-trigger the effect when the loop ends
    const [loopCount, setLoopCount] = useState(0);

    const handlePlaybackTick = useCallback((symbol: MorseSymbol | null) => {
        setIsSosFlashing(symbol === '.' || symbol === '-');
        if (symbol === null) { // Playback finished
            // Add a slight delay then loop
            setTimeout(() => setLoopCount(prev => prev + 1), 1000);
        }
    }, []);

    const { play, stop } = useMorseAudio({
        onPlaybackTick: handlePlaybackTick, 
        characterWpm: wpm,
        isFarnsworthEnabled: false, // SOS should always be standard timing
        toneFrequency
    });
    
    useEffect(() => {
        if (isBroadcasting) {
            play(SOS_MORSE);
        } else {
            stop();
        }
        // We only want to re-run this when broadcasting is toggled or a loop finishes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBroadcasting, loopCount]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => stop();
    }, [stop]);

    const toggleBroadcast = () => {
        if(isBroadcasting) {
            setIsBroadcasting(false);
        } else {
            setLoopCount(0); // Reset and start loop
            setIsBroadcasting(true);
        }
    };
    
    return (
        <>
            {isBroadcasting && useFlasher && (
                 <div className={`fixed inset-0 bg-red-600 z-50 pointer-events-none transition-opacity duration-100 ${isSosFlashing ? 'opacity-70' : 'opacity-0'}`} />
            )}
            <button
                onClick={toggleBroadcast}
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 border-2
                    ${isBroadcasting 
                        ? 'bg-red-500/80 border-red-400 animate-pulse' 
                        : 'bg-red-600/50 border-red-500/80'
                    }`}
                aria-label={isBroadcasting ? 'Stop SOS broadcast' : 'Start SOS broadcast'}
            >
                SOS
            </button>
        </>
    );
};

export default SOSButton;