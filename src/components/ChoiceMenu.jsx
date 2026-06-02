// Notice we import this without brackets because you used "export default" in your store
import useGameStore from '../store/useGameStore'; 

export default function ChoiceMenu({ choices }) {
  const setScene = useGameStore((state) => state.setScene);
  const updateScores = useGameStore((state) => state.updateScores);

  const handleChoiceClick = (choice) => {
    // 1. Update the connection and awareness meters
    updateScores(choice.connChange, choice.awareChange);
    
    // 2. Move to the next scene (if there is one)
    if (choice.nextScene) {
      setScene(choice.nextScene);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-b-lg shadow-md border-2 border-gray-200 flex flex-col gap-3">
      {choices.map((choice, index) => (
        <button 
          key={index}
          onClick={() => handleChoiceClick(choice)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-left shadow-sm hover:shadow"
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}