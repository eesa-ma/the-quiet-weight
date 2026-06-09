import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const FindYourVoice = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [timeLeft, setTimeLeft] = useState(scene.timeLimit);
    const [collected, setCollected] = useState([]);
    const [penalties, setPenalties] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [wordPositions] = useState(() =>
        scene.words.map(() => ({
            x: Math.random() * 70 + 5,
            y: Math.random() * 55 + 10,
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 2
        }))
    );

    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (collected.length + penalties >= scene.words.length) {
            clearInterval(timerRef.current);
            setIsFinished(true);
        }
    }, [collected, penalties]);

    useEffect(() => {
        if (isFinished) {
            const positiveCount = collected.filter(id => {
                const word = scene.words.find(w => w.id === id);
                return word?.type === "positive";
            }).length;

            const negativeCount = collected.filter(id => {
                const word = scene.words.find(w => w.id === id);
                return word?.type === "negative";
            }).length;

            const finalScore = Math.max(
                0,
                positiveCount * scene.scoring.perPositive -
                negativeCount * scene.scoring.penaltyPerNegative
            );

            setScore(prev => ({
                ...prev,
                awareness: prev.awareness + finalScore
            }));
        }
    }, [isFinished]);

    const handleWordClick = (word) => {
        if (collected.includes(word.id)) return;
        setCollected(prev => [...prev, word.id]);
        if (word.type === "negative") {
            setPenalties(prev => prev + 1);
        }
    };

    const getWordStyle = (word) => {
        if (!collected.includes(word.id)) return "";
        return word.type === "positive"
            ? "opacity-0 scale-150 text-emerald-400"
            : "opacity-0 scale-150 text-red-400";
    };

    const positiveCollected = collected.filter(id => {
        const word = scene.words.find(w => w.id === id);
        return word?.type === "positive";
    }).length;

    const negativeCollected = collected.filter(id => {
        const word = scene.words.find(w => w.id === id);
        return word?.type === "negative";
    }).length;

    const finalScore = Math.max(
        0,
        positiveCollected * scene.scoring.perPositive -
        negativeCollected * scene.scoring.penaltyPerNegative
    );

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage === 100) return "Every positive action collected. Your voice is strong.";
        if (percentage >= 60)  return "More connection than withdrawal. A good sign.";
        return "The positive actions were harder to reach. They usually are.";
    };

    const timerPercentage = (timeLeft / scene.timeLimit) * 100;

    if (isFinished) {
        return (
            <div className="relative w-full h-screen overflow-y-auto flex flex-col items-center justify-start p-4 md:p-6">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/saya_conference.png')` }}
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
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-white text-6xl font-bold">{finalScore}</p>
                        <p className="text-white/30 text-sm mt-1">out of {scene.scoring.maxScore}</p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-4 w-full"
                    >
                        <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                            <p className="text-emerald-400 text-xl font-bold">{positiveCollected}</p>
                            <p className="text-white/40 text-xs mt-1">positive collected</p>
                        </div>
                        <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                            <p className="text-red-400 text-xl font-bold">{negativeCollected}</p>
                            <p className="text-white/40 text-xs mt-1">negative tapped</p>
                        </div>
                    </motion.div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className="h-2 bg-violet-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, (finalScore / scene.scoring.maxScore) * 100)}%` }}
                            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white/70 text-base leading-relaxed italic"
                    >
                        "{getFeedbackMessage(finalScore)}"
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
        <div className="relative w-full h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/saya_conference.png')` }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>
                    <motion.p
                        animate={{ color: timeLeft <= 10 ? "#f87171" : "#ffffff99" }}
                        className="text-sm font-bold tabular-nums"
                    >
                        {timeLeft}s
                    </motion.p>
                </div>

                {/* Timer bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5">
                    <motion.div
                        className="h-1.5 rounded-full"
                        animate={{
                            width: `${timerPercentage}%`,
                            backgroundColor: timeLeft <= 10 ? "#f87171" : "#7c3aed"
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <p className="text-white/50 text-xs text-center">
                    Tap the positive actions — avoid the negative ones
                </p>
            </div>

            {/* Floating words */}
            {scene.words.map((word, index) => {
                const pos = wordPositions[index];
                const isCollected = collected.includes(word.id);

                return (
                    <motion.button
                        key={word.id}
                        initial={{ opacity: 0 }}
                        animate={isCollected ? {
                            opacity: 0,
                            scale: 1.4,
                            transition: { duration: 0.3 }
                        } : {
                            opacity: 1,
                            y: [0, -12, 0],
                            transition: {
                                opacity: { duration: 0.5, delay: pos.delay },
                                y: { repeat: Infinity, duration: pos.duration, ease: "easeInOut", delay: pos.delay }
                            }
                        }}
                        style={{
                            position: "absolute",
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                        }}
                        onClick={() => handleWordClick(word)}
                        disabled={isCollected}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer z-10
                            ${word.type === "positive"
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/40"
                                : "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/40"
                            }`}
                    >
                        {word.text}
                    </motion.button>
                );
            })}

            {/* Score live counter */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-20">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-5 py-2 text-center">
                    <p className="text-emerald-400 text-lg font-bold">{positiveCollected}</p>
                    <p className="text-white/30 text-xs">collected</p>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-5 py-2 text-center">
                    <p className="text-red-400 text-lg font-bold">{negativeCollected}</p>
                    <p className="text-white/30 text-xs">penalty</p>
                </div>
            </div>

        </div>
    );
};

export default FindYourVoice;