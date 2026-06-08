import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const ConnectionChain = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentChainIndex, setCurrentChainIndex] = useState(0);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [isWrong, setIsWrong] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [shuffledSteps] = useState(() =>
        scene.chains.map(chain => [...chain.steps].sort(() => Math.random() - 0.5))
    );

    const currentChain = scene.chains[currentChainIndex];
    const currentShuffled = shuffledSteps[currentChainIndex];

    const handleStepClick = (step) => {
        if (isCorrect || isWrong) return;
        if (playerSequence.find(s => s.id === step.id)) return;

        const newSequence = [...playerSequence, step];
        const expectedStep = currentChain.correctOrder[newSequence.length - 1];

        if (step.id !== expectedStep) {
            setIsWrong(true);
            setTimeout(() => {
                setPlayerSequence([]);
                setIsWrong(false);
            }, 800);
            return;
        }

        setPlayerSequence(newSequence);

        if (newSequence.length === currentChain.correctOrder.length) {
            setIsCorrect(true);
            const newScore = totalScore + scene.scoring.perCorrectChain;
            setTotalScore(newScore);

            setTimeout(() => {
                if (currentChainIndex < scene.chains.length - 1) {
                    setCurrentChainIndex(prev => prev + 1);
                    setPlayerSequence([]);
                    setIsCorrect(false);
                } else {
                    setScore(prev => ({
                        ...prev,
                        awareness: prev.awareness + newScore
                    }));
                    setIsFinished(true);
                }
            }, 2000);
        }
    };

    const isStepSelected = (step) => playerSequence.find(s => s.id === step.id);
    const getStepNumber = (step) => {
        const index = playerSequence.findIndex(s => s.id === step.id);
        return index === -1 ? null : index + 1;
    };

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage === 100) return "Perfect chains. You understand how connection grows.";
        if (percentage >= 60)  return "Good instincts. Friendships rarely follow a straight line.";
        return "Belonging takes time and steps — more than we expect.";
    };

    if (isFinished) {
        const percentage = (totalScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/noah_coffee_shop.png')` }}
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md mx-6 flex flex-col items-center gap-6 text-center"
                >
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
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
        <div className="relative w-full h-screen flex items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/noah_coffee_shop.png')` }}
            />
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentChainIndex}
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
                            {currentChainIndex + 1} of {scene.chains.length}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2">
                        {scene.chains.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 flex-1
                                    ${i === currentChainIndex ? "bg-violet-400" :
                                      i < currentChainIndex  ? "bg-violet-400/60" :
                                      "bg-white/10"}`}
                            />
                        ))}
                    </div>

                    {/* Chain title */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                        <p className="text-white/40 text-xs mb-1 uppercase tracking-widest">build the path</p>
                        <p className="text-white text-sm font-medium">{currentChain.title}</p>
                    </div>

                    {/* Player sequence so far */}
                    <div className="flex items-center gap-2 min-h-9 flex-wrap">
                        {playerSequence.map((step, i) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1"
                            >
                                <div className="px-3 py-1 rounded-full bg-violet-600/40 border border-violet-500/40 text-violet-200 text-xs">
                                    {step.text}
                                </div>
                                {i < playerSequence.length - 1 && (
                                    <span className="text-violet-400 text-xs">→</span>
                                )}
                            </motion.div>
                        ))}
                        {playerSequence.length === 0 && (
                            <p className="text-white/20 text-xs">tap steps in order below...</p>
                        )}
                    </div>

                    {/* Shuffled steps */}
                    <motion.div
                        animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-2"
                    >
                        {currentShuffled.map(step => {
                            const selected = isStepSelected(step);
                            const number = getStepNumber(step);
                            return (
                                <motion.button
                                    key={step.id}
                                    onClick={() => handleStepClick(step)}
                                    disabled={!!selected || isCorrect}
                                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3
                                        ${selected
                                            ? "bg-violet-600/30 border-violet-500/40 text-violet-200 cursor-not-allowed"
                                            : isCorrect
                                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-200 cursor-not-allowed"
                                                : "bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer"
                                        }`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                        ${selected ? "bg-violet-500 text-white" : "bg-white/10 text-white/30"}`}
                                    >
                                        {number || ""}
                                    </span>
                                    {step.text}
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {/* Correct feedback */}
                    <AnimatePresence>
                        {isCorrect && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4"
                            >
                                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">
                                    ✓ correct path
                                </p>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {currentChain.explanation}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ConnectionChain;