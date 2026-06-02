import CafeteriaScene from './components/CafeteriaScene';
import useGameStore  from './store/useGameStore';
import ChoiceMenu from './components/ChoiceMenu';
import DialogueBox from './components/DialougeBox';
import { storyData } from './data/storyData';
function App() {
  const { currentSceneId, connectionMeter, awarenessScore } = useGameStore();
  
  // Grab the standard text data if it exists in storyData
  const currentScene = storyData[currentSceneId];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* Persistent HUD */}
      <div className="w-full max-w-3xl flex justify-between mb-8 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Connection</span>
          <span className="text-xl font-black text-blue-600">{connectionMeter}/100</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Awareness</span>
          <span className="text-xl font-black text-purple-600">{awarenessScore}</span>
        </div>
      </div>

      {/* Game Area Rendering Logic */}
      <div className="w-full max-w-3xl">
        
        {/* If the current scene is the cafeteria, render our custom component */}
        {currentSceneId === 'ch1_cafeteria_observation' ? (
          <CafeteriaScene />
        ) 
        
        /* Otherwise, if we have a standard text scene in storyData, render that */
        : currentScene ? (
          <div className="animate-fade-in">
            <DialogueBox character={currentScene.character} text={currentScene.text} />
            <ChoiceMenu choices={currentScene.choices} />
          </div>
        ) 
        
        /* Fallback if a scene is missing */
        : (
          <p className="text-red-500">Error: Scene "{currentSceneId}" not found.</p>
        )}
      </div>
    </div>
  );
}

export default App;