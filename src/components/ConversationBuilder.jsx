import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function ConversationBuilder() {
  const setScene = useGameStore((state) => state.setScene);
  const updateScores = useGameStore((state) => state.updateScores);

  const [draft, setDraft] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // The fragments the player can use to build their message
  const fragments = [
    { id: 'f1', text: "that sounds fun,", type: 'positive' },
    { id: 'f2', text: "i'll come by!", type: 'action' },
    { id: 'f3', text: "but i might leave early.", type: 'boundary' },
    { id: 'f4', text: "actually nevermind,", type: 'avoidance' },
    { id: 'f5', text: "too many people.", type: 'avoidance' },
    { id: 'f6', text: "i'm too tired.", type: 'avoidance' },
  ];

  const handleAddFragment = (fragment) => {
    if (!draft.find(f => f.id === fragment.id)) {
      setDraft([...draft, fragment]);
    }
  };

  const handleClear = () => {
    setDraft([]);
    setFeedback(null);
  };

  const handleSend = () => {
    if (draft.length === 0) return;

    const hasAvoidance = draft.some(f => f.type === 'avoidance');
    const hasAction = draft.some(f => f.type === 'action');
    const hasBoundary = draft.some(f => f.type === 'boundary');

    if (hasAvoidance) {
      setFeedback({
        message: "You backed out. Avoidance keeps you safe in the moment, but increases isolation later.",
        success: false,
        next: "ch1_avoidance"
      });
      updateScores(-5, 0);
    } else if (hasAction && hasBoundary) {
      setFeedback({
        message: "Excellent! Setting a boundary ('I might leave early') makes the social attempt feel much safer and more manageable.",
        success: true,
        next: "ch1_mayas_room"
      });
      updateScores(+10, +10);
    } else if (hasAction) {
      setFeedback({
        message: "Good job making the attempt! (Tip: It's okay to add a boundary like 'I might leave early' if you feel anxious).",
        success: true,
        next: "ch1_group_project"
      });
      updateScores(+5, +5);
    } else {
      setFeedback({
        message: "Your message is a bit incomplete. Try committing to going, or setting a boundary.",
        success: false,
        next: null
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-100 border-4 border-gray-800 rounded-[3rem] p-4 shadow-xl h-[600px] flex flex-col relative overflow-hidden">
      
      {/* Chat Header */}
      <div className="text-center pb-4 border-b border-gray-300">
        <h2 className="font-bold text-lg">Chat with Friend</h2>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="bg-gray-300 text-gray-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[80%]">
          just me, jaden, and sarah. it'll be super chill.
        </div>
        
        {/* The Draft Box */}
        <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[80%] min-h-[44px] flex flex-wrap gap-1">
          {draft.length === 0 ? <span className="opacity-50 italic">Draft message...</span> : null}
          {draft.map(f => <span key={f.id}>{f.text}</span>)}
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className={`m-4 p-4 rounded-xl border-2 shadow-lg z-10 ${feedback.success ? 'bg-green-100 border-green-500 text-green-800' : 'bg-orange-100 border-orange-500 text-orange-800'}`}>
          <p className="font-semibold text-sm mb-3">{feedback.message}</p>
          {feedback.next ? (
            <button 
              onClick={() => setScene(feedback.next)}
              className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold"
            >
              Continue →
            </button>
          ) : (
            <button onClick={handleClear} className="w-full bg-white border-2 border-gray-900 text-gray-900 py-2 rounded-lg font-bold">
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Word Bank Controls */}
      {!feedback && (
        <div className="bg-white p-4 border-t border-gray-300 rounded-b-[2.5rem]">
          <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Tap to build your response:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {fragments.map((fragment) => (
              <button
                key={fragment.id}
                onClick={() => handleAddFragment(fragment)}
                disabled={draft.find(f => f.id === fragment.id)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-30 rounded-full text-sm text-gray-800 transition-colors"
              >
                {fragment.text}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleClear} className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded-lg">Clear</button>
            <button onClick={handleSend} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}