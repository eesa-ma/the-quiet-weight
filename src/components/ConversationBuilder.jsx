import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const ConversationBuilder = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showOutcome, setShowOutcome] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentSituation = scene.situations[currentIndex];

    useEffect(() => {
        if (!showOutcome) return;
        const timeout = setTimeout(() => {
            if (currentIndex < scene.situations.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedChoice(null);
                setShowOutcome(false);
            } else {
                setScore(prev => ({
                    ...prev,
                    awareness: prev.awareness + totalScore
                }));
                setIsFinished(true);
            }
        }, 2200);
        return () => clearTimeout(timeout);
    }, [showOutcome]);

    const handleChoice = (choice) => {
        if (selectedChoice) return;
        setSelectedChoice(choice);
        setShowOutcome(true);
        if (choice.score > 0) {
            setTotalScore(prev => prev + choice.score);
        }
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case "connection":  return "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
            case "avoidance":   return "border-amber-500/50 bg-amber-500/10 text-amber-300";
            case "withdrawal":  return "border-red-500/50 bg-red-500/10 text-red-300";
            default:            return "border-white/10 bg-white/5 text-white";
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "connection":  return "✓ Connection";
            case "avoidance":   return "○ Avoidance";
            case "withdrawal":  return "✗ Withdrawal";
            default:            return type;
        }
    };

    const choiceVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } }
    };

    const choiceItem = {
        hidden: { opacity: 0, x: -20 },
        show:   { opacity: 1, x: 0 }
    };

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage === 100) return "Every choice opened a door. That's rare.";
        if (percentage >= 50)  return "Some moments of real connection. Keep looking for them.";
        return "Connection is difficult. Recognizing the missed moments is the first step.";
    };

    // Results screen
    if (isFinished) {
        const percentage = (totalScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 md:p-6">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md my-auto flex flex-col items-center gap-4 md:gap-6 text-center"
                >
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <p className="text-white text-6xl font-bold">{totalScore}</p>
                        <p className="text-white/30 text-sm mt-1">out of {scene.scoring.maxScore}</p>
                    </motion.div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className="h-2 bg-violet-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white/70 text-base leading-relaxed italic"
                    >
                        "{getFeedbackMessage(totalScore)}"
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        onClick={() => onComplete(scene.next)}
                        className="mt-4 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all cursor-pointer"
                    >
                        continue →
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 md:p-6">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
            />
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 w-full max-w-md my-auto flex flex-col gap-4 md:gap-5"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                            {scene.title}
                        </p>
                        <p className="text-white/30 text-xs">
                            {currentIndex + 1} of {scene.situations.length}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2">
                        {scene.situations.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300
                                    ${i === currentIndex ? "flex-2 bg-violet-400" :
                                      i < currentIndex  ? "flex-1 bg-violet-400" :
                                      "flex-1 bg-white/10"}`}
                            />
                        ))}
                    </div>

                    {/* Context */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">situation</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                            {currentSituation.context}
                        </p>
                    </div>

                    {/* Speech bubble prompt */}
                    <div className="relative bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg">
                        <p className="text-gray-800 text-base font-medium">
                            "{currentSituation.prompt}"
                        </p>
                        <div className="w-3 h-3 bg-white absolute -top-1.5 left-4 rotate-45 rounded-sm" />
                    </div>

                    {/* Choices */}
                    <AnimatePresence>
                        {!showOutcome && (
                            <motion.div
                                variants={choiceVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0 }}
                                className="flex flex-col gap-2"
                            >
                                {currentSituation.choices.map(choice => (
                                    <motion.button
                                        key={choice.id}
                                        variants={choiceItem}
                                        onClick={() => handleChoice(choice)}
                                        className="w-full text-left px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        {choice.text}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Outcome */}
                    <AnimatePresence>
                        {showOutcome && selectedChoice && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`rounded-2xl border p-5 flex flex-col gap-3 ${getTypeStyle(selectedChoice.type)}`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-widest">
                                    {getTypeLabel(selectedChoice.type)}
                                </p>
                                <p className="text-sm leading-relaxed opacity-90">
                                    {selectedChoice.outcome}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ConversationBuilder;