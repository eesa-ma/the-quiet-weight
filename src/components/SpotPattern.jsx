import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const SpotPattern = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [minigameScore, setMinigameScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentSignal = scene.signals[currentIndex];

    const handleAnswer = (bucket) => {
        if (result !== null) return;

        const correct = bucket === currentSignal.bucket;
        setIsCorrect(correct);
        setResult(bucket);

        const newScore = correct
            ? minigameScore + scene.scoring.perCorrect
            : minigameScore;

        if (correct) setMinigameScore(newScore);

        setTimeout(() => {
            if (currentIndex < scene.signals.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setResult(null);
                setIsCorrect(null);
            } else {
                setScore(prev => ({
                    ...prev,
                    awareness: prev.awareness + newScore
                }));
                setMinigameScore(newScore);
                setIsFinished(true);
            }
        }, 1800);
    };

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage === 100) return "Flawless. You see right through the noise.";
        if (percentage >= 60)  return "Sharp instincts. You're learning to read between the lines.";
        return "Keep watching. The patterns become clearer the more you look.";
    };

    const progressPercentage = (currentIndex / scene.signals.length) * 100;

    // Results screen
    if (isFinished) {
        const percentage = (minigameScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 md:p-6">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/balcony.png')` }}
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
                        <p className="text-white text-6xl font-bold">{minigameScore}</p>
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
                        "{getFeedbackMessage(minigameScore)}"
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

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/balcony.png')` }}
            />

            {/* Flash overlay on answer */}
            <motion.div
                className="absolute inset-0 z-10"
                animate={isCorrect === null ? { opacity: 0 } :
                    isCorrect ? { opacity: [0, 0.15, 0] } :
                    { opacity: [0, 0.15, 0] }
                }
                style={{
                    backgroundColor: isCorrect ? "#16a34a" : "#dc2626"
                }}
                transition={{ duration: 0.4 }}
            />

            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-20 w-full max-w-md my-auto flex flex-col gap-4 md:gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>
                    <p className="text-white/30 text-xs">
                        {currentIndex + 1} of {scene.signals.length}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1">
                    <motion.div
                        className="h-1 bg-violet-400 rounded-full"
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                {/* Statement card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-2xl border p-6 min-h-35 flex flex-col justify-center transition-colors duration-300
                            ${result === null
                                ? "bg-white/5 border-white/10"
                                : isCorrect
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                            }`}
                    >
                        {result === null ? (
                            <>
                                <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">
                                    coping or connection?
                                </p>
                                <p className="text-white text-base leading-relaxed">
                                    "{currentSignal.statement}"
                                </p>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                        {isCorrect ? "✓" : "✗"}
                                    </span>
                                    <p className={`text-sm font-semibold uppercase tracking-widest
                                        ${isCorrect ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {currentSignal.correct}
                                    </p>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {currentSignal.explanation}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Buttons */}
                <AnimatePresence>
                    {result === null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAnswer("Coping")}
                                className="py-5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-semibold uppercase tracking-widest hover:bg-rose-500/30 transition-all cursor-pointer"
                            >
                                Coping
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAnswer("Connection")}
                                className="py-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold uppercase tracking-widest hover:bg-emerald-500/30 transition-all cursor-pointer"
                            >
                                Connection
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default SpotPattern;