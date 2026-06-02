import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function InstagramMiniGame() {
  const setScene = useGameStore((state) => state.setScene);
  const updateScores = useGameStore((state) => state.updateScores);

  // The 10 posts: 5 are signals of loneliness, 5 are normal teenage posts (decoys)
  const [posts, setPosts] = useState([
    { id: 1, type: 'decoy', caption: "Finally beat my high score in Mario Kart 🏎️💨", img: "🎮", found: false },
    { id: 2, type: 'signal', caption: "Friday nights are so boring when you literally do nothing. 🥱", img: "📱", found: false, explanation: "Isolation: Not having weekend plans and feeling bored." },
    { id: 3, type: 'decoy', caption: "Look at this cute dog I saw on my way home!! 🐶", img: "🐕", found: false },
    { id: 4, type: 'signal', caption: "Everyone looks like they're having so much fun without me lol", img: "😔", found: false, explanation: "Dejection: Comparing herself to others' highlight reels." },
    { id: 5, type: 'decoy', caption: "Math test tomorrow... pray for me 📚😭", img: "📝", found: false },
    { id: 6, type: 'signal', caption: "reposting memes so people remember I exist 🤡", img: "🎭", found: false, explanation: "Agitation: Using rapid-fire memes for superficial connection." },
    { id: 7, type: 'decoy', caption: "New shoes! 👟🔥", img: "👟", found: false },
    { id: 8, type: 'signal', caption: "So tired. Don't even want to try talking today.", img: "🔋", found: false, explanation: "Depletion: Emotionally drained from masking her feelings." },
    { id: 9, type: 'decoy', caption: "Pizza for dinner 🍕", img: "🍕", found: false },
    { id: 10, type: 'signal', caption: "247 followers but my phone has been dry all day.", img: "🏜️", found: false, explanation: "Isolation: High social media presence but lacking actual companionship." },
  ]);

  const handlePostClick = (index) => {
    const post = posts[index];
    
    // If it's a signal and hasn't been found yet, mark it found and update the score
    if (post.type === 'signal' && !post.found) {
      const newPosts = [...posts];
      newPosts[index].found = true;
      setPosts(newPosts);
      updateScores(0, 10); // Award 10 awareness points per found signal
    }
  };

  // Check how many signals the player has successfully found
  const signalsFound = posts.filter(p => p.type === 'signal' && p.found).length;
  const isComplete = signalsFound === 5;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 border-4 border-gray-800 rounded-[3rem] p-4 shadow-xl h-[600px] flex flex-col relative overflow-hidden">
      
      {/* Phone Header */}
      <div className="text-center pb-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">@maya_scrolls</h2>
        <p className="text-sm text-gray-500">Find the 5 hidden signals ({signalsFound}/5)</p>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            onClick={() => handlePostClick(index)}
            className={`mt-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              post.found ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-5xl mb-3">
              {post.img}
            </div>
            <p className="text-gray-800 text-sm font-medium">{post.caption}</p>
            
            {post.found && (
              <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800 font-semibold border border-green-200 animate-fade-in">
                ✓ {post.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Proceed Button Overlay */}
      {isComplete && (
        <div className="absolute bottom-6 left-0 w-full flex justify-center animate-fade-in">
          <button 
            onClick={() => setScene('ch1_group_project')}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700"
          >
            Continue to School →
          </button>
        </div>
      )}
    </div>
  );
}