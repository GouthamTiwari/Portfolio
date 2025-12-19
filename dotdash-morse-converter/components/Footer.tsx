import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center text-gray-600 p-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
        <p className="text-sm">Crafted with dots, dashes, and dedication.</p>
        <p className="text-xs">
          Stay curious. Stay connected. |{' '}
          <a 
            href="https://github.com/google/labs-prototypes" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition-colors"
          >
            Source Code
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
