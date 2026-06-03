import chapter1 from "../data/chapter1.json";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DialogueBox from "./DialogueBox";
import ObservationScene from "./ObservationScene";
import TextMessage from "./TextMessage";
import TextMessageChoice from "./TextMessageChoice";

const SceneRenderer = () => {
    const [currentSceneId, setCurrentSceneId] = useState("cafeteria_intro");

    const scene = chapter1.scenes.find(s => s.id === currentSceneId);

    const handleComplete = (nextSceneId = scene.next) => {
        setCurrentSceneId(nextSceneId);
    };

    const renderScene = () => {
        switch (scene.type) {
            case "narration":
            case "dialogue":
                return <DialogueBox scene={scene} onComplete={handleComplete} />;
            case "observation":
                return <ObservationScene scene={scene} onComplete={handleComplete} />;
            case "text_message":
                return <TextMessage scene={scene} onComplete={handleComplete} />;
            case "text_message_choice":
                return <TextMessageChoice scene={scene} onComplete={handleComplete} />;
            case "social_feed":
                return <div>social feed placeholder</div>;
            case "minigame":
                return <div>minigame placeholder</div>;
            case "reflection":
                return <div>reflection placeholder</div>;
            default:
                return <div>Unknown scene type: {scene.type}</div>;
        }
    };

    return (
        // <AnimatePresence mode="wait">
        //     <motion.div
        //         key={currentSceneId}
        //         initial={{ opacity: 0 }}
        //         animate={{ opacity: 1 }}
        //         exit={{ opacity: 0 }}
        //         transition={{ duration: 0.6 }}
        //     >
        //         {renderScene()}
        //     </motion.div>
        // </AnimatePresence>

        <AnimatePresence mode="sync">
            <motion.div
                key={currentSceneId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: "absolute", width: "100%" }}
            >
                {renderScene()}
            </motion.div>
        </AnimatePresence>
    );
};

export default SceneRenderer;