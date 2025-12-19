import React from 'react';
import { AppTab } from '../App';
import { ConvertIcon, PracticeIcon, LearnIcon, SettingsIcon } from './icons/NavIcons';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const NavButton: React.FC<{
  label: string;
  tab: AppTab;
  activeTab: AppTab;
  onClick: (tab: AppTab) => void;
  children: React.ReactNode;
}> = ({ label, tab, activeTab, onClick, children }) => {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => onClick(tab)}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
        isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-cyan-400 rounded-full" />
      )}
    </button>
  );
};

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-full p-2 flex items-center justify-center gap-1 sm:gap-2 shadow-2xl shadow-black/20 overflow-x-auto">
      <NavButton label="Convert" tab="convert" activeTab={activeTab} onClick={setActiveTab}><ConvertIcon /></NavButton>
      <NavButton label="Practice" tab="practice" activeTab={activeTab} onClick={setActiveTab}><PracticeIcon /></NavButton>
      <NavButton label="Learn" tab="learn" activeTab={activeTab} onClick={setActiveTab}><LearnIcon /></NavButton>
      <NavButton label="Settings" tab="settings" activeTab={activeTab} onClick={setActiveTab}><SettingsIcon /></NavButton>
    </nav>
  );
};

export default Navigation;