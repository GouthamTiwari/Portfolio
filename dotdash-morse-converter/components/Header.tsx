import React from 'react';
import { AppTab } from '../App';
import Navigation from './Navigation';

interface HeaderProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gray-100 flex items-center justify-center gap-x-3">
          <span>Dot</span>
          <span 
            className="w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400 rounded-full inline-block animate-pulse"
            style={{ boxShadow: '0 0 15px 5px rgba(0, 255, 255, 0.4)' }}
          ></span>
          <span>Dash</span>
        </h1>
        <p className="text-gray-400 mt-2 text-md">The Modern Morse Code Toolkit</p>
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </header>
  );
};

export default Header;