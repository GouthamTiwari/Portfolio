import { MORSE_CODE_MAP } from '../constants';

export const textToMorse = (text: string): string => {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char === ' ') {
        return '/'; // Word separator
      }
      return MORSE_CODE_MAP[char as keyof typeof MORSE_CODE_MAP] || '';
    })
    .join(' '); // Letter separator
};

// Create a reverse map for Morse to Text conversion
const MORSE_CODE_REVERSE_MAP: { [key: string]: string } = Object.entries(
  MORSE_CODE_MAP
).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as { [key: string]: string });


export const morseToText = (morse: string): string => {
  // Guard against invalid characters to prevent errors
  const sanitizedMorse = morse.replace(/[^.\- /]/g, '');

  return sanitizedMorse
    .split('/') // Split by word separator
    .map(word => 
      word
        .trim()
        .split(' ') // Split by letter separator
        .map(code => MORSE_CODE_REVERSE_MAP[code] || '') // Find character for each code
        .join('')
    )
    .join(' '); // Join words with a space
};