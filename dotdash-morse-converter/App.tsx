
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Converter from './components/Converter';
import MorseChart from './components/MorseChart';
import FunFactGenerator from './components/FunFactGenerator';
import AboutMorse from './components/AboutMorse';
import MorseTap from './components/MorseTap';
import Settings from './components/Settings';
import Footer from './components/Footer';
import ProsignsChart from './components/ProsignsChart';
import EchoTrainer from './components/EchoTrainer';
import CodeGroupTrainer from './components/CodeGroupTrainer';
import MorseListener from './components/MorseListener';
import AdBanner from './components/AdBanner';
import { textToMorse, morseToText } from './utils/morseConverter';

export type AppTab = 'convert' | 'practice' | 'learn' | 'settings';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [morseCode, setMorseCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<AppTab>('convert');
  
  const [characterWpm, setCharacterWpm] = useState<number>(20);
  const [effectiveWpm, setEffectiveWpm] = useState<number>(10);
  const [isFarnsworthEnabled, setIsFarnsworthEnabled] = useState<boolean>(false);
  
  const [toneFrequency, setToneFrequency] = useState<number>(750);

  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
    setMorseCode(textToMorse(text));
  }, []);

  const handleMorseChange = useCallback((morse: string) => {
    setMorseCode(morse);
    setInputText(morseToText(morse));
  }, []);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'convert':
        return (
          <div className="flex flex-col gap-8">
            <Converter 
              inputText={inputText}
              onInputChange={handleInputChange}
              morseCode={morseCode}
              onMorseChange={handleMorseChange}
              characterWpm={characterWpm}
              effectiveWpm={effectiveWpm}
              isFarnsworthEnabled={isFarnsworthEnabled}
              toneFrequency={toneFrequency}
            />
            <FunFactGenerator />
            <AdBanner />
          </div>
        );
      case 'practice':
        return (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <EchoTrainer 
                  characterWpm={characterWpm} 
                  effectiveWpm={effectiveWpm} 
                  isFarnsworthEnabled={isFarnsworthEnabled} 
                  toneFrequency={toneFrequency}
              />
              <CodeGroupTrainer 
                  characterWpm={characterWpm}
                  effectiveWpm={effectiveWpm}
                  isFarnsworthEnabled={isFarnsworthEnabled}
                  toneFrequency={toneFrequency}
              />
              <MorseTap />
              <MorseListener />
            </div>
            <AdBanner />
          </div>
        );
       case 'learn':
          return (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                <div className="flex flex-col gap-8">
                  <MorseChart />
                  <ProsignsChart />
                </div>
                <AboutMorse />
              </div>
              <AdBanner />
            </div>
          );
      case 'settings':
          return (
            <div className="flex flex-col gap-8">
              <Settings 
                  characterWpm={characterWpm}
                  setCharacterWpm={setCharacterWpm}
                  effectiveWpm={effectiveWpm}
                  setEffectiveWpm={setEffectiveWpm}
                  isFarnsworthEnabled={isFarnsworthEnabled}
                  setIsFarnsworthEnabled={setIsFarnsworthEnabled}
                  toneFrequency={toneFrequency}
                  setToneFrequency={setToneFrequency}
              />
              <AdBanner />
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-10">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main>
              {renderContent()}
            </main>
            <Footer />
        </div>
    </div>
  );
};

export default App;