import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const typeStyle = {
    positive: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    neutral:  "border-white/20 bg-white/5 text-white/70",
};

const MemoryBox = ({ scene, onComplete }) => {
    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [choices, setChoices] = useState([]);

    const currentItem = scene.items[currentIndex];

    const handleChoice = (choice) => {
        if (selectedChoice) return;
        setSelectedChoice(choice);
        const gained = choice.type === "positive" ? scene.scoring.perItem : 0;
        const newScore = totalScore + gained;
        if (gained > 0) setTotalScore(newScore);
        setChoices(prev => [...prev, { itemId: currentItem.id, choice }]);

        setTimeout(() => {
            if (currentIndex < scene.items.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedChoice(null);
            } else {
                setScore(prev => ({
                    ...prev,
                    awareness: prev.awareness + newScore
                }));
                setIsFinished(true);
            }
        }, 2000);
    };

    const getFeedbackMessage = (score) => {
        const pct = (score / scene.scoring.maxScore) * 100;
        if (pct >= 80) return "You helped Daniel look forward more than back. That's where healing lives.";
        if (pct >= 40) return "Some things belong to the past. Some can come with you. Learning the difference takes time.";
        return "Letting go is harder than it sounds. The first step is just looking at what's there.";
    };

    if (isFinished) {
        return (
            <div className="relative w-full h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/daniel_storage.png')` }}
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
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <p className="text-white text-6xl font-bold">{totalScore}</p>
                        <p className="text-white/30 text-sm mt-1">out of {scene.scoring.maxScore}</p>
                    </motion.div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className="h-2 bg-violet-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalScore / scene.scoring.maxScore) * 100}%` }}
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
                style={{ backgroundImage: `url('/assets/backgrounds/daniel_storage.png')` }}
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

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
                            {currentIndex + 1} of {scene.items.length}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2">
                        {scene.items.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full flex-1 transition-all duration-300
                                    ${i < currentIndex ? "bg-violet-400" :
                                      i === currentIndex ? "bg-violet-300" :
                                      "bg-white/10"}`}
                            />
                        ))}
                    </div>

                    {/* Item card */}
                    <div className="bg-white/6 border border-white/12 rounded-3xl p-6 flex flex-col items-center gap-4 text-center">
                        <motion.span
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-5xl"
                        >
                            {currentItem.emoji}
                        </motion.span>
                        <div>
                            <p className="text-white text-lg font-semibold">{currentItem.label}</p>
                            <p className="text-white/50 text-sm mt-1 leading-relaxed">{currentItem.description}</p>
                        </div>
                    </div>

                    {/* Choices or outcome */}
                    <AnimatePresence mode="wait">
                        {!selectedChoice ? (
                            <motion.div
                                key="choices"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col gap-2"
                            >
                                {currentItem.choices.map((choice) => (
                                    <motion.button
                                        key={choice.id}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleChoice(choice)}
                                        className="w-full text-left px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        {choice.label}
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="outcome"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`rounded-2xl border p-5 text-sm leading-relaxed ${typeStyle[selectedChoice.type] ?? typeStyle.neutral}`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-60">
                                    {selectedChoice.label}
                                </p>
                                <p>{selectedChoice.response}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MemoryBox;
