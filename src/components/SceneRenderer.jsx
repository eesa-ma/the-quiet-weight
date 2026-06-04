import chapter1 from "../data/chapter1.json";
import chapter2 from "../data/chapter2.json";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DialogueBox from "./DialogueBox";
import ObservationScene from "./ObservationScene";
import TextMessage from "./TextMessage";
import TextMessageChoice from "./TextMessageChoice";
import SocialFeed from "./SocialFeed";
import SignalDetection from "./SignalDetection";
import DragClassify from "./DragClassify";
import ReflectionScreen from "./ReflectionScreen";

const SceneRenderer = ({ startSceneId = "cafeteria_intro" }) => {
    const [currentSceneId, setCurrentSceneId] = useState(startSceneId);

    const chapters = [...chapter1.scenes, ...chapter2.scenes];
    const scene = chapters.find(s => s.id === currentSceneId);

    const sceneRef = useRef(scene);
    sceneRef.current = scene;

    if (!scene) {
        return (
            <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-white/40 text-sm">chapter 3 coming soon...</p>
            </div>
        );
    }

    const handleComplete = (nextSceneId) => {
        const next = nextSceneId ?? sceneRef.current.next;
        setCurrentSceneId(next);
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
                return <SocialFeed scene={scene} onComplete={handleComplete} />;
            case "minigame":
                if (scene.minigameId === "drag_classify")
                    return <DragClassify scene={scene} onComplete={handleComplete} />;
                return <SignalDetection scene={scene} onComplete={handleComplete} />;
            case "reflection":
                return <ReflectionScreen scene={scene} onComplete={handleComplete} />;
            default:
                return <div>Unknown scene type: {scene.type}</div>;
        }
    };

    return (
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