import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function CafeteriaScene() {
  const setScene = useGameStore((state) => state.setScene);
  const updateScores = useGameStore((state) => state.updateScores);
  
  const [foundSignals, setFoundSignals] = useState({
    notification: false,
    lunchTray: false,
    bodyLanguage: false,
  });

  // This state holds the current dialogue to display based on what the player clicks
  const [activeDialogue, setActiveDialogue] = useState([
    { speaker: "AVERY", text: "Take a look around. Most people think loneliness is easy to spot. Someone sitting alone. Someone crying. Usually, it's not that obvious." },
    { speaker: "SYSTEM", text: "(Click around the frozen scene to find 3 hidden clues)" }
  ]);

  const handleFindSignal = (signal) => {
    if (!foundSignals[signal]) {
      setFoundSignals(prev => ({ ...prev, [signal]: true }));
      updateScores(0, 5); 

      // Load the specific script dialogue for each hotspot
      if (signal === 'notification') {
        setActiveDialogue([
          { speaker: "SYSTEM", text: "'Jaden tagged Sofia, Ethan, Chloe and 7 others.' The image expands. Everyone from Maya's table appears in the picture. Except Maya." },
          { speaker: "AVERY", text: "Notice that? The photo. Look closer." },
          { speaker: "PLAYER", text: "Maybe she couldn't make it." },
          { speaker: "AVERY", text: "Maybe." }
        ]);
      } else if (signal === 'lunchTray') {
        setActiveDialogue([
          { speaker: "SYSTEM", text: "A sandwich sits untouched. Juice unopened." },
          { speaker: "AVERY", text: "Hmm, she hasn't taken her lunch?" },
          { speaker: "PLAYER", text: "Maybe she already ate." },
          { speaker: "AVERY", text: "Maybe. (sigh). You know what, something feels off." }
        ]);
      } else if (signal === 'bodyLanguage') {
        setActiveDialogue([
          { speaker: "SYSTEM", text: "Maya is sitting slightly turned away from the table. Bag already on her shoulder. One foot pointed toward the exit." },
          { speaker: "AVERY", text: "People do interesting things when they don't feel comfortable somewhere. Sometimes they leave. Sometimes they prepare to leave." },
          { speaker: "PLAYER", text: "Annd here we go... Suddenly you're the behavioural expert." },
          { speaker: "AVERY", text: "Ha. Ha. Funny. Joke about it all you want but I ain't all blind." }
        ]);
      }
    }
  };

  const allFound = Object.values(foundSignals).every(Boolean);

  return (
    <div className="flex flex-col items-center w-full gap-4">
      
      {/* Narrative Description */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200 w-full text-center">
        <p className="text-gray-700 italic text-lg leading-relaxed">
          The cafeteria buzzes with life. Maya sits near the edge of a crowded table. She isn't alone. But she doesn't look included either. The screen freezes. Everything around Maya slows.
        </p>
      </div>

      {/* The Interactive "Frozen Room" */}
      <div className="relative w-full h-[350px] bg-slate-200 border-2 border-slate-400 rounded-lg shadow-inner overflow-hidden">
        
        {/* Hotspot 1: Body Language */}
        <button 
          onClick={() => handleFindSignal('bodyLanguage')}
          className={`absolute top-1/4 left-1/4 p-3 font-bold text-sm transition-all duration-300 rounded-full border-2 
            ${foundSignals.bodyLanguage ? 'border-purple-500 bg-purple-100 text-purple-700' : 'border-dashed border-slate-500 text-slate-600 hover:bg-slate-300'}`}
        >
          {foundSignals.bodyLanguage ? "✓ Posture Noted" : "Inspect Posture"}
        </button>

        {/* Hotspot 2: Untouched Lunch */}
        <button 
          onClick={() => handleFindSignal('lunchTray')}
          className={`absolute bottom-1/4 left-1/3 p-3 font-bold text-sm transition-all duration-300 rounded-full border-2 
            ${foundSignals.lunchTray ? 'border-purple-500 bg-purple-100 text-purple-700' : 'border-dashed border-slate-500 text-slate-600 hover:bg-slate-300'}`}
        >
          {foundSignals.lunchTray ? "✓ Lunch Noted" : "Inspect Table"}
        </button>

        {/* Hotspot 3: Phone Notification */}
        <button 
          onClick={() => handleFindSignal('notification')}
          className={`absolute top-1/3 right-1/4 p-3 font-bold text-sm transition-all duration-300 rounded-full border-2 
            ${foundSignals.notification ? 'border-purple-500 bg-purple-100 text-purple-700' : 'border-dashed border-slate-500 text-slate-600 hover:bg-slate-300'}`}
        >
          {foundSignals.notification ? "✓ Tag Noted" : "Inspect Phone"}
        </button>
      </div>

      {/* Dynamic Dialogue Box */}
      <div className="w-full bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg border-4 border-gray-700 min-h-[180px] flex flex-col gap-3">
        {activeDialogue.map((line, index) => (
          <div key={index} className="animate-fade-in">
            <span className={`font-bold mr-2 tracking-wide ${
              line.speaker === 'AVERY' ? 'text-blue-400' : 
              line.speaker === 'PLAYER' ? 'text-green-400' : 'text-gray-500 italic'
            }`}>
              {line.speaker}:
            </span>
            <span className={line.speaker === 'SYSTEM' ? 'text-gray-400 italic' : 'text-gray-200'}>
              {line.text}
            </span>
          </div>
        ))}

        {/* Proceed Button - Appears only when all 3 are found */}
        {allFound && (
          <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col items-end animate-fade-in">
            <p className="text-purple-400 font-bold mb-3 italic">"They're starting to look like a pattern..."</p>
            <button 
              onClick={() => setScene('ch1_after_school_text')}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-blue-500 transition-colors"
            >
              Unfreeze Time & Go to Hallway →
            </button>
          </div>
        )}
      </div>

    </div>
  );
}