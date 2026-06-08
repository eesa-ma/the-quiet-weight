import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "./SplashScreen";
import { useImagePreloader } from "../hooks/useImagePreloader";

import chapter1 from "../data/chapter1/chapter1.json";
import chapter2 from "../data/chapter2/chapter2.json";
import chapter3 from "../data/chapter3/chapter3.json";
import daniel from "../data/chapter4/daniel.json";
import saya from "../data/chapter4/saya.json";
import noah from "../data/chapter4/noah.json";
import liam from "../data/chapter1/liam.json";
import zara from "../data/chapter2/zara.json";
import rajan from "../data/chapter5/rajan.json";
import thomas from "../data/chapter6/thomas.json";
import eleanor from "../data/chapter6/eleanor.json";

import DialogueBox from "./DialogueBox";
import ObservationScene from "./ObservationScene";
import TextMessage from "./TextMessage";
import TextMessageChoice from "./TextMessageChoice";
import SocialFeed from "./SocialFeed";
import SignalDetection from "./SignalDetection";
import DragClassify from "./DragClassify";
import ReflectionScreen from "./ReflectionScreen";
import SpotPattern from "./SpotPattern";
import ConversationBuilder from "./ConversationBuilder";
import InnerVoice from "./InnerVoice";
import FindYourVoice from "./FindYourVoice";
import MemoryBox from "./MemoryBox";
import NewCity from "./NewCity";
import ConnectionChain from "./ConnectionChain";
import RootsOfBelonging from "./RootsOfBelonging";
import GapBetween from "./GapBetween";
import BridgeOrWall from "./BridgeOrWall";
import GivingOrWithholding from "./GivingOrWithholding";

const SceneRenderer = ({ startSceneId = "cafeteria_intro", onChapterEnd }) => {
    const [currentSceneId, setCurrentSceneId] = useState(startSceneId);

    const chapters = [...chapter1.scenes, ...chapter2.scenes, ...chapter3.scenes, ...daniel.scenes, ...saya.scenes, ...noah.scenes, ...liam.scenes, ...zara.scenes, ...rajan.scenes, ...thomas.scenes, ...eleanor.scenes];

    const storyBackgrounds = useMemo(() => {
        const bgs = new Set();
        let curr = startSceneId;
        const visited = new Set();
        while (curr && !visited.has(curr)) {
            visited.add(curr);
            const scene = chapters.find(s => s.id === curr);
            if (!scene) break;
            if (scene.background) {
                bgs.add(`/assets/backgrounds/${scene.background}.png`);
            }
            curr = scene.next;
            if (curr && curr.includes("complete")) break;
        }
        return Array.from(bgs);
    }, [startSceneId]);

    const scene = chapters.find(s => s.id === currentSceneId);
    const sceneRef = useRef(scene);
    sceneRef.current = scene;

    const { imagesPreloaded } = useImagePreloader(storyBackgrounds);

    if (!imagesPreloaded) {
        return <SplashScreen />;
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
                if (scene.minigameId === "gap_between")
                    return <GapBetween scene={scene} onComplete={handleComplete} />
                if (scene.minigameId === "drag_classify")
                    return <DragClassify scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "spot_pattern")
                    return <SpotPattern scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "memory_box")
                    return <MemoryBox scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "conversation_builder")
                    return <ConversationBuilder scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "inner_voice")
                    return <InnerVoice scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "find_your_voice")
                    return <FindYourVoice scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "new_city")
                    return <NewCity scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "connection_chain")
                    return <ConnectionChain scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "roots_of_belonging")
                    return <RootsOfBelonging scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "bridge_or_wall")
                    return <BridgeOrWall scene={scene} onComplete={handleComplete} />;
                if (scene.minigameId === "giving_or_withholding")
                    return <GivingOrWithholding scene={scene} onComplete={handleComplete} />;
                return <SignalDetection scene={scene} onComplete={handleComplete} />;
            case "reflection":
                return <ReflectionScreen scene={scene} onComplete={handleComplete} onChapterEnd={onChapterEnd} />;
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