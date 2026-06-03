import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DialogueBox from "./DialogueBox";

const ObservationScene = ({ scene, onComplete }) => {

    const [foundClues, setFoundClues] = useState([]);
    const [activeClue, setActiveClue] = useState(null);
    const [showingReveal, setShowingReveal] = useState(false);
    const [showingDialogue, setShowingDialogue] = useState(false);
    const [showingClosing, setShowingClosing] = useState(false);

    // Only show the next unfound clue
    const nextClue = scene.clues.find(clue => !foundClues.includes(clue.id));

    const handleHotspotClick = (clue) => {
        setActiveClue(clue);
        setShowingReveal(true);
    };

    const handleRevealDismiss = () => {
        setShowingReveal(false);
        setShowingDialogue(true);
    };

    const handleClueComplete = () => {
        const newFound = [...foundClues, activeClue.id];
        setFoundClues(newFound);
        setShowingDialogue(false);
        setActiveClue(null);

        if (newFound.length === scene.clues.length) {
            setShowingClosing(true);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Prompt */}          
            {!showingDialogue && !showingClosing && !showingReveal && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-0 right-0 flex justify-center z-10"
                >
                    <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-2">
                        <p className="text-white/70 text-sm tracking-wide">{scene.prompt}</p>
                    </div>
                </motion.div>
            )}

            {/* Progress */}
            {/* {!showingDialogue && !showingClosing && !showingReveal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-16 left-0 right-0 flex justify-center z-10 mt-2"
                >
                    <p className="text-white/30 text-xs">{foundClues.length} / {scene.clues.length} found</p>
                </motion.div>
            )} */}

            {/* Hotspot — only next unfound clue */}
            {!showingDialogue && !showingClosing && !showingReveal && nextClue && (
                <motion.button
                    key={nextClue.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: "absolute",
                        left: `${nextClue.position.x}%`,
                        top: `${nextClue.position.y}%`,
                        transform: "translate(-50%, -50%)"
                    }}
                    onClick={() => handleHotspotClick(nextClue)}
                    className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-transparent border-0 cursor-pointer"
                >
                    {/* Outer pulse ring */}
                    <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="absolute w-12 h-12 rounded-full bg-violet-400/40"
                    />
                    {/* Inner dot */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="w-4 h-4 rounded-full bg-violet-400 shadow-lg shadow-violet-500/50"
                    />
                </motion.button>
            )}

            {/* Reveal Overlay */}
            <AnimatePresence>
                {showingReveal && activeClue && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/70"
                        onClick={handleRevealDismiss}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-sm mx-6 text-center"
                        >
                            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">
                                {activeClue.label}
                            </p>
                            <p className="text-white text-base leading-relaxed">
                                {activeClue.reveal}
                            </p>
                            <p className="text-white/30 text-xs mt-6">tap to continue</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Clue Dialogue */}
            {showingDialogue && activeClue && (
                <DialogueBox
                    scene={{
                        lines: activeClue.dialogue,
                        background: scene.background
                    }}
                    onComplete={handleClueComplete}
                />
            )}

            {/* Closing Narration */}
            {showingClosing && (
                <DialogueBox
                    scene={{
                        lines: scene.closing,
                        background: scene.background
                    }}
                    onComplete={onComplete}
                />
            )}

        </div>
    );
};

export default ObservationScene;