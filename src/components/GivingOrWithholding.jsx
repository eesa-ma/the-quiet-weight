import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const GivingOrWithholding = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentSignal = scene.signals[currentIndex];

    const colorMap = {
        emerald: { button: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30", correct: "bg-emerald-500/10 border-emerald-500/30", label: "text-emerald-400" },
        sky:     { button: "bg-sky-500/20 border-sky-500/30 text-sky-300 hover:bg-sky-500/30",                 correct: "bg-sky-500/10 border-sky-500/30",     label: "text-sky-400"     },
        rose:    { button: "bg-rose-500/20 border-rose-500/30 text-rose-300 hover:bg-rose-500/30",             correct: "bg-rose-500/10 border-rose-500/30",   label: "text-rose-400"    },
        amber:   { button: "bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30",         correct: "bg-amber-500/10 border-amber-500/30", label: "text-amber-400"   },
        violet:  { button: "bg-violet-500/20 border-violet-500/30 text-violet-300 hover:bg-violet-500/30",     correct: "bg-violet-500/10 border-violet-500/30", label: "text-violet-400" },
    };

    const handleAnswer = (category) => {
        if (selectedCategory) return;

        const correct = category.id === currentSignal.correct;
        setSelectedCategory(category);
        setIsCorrect(correct);

        const newScore = correct ? totalScore + scene.scoring.perCorrect : totalScore;
        if (correct) setTotalScore(newScore);

        setTimeout(() => {
            if (currentIndex < scene.signals.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedCategory(null);
                setIsCorrect(null);
            } else {
                setScore(prev => ({
                    ...prev,
                    awareness: prev.awareness + newScore
                }));
                setTotalScore(newScore);
                setIsFinished(true);
            }
        }, 2200);
    };

    const getFeedbackMessage = (score) => {
        const pct = (score / scene.scoring.maxScore) * 100;
        if (pct >= 80) return "You see clearly what others miss — the quiet barriers that keep people apart.";
        if (pct >= 50) return "Good awareness. Some walls are harder to spot than others. That's the point.";
        return "Loneliness in later life hides well. Keep looking beneath the surface.";
    };

    const correctCategory = scene.categories.find(c => c.id === currentSignal?.correct);

    // ── Results screen ─────────────────────────────────────────────────────
    if (isFinished) {
        const pct = (totalScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md mx-6 flex flex-col items-center gap-6 text-center"
                >
                    <p className="text-pink-400 text-xs font-semibold uppercase tracking-widest">
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
                            className="h-2 bg-pink-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
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
                        className="mt-4 px-8 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium transition-all cursor-pointer"
                    >
                        continue →
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // ── Main game screen ───────────────────────────────────────────────────
    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
            />
            {/* Correct / wrong flash */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                animate={isCorrect === null ? { opacity: 0 } : { opacity: [0, 0.12, 0] }}
                style={{ backgroundColor: isCorrect ? "#16a34a" : "#dc2626" }}
                transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-black/65" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-20 w-full max-w-md mx-6 flex flex-col gap-5"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-pink-400 text-xs font-semibold uppercase tracking-widest">
                            {scene.title}
                        </p>
                        <p className="text-white/30 text-xs">
                            {currentIndex + 1} of {scene.signals.length}
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/10 rounded-full h-1">
                        <motion.div
                            className="h-1 bg-pink-400 rounded-full"
                            animate={{ width: `${(currentIndex / scene.signals.length) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>

                    {/* Statement card */}
                    <div className={`rounded-2xl border p-5 transition-colors duration-300
                        ${selectedCategory === null
                            ? "bg-white/5 border-white/10"
                            : isCorrect
                                ? `${colorMap[correctCategory?.color]?.correct}`
                                : "bg-red-500/10 border-red-500/30"
                        }`}
                    >
                        <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">
                            giving or withholding?
                        </p>
                        <p className="text-white text-base leading-relaxed">
                            "{currentSignal.statement}"
                        </p>
                    </div>

                    {/* Explanation after answer */}
                    <AnimatePresence>
                        {selectedCategory && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                        {isCorrect ? "✓" : "✗"}
                                    </span>
                                    <p className={`text-xs font-semibold uppercase tracking-widest
                                        ${colorMap[correctCategory?.color]?.label}`}
                                    >
                                        {correctCategory?.label}
                                    </p>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {currentSignal.explanation}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Category buttons — hidden while feedback shows */}
                    <AnimatePresence>
                        {!selectedCategory && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 gap-2"
                            >
                                {scene.categories.map((category, index) => (
                                    <motion.button
                                        key={category.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleAnswer(category)}
                                        className={`py-4 rounded-2xl border text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer
                                            ${colorMap[category.color]?.button}
                                            ${index === scene.categories.length - 1 && scene.categories.length % 2 !== 0 ? "col-span-2" : ""}
                                        `}
                                    >
                                        <span className="block">{category.label}</span>
                                        <span className="block text-xs font-normal normal-case tracking-normal opacity-60 mt-0.5">
                                            {category.description}
                                        </span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default GivingOrWithholding;
