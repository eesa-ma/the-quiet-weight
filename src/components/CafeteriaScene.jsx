import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function CafeteriaScene() {
  const { setScene, updateScores } = useGameStore();
  
  // Track which hidden signals the player has found
  const [foundSignals, setFoundSignals] = useState({
    bodyLanguage: false,
    lunchTray: false,
    notification: false,
  });

  const handleFindSignal = (signal) => {
    if (!foundSignals[signal]) {
      setFoundSignals(prev => ({ ...prev, [signal]: true }));
      // Award 5 Awareness points for finding a hidden signal
      updateScores(0, 5); 
    }
  };

  const allFound = Object.values(foundSignals).every(Boolean);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-white p-6 rounded-t-lg shadow-sm border-2 border-b-0 border-gray-200 w-full mb-0">
        <p className="text-gray-700 italic text-lg leading-relaxed">
          The cafeteria is noisy. Every table is full. Maya sits at the edge of a table near the door — technically with people, but turned slightly away. She's scrolling. A laughing group nearby tags each other in a post. Maya sees the notification — she isn't tagged. She double-taps to like it.
        </p>
      </div>

      {/* The Interactive "Room" */}
      <div className="relative w-full h-100 bg-slate-100 border-2 border-gray-200 rounded-b-lg shadow-md overflow-hidden">
        
        {/* Hotspot 1: Body Language */}
        <button 
          onClick={() => handleFindSignal('bodyLanguage')}
          className={`absolute top-1/4 left-1/4 p-4 font-semibold text-sm transition-all duration-300 rounded-full border-2 
            ${foundSignals.bodyLanguage ? 'border-green-500 bg-green-100 text-green-700' : 'border-dashed border-slate-400 text-slate-500 hover:bg-slate-200 hover:border-slate-500'}`}
        >
          {foundSignals.bodyLanguage ? "✓ Turned Away" : "Inspect Posture"}
        </button>

        {/* Hotspot 2: Untouched Lunch */}
        <button 
          onClick={() => handleFindSignal('lunchTray')}
          className={`absolute bottom-1/4 left-1/3 p-4 font-semibold text-sm transition-all duration-300 rounded-full border-2 
            ${foundSignals.lunchTray ? 'border-green-500 bg-green-100 text-green-700' : 'border-dashed border-slate-400 text-slate-500 hover:bg-slate-200 hover:border-slate-500'}`}
        >
          {foundSignals.lunchTray ? "✓ Untouched Tray" : "Inspect Table"}
        </button>

        {/* Hotspot 3: Phone Notification */}
        <button 
          onClick={() => handleFindSignal('notification')}
          className={`absolute top-1/3 right-1/4 p-4 font-semibold text-sm transition-all duration-300 rounded-full border-2 
            ${foundSignals.notification ? 'border-green-500 bg-green-100 text-green-700' : 'border-dashed border-slate-400 text-slate-500 hover:bg-slate-200 hover:border-slate-500'}`}
        >
          {foundSignals.notification ? "✓ Liked Post (Not Tagged)" : "Inspect Phone"}
        </button>

        {/* Proceed Button - Only renders when all 3 are found */}
        {allFound && (
          <div className="absolute bottom-6 right-6 flex flex-col items-end animate-fade-in">
            <p className="text-green-600 font-bold mb-3">All signals found!</p>
            <button 
              onClick={() => setScene('ch1_after_school_text')}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Continue to After School →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}