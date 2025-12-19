import React from 'react';

const AboutMorse: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20 text-gray-400 flex flex-col gap-y-6">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-200">The Secret Language of Dots & Dashes</h2>
      <div className="space-y-4 text-lg leading-relaxed">
        <p>
          Invented by Samuel Morse and Alfred Vail in the 1830s, <strong className="text-cyan-400 font-semibold">Morse Code</strong> is a timeless communication system that revolutionized long-distance messaging. It encodes characters into sequences of short signals (dots or "dits") and long signals (dashes or "dahs"). The iconic <strong className="text-cyan-400 font-semibold">SOS</strong> distress signal (<span className="font-mono tracking-widest">... --- ...</span>) is a universal call for help, a testament to the code's critical role in history.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3 text-gray-300">How Morse Code Works: The Rules of Rhythm</h3>
        <p className="space-y-4 text-base leading-relaxed">
          The elegance of Morse code lies in its timing. The "dit" is the basic unit of time. A "dah" is three times as long as a dit. The space between dits and dahs within a single character is one dit-length. The space between letters in a word is three dit-lengths, and the space between words is seven dit-lengths. Mastering this rhythm is key to achieving proficiency and speed in both sending and receiving.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3 text-gray-300">Learning Morse Code Today: Methods for Mastery</h3>
        <p className="space-y-4 text-base leading-relaxed">
         Learning Morse code, often called "CW" in the amateur radio community, is like learning a new language. Several methods exist to help you practice and improve your skills. The <strong className="text-cyan-400 font-semibold">Farnsworth method</strong>, which you can use in our settings, helps beginners by sending characters at a higher speed but with longer pauses between them. This helps with instant character recognition. The <strong className="text-cyan-400 font-semibold">Koch method</strong> involves learning characters at full speed from the start, adding new ones only after achieving high accuracy. This app's Echo and Code Group trainers are perfect tools for this kind of focused morse code practice.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-3 text-gray-300">Why is Morse Code Still Relevant?</h3>
        <p className="space-y-4 text-base leading-relaxed">
         While we have instant messaging, Morse code is far from a relic. It is a robust, low-bandwidth mode of communication still actively used by <strong className="text-cyan-400 font-semibold">amateur radio operators (ham radio)</strong> for worldwide contacts. Pilots use it for identifying navigational beacons, and it remains a vital backup communication method for the military. Its simplicity makes it an invaluable tool in emergency situations when other technology might fail. It’s a language of pure signal, elegant in its binary brilliance.
        </p>
      </div>
    </div>
  );
};

export default AboutMorse;