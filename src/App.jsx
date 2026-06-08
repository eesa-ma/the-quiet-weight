import { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TTSProvider, useTTSContext } from "./context/TTSContext";
import SplashScreen from "./components/SplashScreen";

const ChapterSelect = lazy(() => import("./components/ChapterSelect"));
const CharacterSelect = lazy(() => import("./components/CharacterSelect"));
const SceneRenderer = lazy(() => import("./components/SceneRenderer"));

// Floating mute button — shown during gameplay
const MuteButton = () => {
  const { muted, toggle } = useTTSContext();
  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute narration" : "Mute narration"}
      className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/50 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all cursor-pointer"
    >
      {muted ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
          <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
        </svg>
      )}
    </button>
  );
};

function App() {
  // null → chapter select
  // chapter object → character select
  // chapter object + startSceneId → game
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [startSceneId, setStartSceneId] = useState(null);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setStartSceneId(null);
  };

  const handleCharacterSelect = (sceneId) => {
    setStartSceneId(sceneId);
  };

  const handleChapterEnd = () => {
    setSelectedChapter(null);
    setStartSceneId(null);
  };

  const handleBack = () => {
    setSelectedChapter(null);
    setStartSceneId(null);
  };

  const screenKey =
    startSceneId ? "game"
    : selectedChapter ? "character-select"
    : "chapter-select";

  return (
    <TTSProvider>
      <MuteButton />

      <AnimatePresence mode="sync">
        <motion.div
          key={screenKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", width: "100%" }}
        >
          <Suspense fallback={<SplashScreen />}>
            {startSceneId ? (
              <SceneRenderer
                startSceneId={startSceneId}
                onChapterEnd={handleChapterEnd}
              />
            ) : selectedChapter ? (
              <CharacterSelect
                chapter={selectedChapter}
                onSelect={handleCharacterSelect}
                onBack={handleBack}
              />
            ) : (
              <ChapterSelect onSelect={handleChapterSelect} />
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </TTSProvider>
  );
}

export default App;
