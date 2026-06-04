import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const SignalDetection = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [minigameScore, setMinigameScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentSignal = scene.signals[currentIndex];

    const handleAnswer = (option) => {
        if (isAnswered) return;
        setSelectedAnswer(option);
        setIsAnswered(true);
        if (option === currentSignal.correct) {
            setMinigameScore(prev => prev + scene.scoring.perCorrect);
        }
    };

    const handleNext = () => {
        if (currentIndex < scene.signals.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            const finalScore = selectedAnswer === currentSignal.correct
                ? minigameScore + scene.scoring.perCorrect
                : minigameScore;

            setScore(prev => ({
                ...prev,
                awareness: prev.awareness + finalScore
            }));
            setMinigameScore(finalScore);
            setIsFinished(true);
        }
    };

    const getOptionStyle = (option) => {
        if (!isAnswered)
            return "bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer";
        if (option === currentSignal.correct)
            return "bg-green-500/20 border-green-500/50 text-green-300";
        if (option === selectedAnswer && option !== currentSignal.correct)
            return "bg-red-500/20 border-red-500/50 text-red-300";
        return "bg-white/5 border-white/5 text-white/20 cursor-not-allowed";
    };

    const getFeedbackMessage = (score) => {
        if (score === 50) return "Perfect. You don't miss a thing.";
        if (score >= 30) return "Good awareness. You're starting to read between the lines.";
        return "Keep looking closer. Loneliness hides in the details.";
    };

    const optionVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } }
    };

    const optionItem = {
        hidden: { opacity: 0, x: -15 },
        show: { opacity: 1, x: 0 }
    };

    // Results screen
    if (isFinished) {
        const percentage = (minigameScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen flex items-center justify-center ">
                {/* background image*/}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/bedroom.png')` }}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

                <div className="absolute inset-0 bg-linear-to-b from-violet-950/40 to-gray-950" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md mx-6 flex flex-col items-center gap-6 text-center"
                >
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>

                    {/* Score */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <p className="text-white text-6xl font-bold">{minigameScore}</p>
                        <p className="text-white/30 text-sm mt-1">out of {scene.scoring.maxScore}</p>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className="h-2 bg-violet-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        />
                    </div>

                    {/* Feedback */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white/70 text-base leading-relaxed italic"
                    >
                        "{getFeedbackMessage(minigameScore)}"
                    </motion.p>

                    {/* Continue */}
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

    // Signal card
    return (
        <div className="relative w-full h-screen flex items-center justify-center bg-gray-950">

            {/* background image*/}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/bedroom.png')` }}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

            <div className="absolute inset-0 bg-linear-to-b from-violet-950/30 to-gray-950" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 w-full max-w-md mx-6 flex flex-col gap-5"
                >

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                            {scene.title}
                        </p>
                        <p className="text-white/30 text-xs">
                            {currentIndex + 1} of {scene.signals.length}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2">
                        {scene.signals.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300
                                    ${i < currentIndex ? "bg-violet-400" :
                                        i === currentIndex ? "bg-violet-400/60" :
                                            "bg-white/10"}`}
                            />
                        ))}
                    </div>

                    {/* Statement */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <p className="text-white/50 text-xs mb-2">What does this signal?</p>
                        <p className="text-white text-base leading-relaxed">
                            "{currentSignal.statement}"
                        </p>
                    </div>

                    {/* Options */}
                    <motion.div
                        variants={optionVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-2"
                    >
                        {currentSignal.options.map(option => (
                            <motion.button
                                key={option}
                                variants={optionItem}
                                onClick={() => handleAnswer(option)}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${getOptionStyle(option)}`}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Explanation */}
                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4"
                            >
                                <p className="text-white/40 text-xs mb-1 uppercase tracking-widest">
                                    {selectedAnswer === currentSignal.correct ? "✓ correct" : "✗ not quite"}
                                </p>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {currentSignal.explanation}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Next button */}
                    <AnimatePresence>
                        {isAnswered && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleNext}
                                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all cursor-pointer"
                            >
                                {currentIndex < scene.signals.length - 1 ? "next →" : "see results →"}
                            </motion.button>
                        )}
                    </AnimatePresence>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SignalDetection;