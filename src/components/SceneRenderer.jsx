import { useState, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "./SplashScreen";

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

const DialogueBox = lazy(() => import("./DialogueBox"));
const ObservationScene = lazy(() => import("./ObservationScene"));
const TextMessage = lazy(() => import("./TextMessage"));
const TextMessageChoice = lazy(() => import("./TextMessageChoice"));
const SocialFeed = lazy(() => import("./SocialFeed"));
const SignalDetection = lazy(() => import("./SignalDetection"));
const DragClassify = lazy(() => import("./DragClassify"));
const ReflectionScreen = lazy(() => import("./ReflectionScreen"));
const SpotPattern = lazy(() => import("./SpotPattern"));
const ConversationBuilder = lazy(() => import("./ConversationBuilder"));
const InnerVoice = lazy(() => import("./InnerVoice"));
const FindYourVoice = lazy(() => import("./FindYourVoice"));
const MemoryBox = lazy(() => import("./MemoryBox"));
const NewCity = lazy(() => import("./NewCity"));
const ConnectionChain = lazy(() => import("./ConnectionChain"));
const RootsOfBelonging = lazy(() => import("./RootsOfBelonging"));
const GapBetween = lazy(() => import("./GapBetween"));
const BridgeOrWall = lazy(() => import("./BridgeOrWall"));
const GivingOrWithholding = lazy(() => import("./GivingOrWithholding"));

const SceneRenderer = ({ startSceneId = "cafeteria_intro", onChapterEnd }) => {
    const [currentSceneId, setCurrentSceneId] = useState(startSceneId);

    const chapters = [...chapter1.scenes, ...chapter2.scenes, ...chapter3.scenes, ...daniel.scenes, ...saya.scenes, ...noah.scenes, ...liam.scenes, ...zara.scenes, ...rajan.scenes, ...thomas.scenes, ...eleanor.scenes];
    const scene = chapters.find(s => s.id === currentSceneId);

    const sceneRef = useRef(scene);
    sceneRef.current = scene;

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
                <Suspense fallback={<SplashScreen />}>
                    {renderScene()}
                </Suspense>
            </motion.div>
        </AnimatePresence>
    );
};

export default SceneRenderer;