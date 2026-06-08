import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const RootsOfBelonging = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [roots, setRoots] = useState([]);
    const [treeHealth, setTreeHealth] = useState(50);
    const [result, setResult] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentAction = scene.actions[currentIndex];
    const positiveActions = scene.actions.filter(a => a.type === "positive");

    const handleAction = (tapped) => {
        if (result !== null) return;

        const isPositive = currentAction.type === "positive";
        const tappedPositive = tapped === "positive";
        const correct = isPositive === tappedPositive;

        setResult(tapped);

        if (tappedPositive && isPositive) {
            setRoots(prev => [...prev, currentAction.root]);
            setTreeHealth(prev => Math.min(100, prev + 10));
            setTotalScore(prev => prev + scene.scoring.perPositive);
        } else if (tappedPositive && !isPositive) {
            setTreeHealth(prev => Math.max(0, prev - scene.scoring.penaltyPerNegative));
        }

        setTimeout(() => {
            if (currentIndex < scene.actions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setResult(null);
            } else {
                const finalScore = Math.max(0, totalScore);
                setScore(prev => ({
                    ...prev,
                    awareness: prev.awareness + finalScore
                }));
                setIsFinished(true);
            }
        }, 1500);
    };

    const treeSize = Math.max(60, treeHealth);

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage === 100) return "Every root planted. Your tree is strong.";
        if (percentage >= 60)  return "A growing tree. Belonging takes consistent effort.";
        return "The roots are there. They just need more tending.";
    };

    if (isFinished) {
        const percentage = (totalScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/noah_park.png')` }}
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

                    {/* Final tree */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div
                            className="rounded-full bg-emerald-500/30 border-2 border-emerald-500/50 flex items-center justify-center"
                            style={{ width: treeSize, height: treeSize }}
                        >
                            <span style={{ fontSize: treeSize * 0.5 }}>🌳</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center mt-3 max-w-xs">
                            {roots.map((root, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs"
                                >
                                    {root}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-white text-4xl font-bold">{totalScore}</p>
                        <p className="text-white/30 text-sm mt-1">out of {scene.scoring.maxScore}</p>
                    </motion.div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className="h-2 bg-emerald-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
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
        <div className="relative w-full h-screen flex flex-col items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/noah_park.png')` }}
            />
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 w-full max-w-md mx-6 flex flex-col items-center gap-6">

                {/* Header */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>
                    <p className="text-white/30 text-xs">
                        {currentIndex + 1} of {scene.actions.length}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1">
                    <motion.div
                        className="h-1 bg-emerald-400 rounded-full"
                        animate={{ width: `${(currentIndex / scene.actions.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                {/* Tree */}
                <motion.div
                    animate={{ scale: treeHealth / 80 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="flex flex-col items-center gap-2"
                >
                    <div
                        className="rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: `rgba(16, 185, 129, ${treeHealth / 200})`,
                            border: `2px solid rgba(16, 185, 129, ${treeHealth / 150})`
                        }}
                    >
                        <span className="text-4xl">🌳</span>
                    </div>

                    {/* Roots */}
                    <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                        <AnimatePresence>
                            {roots.map((root, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs"
                                >
                                    {root}
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Action card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full rounded-2xl border p-5 text-center transition-colors duration-300
                            ${result === null
                                ? "bg-white/5 border-white/10"
                                : currentAction.type === "positive" && result === "positive"
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : currentAction.type === "negative" && result === "negative"
                                        ? "bg-blue-500/10 border-blue-500/30"
                                        : "bg-red-500/10 border-red-500/30"
                            }`}
                    >
                        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">
                            does this grow roots?
                        </p>
                        <p className="text-white text-base font-medium">
                            {currentAction.text}
                        </p>
                        {result !== null && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`text-xs mt-2 font-semibold uppercase tracking-widest
                                    ${currentAction.type === "positive" && result === "positive"
                                        ? "text-emerald-400"
                                        : currentAction.type === "negative" && result === "negative"
                                            ? "text-blue-400"
                                            : "text-red-400"
                                    }`}
                            >
                                {currentAction.type === "positive" && result === "positive"
                                    ? `✓ root added — ${currentAction.root}`
                                    : currentAction.type === "negative" && result === "negative"
                                        ? "✓ avoided"
                                        : currentAction.type === "positive" && result === "negative"
                                            ? "✗ missed a root"
                                            : "✗ this weakens the tree"
                                }
                            </motion.p>
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
                            className="grid grid-cols-2 gap-3 w-full"
                        >
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAction("positive")}
                                className="py-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold uppercase tracking-widest hover:bg-emerald-500/30 transition-all cursor-pointer"
                            >
                                🌱 Grow
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAction("negative")}
                                className="py-5 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold uppercase tracking-widest hover:bg-red-500/30 transition-all cursor-pointer"
                            >
                                ✗ Avoid
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default RootsOfBelonging;