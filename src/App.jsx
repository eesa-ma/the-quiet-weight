import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterSelect from "./components/ChapterSelect";
import SceneRenderer from "./components/SceneRenderer";

function App() {
  const [startSceneId, setStartSceneId] = useState(null);

  return (
    <AnimatePresence mode="async">
      {startSceneId === null ? (
        <motion.div
          key="chapter-select"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", width: "100%" }}
        >
          <ChapterSelect onSelect={(id) => setStartSceneId(id)} />
        </motion.div>
      ) : (
        <motion.div
          key="scene-renderer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", width: "100%" }}
        >
          <SceneRenderer startSceneId={startSceneId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
