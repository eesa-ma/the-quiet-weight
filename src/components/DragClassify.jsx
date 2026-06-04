import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const DragClassify = ({ scene, onComplete }) => {
    const { setScore } = useGame();

    // Track where each signal has been placed: { signalId: categoryName }
    const [placements, setPlacements] = useState({});
    // Which signal card is currently being dragged
    const [dragging, setDragging] = useState(null);
    // Which category is being hovered during drag
    const [hovering, setHovering] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const unplaced = scene.signals.filter(s => !placements[s.id]);

    // ── Drag handlers (mouse + touch unified via pointer events) ──────────
    const dragRef = useRef(null);

    const handleDragStart = (signal) => {
        setDragging(signal);
    };

    const handleDragEnd = () => {
        if (dragging && hovering) {
            setPlacements(prev => ({ ...prev, [dragging.id]: hovering }));
        }
        setDragging(null);
        setHovering(null);
    };

    const handleCategoryEnter = (cat) => {
        if (dragging) setHovering(cat);
    };

    const handleCategoryLeave = () => {
        setHovering(null);
    };

    // Remove a placed signal back to unplaced
    const handleRemove = (signalId) => {
        setPlacements(prev => {
            const next = { ...prev };
            delete next[signalId];
            return next;
        });
    };

    // Submit and score
    const handleSubmit = () => {
        let score = 0;
        scene.signals.forEach(s => {
            if (placements[s.id] === s.correct) {
                score += scene.scoring.perCorrect;
            }
        });
        setScore(prev => ({
            ...prev,
            awareness: prev.awareness + score
        }));
        setFinalScore(score);
        setIsFinished(true);
    };

    const getFeedback = (score) => {
        const pct = score / scene.scoring.maxScore;
        if (pct === 1) return "Flawless. You understand exactly what's happening beneath the surface.";
        if (pct >= 0.7) return "Strong read. You're picking up on the patterns most people miss.";
        if (pct >= 0.4) return "Getting there. Some causes are subtle — look closer next time.";
        return "Keep looking. These signs are easy to overlook, but they matter.";
    };

    // ── Results screen ────────────────────────────────────────────────────
    if (isFinished) {
        const pct = (finalScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/${scene.background ?? "apartment_night"}.png')` }}
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-linear-to-b from-violet-950/40 to-gray-950/80" />

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
                        <p className="text-white text-6xl font-bold">{finalScore}</p>
                        <p className="text-white/30 text-sm mt-1">out of {scene.scoring.maxScore}</p>
                    </motion.div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className="h-2 bg-violet-400 rounded-full"
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
                        "{getFeedback(finalScore)}"
                    </motion.p>

                    {/* Per-signal breakdown */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="w-full flex flex-col gap-2 text-left max-h-48 overflow-y-auto"
                    >
                        {scene.signals.map(s => {
                            const correct = placements[s.id] === s.correct;
                            return (
                                <div
                                    key={s.id}
                                    className={`rounded-xl border px-4 py-2 text-xs ${
                                        correct
                                            ? "bg-green-500/10 border-green-500/30 text-green-300"
                                            : "bg-red-500/10 border-red-500/30 text-red-300"
                                    }`}
                                >
                                    <p className="font-medium mb-0.5">{correct ? "✓" : "✗"} {s.statement}</p>
                                    <p className="text-white/50">{s.explanation}</p>
                                </div>
                            );
                        })}
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        onClick={() => onComplete(scene.next)}
                        className="mt-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all cursor-pointer"
                    >
                        continue →
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // ── Main game screen ──────────────────────────────────────────────────
    const allPlaced = unplaced.length === 0;

    return (
        <div
            className="relative w-full h-screen flex flex-col overflow-hidden"
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background ?? "apartment_night"}.png')` }}
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-linear-to-b from-violet-950/30 to-gray-950/70" />

            <div className="relative z-10 flex flex-col h-full px-4 py-6 gap-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                        {scene.title}
                    </p>
                    <p className="text-white/30 text-xs">
                        {Object.keys(placements).length} / {scene.signals.length} placed
                    </p>
                </div>

                <p className="text-white/50 text-xs shrink-0">{scene.instructions}</p>

                {/* Signal cards to drag */}
                <div className="shrink-0">
                    <p className="text-white/30 text-xs mb-2 uppercase tracking-widest">Drag these behaviours</p>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {unplaced.map(signal => (
                                <motion.div
                                    key={signal.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    draggable
                                    onDragStart={() => handleDragStart(signal)}
                                    onDragEnd={handleDragEnd}
                                    onTouchStart={() => handleDragStart(signal)}
                                    className={`px-3 py-2 rounded-xl border text-xs text-white cursor-grab active:cursor-grabbing select-none transition-all max-w-50 ${
                                        dragging?.id === signal.id
                                            ? "bg-violet-600/40 border-violet-400/60 scale-105"
                                            : "bg-white/8 border-white/15 hover:bg-white/12"
                                    }`}
                                >
                                    {signal.statement}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Category drop zones */}
                <div className="flex-1 overflow-y-auto">
                    <p className="text-white/30 text-xs mb-2 uppercase tracking-widest">Into a category</p>
                    <div className="grid grid-cols-2 gap-2">
                        {scene.categories.map(cat => {
                            const placedHere = scene.signals.filter(s => placements[s.id] === cat);
                            const isHovered = hovering === cat && dragging;
                            return (
                                <div
                                    key={cat}
                                    onDragOver={(e) => { e.preventDefault(); handleCategoryEnter(cat); }}
                                    onDragLeave={handleCategoryLeave}
                                    onDrop={() => { if (dragging) { setPlacements(prev => ({ ...prev, [dragging.id]: cat })); setDragging(null); setHovering(null); }}}
                                    className={`rounded-xl border p-3 min-h-20 transition-all ${
                                        isHovered
                                            ? "bg-violet-500/20 border-violet-400/60"
                                            : "bg-white/5 border-white/10"
                                    }`}
                                >
                                    <p className="text-violet-300 text-xs font-semibold mb-2">{cat}</p>
                                    <div className="flex flex-col gap-1">
                                        <AnimatePresence>
                                            {placedHere.map(s => (
                                                <motion.div
                                                    key={s.id}
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-xs text-white/80 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-all"
                                                    onClick={() => handleRemove(s.id)}
                                                    title="Click to remove"
                                                >
                                                    {s.statement}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Submit */}
                <AnimatePresence>
                    {allPlaced && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            onClick={handleSubmit}
                            className="shrink-0 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all cursor-pointer"
                        >
                            see results →
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DragClassify;
