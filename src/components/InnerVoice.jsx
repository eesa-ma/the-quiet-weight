import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const InnerVoice = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentThought = scene.thoughts[currentIndex];

    const handleAnswer = (category) => {
        if (result !== null) return;

        const correct = category === currentThought.correct;
        setIsCorrect(correct);
        setResult(category);

        const newScore = correct ? totalScore + scene.scoring.perCorrect : totalScore;
        if (correct) setTotalScore(newScore);

        setTimeout(() => {
            if (currentIndex < scene.thoughts.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setResult(null);
                setIsCorrect(null);
            } else {
                setScore(prev => ({
                    ...prev,
                    awareness: prev.awareness + newScore
                }));
                setTotalScore(newScore);
                setIsFinished(true);
            }
        }, 1800);
    };

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage === 100) return "Perfect clarity. You can separate what's real from what fear creates.";
        if (percentage >= 60)  return "Good instincts. Learning to question your inner critic takes practice.";
        return "The inner voice can be convincing. Keep questioning it.";
    };

    const progressPercentage = (currentIndex / scene.thoughts.length) * 100;

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
            <motion.div
                className="absolute inset-0"
                animate={isCorrect === null ? { opacity: 0 } :
                    isCorrect ? { opacity: [0, 0.15, 0] } : { opacity: [0, 0.15, 0] }
                }
                style={{ backgroundColor: isCorrect ? "#16a34a" : "#dc2626" }}
                transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 w-full max-w-md my-auto flex flex-col gap-4 md:gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>
                    <p className="text-white/30 text-xs">
                        {currentIndex + 1} of {scene.thoughts.length}
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

                {/* Thought bubble */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-3xl border p-6 min-h-35 flex flex-col justify-center transition-colors duration-300
                            ${result === null
                                ? "bg-white/8 border-white/15"
                                : isCorrect
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                            }`}
                    >
                        {/* Thought bubble dots */}
                        <div className="flex gap-1 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        </div>

                        {result === null ? (
                            <>
                                <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">
                                    fact or self-doubt?
                                </p>
                                <p className="text-white text-base leading-relaxed italic">
                                    "{currentThought.text}"
                                </p>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                        {isCorrect ? "✓" : "✗"}
                                    </span>
                                    <p className={`text-sm font-semibold uppercase tracking-widest
                                        ${isCorrect ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {currentThought.correct}
                                    </p>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {currentThought.explanation}
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
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAnswer("Fact")}
                                className="py-5 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold uppercase tracking-widest hover:bg-blue-500/30 transition-all cursor-pointer"
                            >
                                Fact
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAnswer("Self-Doubt")}
                                className="py-5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-semibold uppercase tracking-widest hover:bg-rose-500/30 transition-all cursor-pointer"
                            >
                                Self-Doubt
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default InnerVoice;