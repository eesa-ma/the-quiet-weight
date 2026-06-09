import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DialogueBox from "./DialogueBox";
import { useGame } from "../context/GameContext";

const TextMessageChoice = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [visibleMessages, setVisibleMessages] = useState([]);
    const [showingPauseDialogue, setShowingPauseDialogue] = useState(false);
    const [showingChoices, setShowingChoices] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showingOutcomeMessages, setShowingOutcomeMessages] = useState(false);
    const [visibleOutcomeMessages, setVisibleOutcomeMessages] = useState([]);
    const [showingOutcomeDialogue, setShowingOutcomeDialogue] = useState(false);

    // Reveal initial messages one by one
    useEffect(() => {
        if (visibleMessages.length < scene.messages.length) {
            const timeout = setTimeout(() => {
                setVisibleMessages(prev => [...prev, scene.messages[prev.length]]);
            }, 800);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setShowingPauseDialogue(true);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [visibleMessages]);

    // Reveal outcome messages one by one after choice
    useEffect(() => {
        if (!selectedChoice || !showingOutcomeMessages) return;
        const outcomeMessages = selectedChoice.outcome.messages;

        if (visibleOutcomeMessages.length < outcomeMessages.length) {
            const timeout = setTimeout(() => {
                setVisibleOutcomeMessages(prev => [...prev, outcomeMessages[prev.length]]);
            }, 800);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setShowingOutcomeDialogue(true);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [visibleOutcomeMessages, showingOutcomeMessages]);

    const handlePauseDialogueComplete = () => {
        setShowingPauseDialogue(false);
        setShowingChoices(true);
    };

    const handleChoiceClick = (choice) => {
        setSelectedChoice(choice);
        setShowingChoices(false);
        setShowingOutcomeMessages(true);

        // Update awareness score in context
        setScore(prev => ({
            ...prev,
            awareness: prev.awareness + choice.outcome.awarenessScore
        }));
    };

    const choiceVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } }
    };

    const choiceItem = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    const allMessages = [
        ...visibleMessages,
        ...(showingOutcomeMessages ? visibleOutcomeMessages : [])
    ];

    return (
        <div className="relative w-full h-screen flex flex-col">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Phone Frame */}
            <div className="relative z-10 flex items-center justify-center h-full p-2 md:p-4">
                <div className="w-full max-w-[320px] h-[90dvh] max-h-130 md:h-130 bg-gray-950 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden">

                    {/* Phone top bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 md:gap-3 md:px-5 md:py-4 border-b border-white/10 bg-gray-900 shrink-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-violet-500/30 flex items-center justify-center">
                            <span className="text-violet-300 text-xs font-bold">P</span>
                        </div>
                        <div>
                            <p className="text-white text-xs md:text-sm font-semibold">Preethi</p>
                            <p className="text-white/30 text-[10px] md:text-xs">online</p>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 px-3 py-3 md:px-4 md:py-4 flex flex-col gap-2 md:gap-3 overflow-y-auto">

                        <AnimatePresence>
                            {allMessages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: msg.sender === "maya" ? 40 : -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.sender === "maya" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[75%] px-3 py-1.5 md:px-4 md:py-2 rounded-2xl text-xs md:text-sm leading-relaxed
                                        ${msg.sender === "maya"
                                            ? "bg-violet-600 text-white rounded-br-sm"
                                            : "bg-gray-700 text-white/90 rounded-bl-sm"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator */}
                        {showingOutcomeMessages &&
                         visibleOutcomeMessages.length < selectedChoice.outcome.messages.length && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-white/50"
                                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Choice Buttons — inside phone at bottom */}
                    <AnimatePresence>
                        {showingChoices && (
                            <motion.div
                                variants={choiceVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0 }}
                                className="px-3 py-3 md:px-4 md:py-4 border-t border-white/10 flex flex-col gap-1.5 md:gap-2 bg-gray-900 shrink-0"
                            >
                                <p className="text-white/40 text-[10px] md:text-xs mb-0.5 md:mb-1">{scene.prompt}</p>
                                {scene.choices.map(choice => (
                                    <motion.button
                                        key={choice.id}
                                        variants={choiceItem}
                                        onClick={() => handleChoiceClick(choice)}
                                        className="w-full text-left px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-200 text-xs md:text-sm hover:bg-violet-600/40 transition-all cursor-pointer"
                                    >
                                        {choice.text}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Insight card — shown briefly after choice */}
            <AnimatePresence>
                {selectedChoice && !showingOutcomeDialogue && showingOutcomeMessages &&
                 visibleOutcomeMessages.length === selectedChoice.outcome.messages.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-6 left-4 right-4 z-20 bg-black/80 border border-violet-500/20 rounded-2xl px-5 py-4"
                    >
                        <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-1">insight</p>
                        <p className="text-white/80 text-sm leading-relaxed">{selectedChoice.outcome.insight}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pause Dialogue */}
            {showingPauseDialogue && (
                <DialogueBox
                    scene={{
                        lines: scene.pause_dialogue,
                        background: scene.background
                    }}
                    onComplete={handlePauseDialogueComplete}
                    noBackground
                />
            )}

            {/* Outcome Dialogue */}
            {showingOutcomeDialogue && selectedChoice && (
                <DialogueBox
                    scene={{
                        lines: selectedChoice.outcome.dialogue,
                        background: scene.background
                    }}
                    onComplete={onComplete}
                    noBackground
                />
            )}

        </div>
    );
};

export default TextMessageChoice;