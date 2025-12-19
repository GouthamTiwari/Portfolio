import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        {children}
    </svg>
);

export const ConvertIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 4.5M21 9H3" />
    </IconWrapper>
);

export const PracticeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.026 16.026 0 010-2.56m5.84 2.56a16.026 16.026 0 000-2.56m-5.84 2.56a6 6 0 01-7.38-5.84m-2.56 5.84a16.026 16.026 0 00-2.56 0m2.56-5.84a6 6 0 015.84-7.38v4.82m-5.84 2.56a16.026 16.026 0 010 2.56m-5.84-2.56a16.026 16.026 0 000 2.56m5.84-2.56a6 6 0 017.38 5.84m2.56-5.84a16.026 16.026 0 002.56 0m-2.56 5.84a6 6 0 01-5.84 7.38m-4.82-7.38a16.026 16.026 0 00-2.56 0" />
    </IconWrapper>
);

export const ListenIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
    </IconWrapper>
);

export const LearnIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </IconWrapper>
);

export const SettingsIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.002 1.119-1.112l.143-.021c.561-.091 1.13.208 1.436.671l.09.123a3.42 3.42 0 004.09 2.185l.135-.045c.553-.183 1.15.15 1.445.698l.088.161c.294.549.125 1.222-.401 1.577l-.123.082a3.42 3.42 0 00-2.185 4.09l.045.135c.183.553-.15 1.15-.698 1.445l-.161.088c-.549.294-1.222.125-1.577-.401l-.082-.123a3.42 3.42 0 00-4.09-2.185l-.135.045c-.553.183-1.15-.15-1.445-.698l-.088-.161a1.92 1.92 0 01-.401-1.577l.082-.123a3.42 3.42 0 002.185-4.09l-.045-.135a1.92 1.92 0 01-.698-1.445l-.161-.088a1.92 1.92 0 01-1.577-.401l.123.082zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </IconWrapper>
);