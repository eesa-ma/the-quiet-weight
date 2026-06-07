import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

const NewCity = ({ scene, onComplete }) => {

    const { setScore } = useGame();

    const [visitedLocations, setVisitedLocations] = useState([]);
    const [activeLocation, setActiveLocation] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [totalScore, setTotalScore] = useState(0);

    const handleLocationClick = (location) => {
        if (visitedLocations.includes(location.id)) return;
        setActiveLocation(location);
    };

    const handleDismiss = () => {
        const newVisited = [...visitedLocations, activeLocation.id];
        const newScore = totalScore + activeLocation.connectionValue * 10;
        setVisitedLocations(newVisited);
        setTotalScore(newScore);
        setActiveLocation(null);

        if (newVisited.length === scene.locations.length) {
            setScore(prev => ({
                ...prev,
                awareness: prev.awareness + newScore
            }));
            setTimeout(() => setIsFinished(true), 500);
        }
    };

    const getFeedbackMessage = (score) => {
        const percentage = (score / scene.scoring.maxScore) * 100;
        if (percentage >= 80) return "You explored everything. Belonging requires exactly this kind of curiosity.";
        if (percentage >= 50) return "A good start. Every location holds a door — some just take longer to open.";
        return "The city has more to offer. Belonging begins with exploration.";
    };

    if (isFinished) {
        const percentage = (totalScore / scene.scoring.maxScore) * 100;
        return (
            <div className="relative w-full h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/noah_city_street.png')` }}
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
        <div className="relative w-full h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/noah_city_street.png')` }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Header */}
            <div className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center gap-2">
                <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                    {scene.title}
                </p>
                <p className="text-white/40 text-xs">{scene.instructions}</p>
                <p className="text-white/30 text-xs">
                    {visitedLocations.length} / {scene.locations.length} explored
                </p>
            </div>

            {/* Location pins */}
            {scene.locations.map((location) => {
                const isVisited = visitedLocations.includes(location.id);
                return (
                    <motion.button
                        key={location.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.random() * 0.5 }}
                        style={{
                            position: "absolute",
                            left: `${location.x}%`,
                            top: `${location.y}%`,
                            transform: "translate(-50%, -50%)"
                        }}
                        onClick={() => handleLocationClick(location)}
                        className="z-10 flex flex-col items-center gap-1 cursor-pointer"
                    >
                        {/* Pulse ring */}
                        {!isVisited && (
                            <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute w-10 h-10 rounded-full bg-violet-400/40"
                            />
                        )}

                        {/* Pin */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg transition-all
                            ${isVisited
                                ? "bg-emerald-500/80 border-2 border-emerald-400"
                                : "bg-black/70 border-2 border-violet-400/60 hover:border-violet-400"
                            }`}
                        >
                            {isVisited ? "✓" : location.emoji}
                        </div>

                        {/* Label */}
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${isVisited ? "bg-emerald-500/20 text-emerald-300" : "bg-black/60 text-white/70"}`}
                        >
                            {location.label}
                        </div>
                    </motion.button>
                );
            })}

            {/* Location card overlay */}
            <AnimatePresence>
                {activeLocation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-end justify-center bg-black/60"
                        onClick={handleDismiss}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md mx-4 mb-8 bg-gray-900 border border-white/10 rounded-2xl p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{activeLocation.emoji}</span>
                                <div>
                                    <p className="text-white font-semibold">{activeLocation.label}</p>
                                    <p className="text-violet-400 text-xs">
                                        +{activeLocation.connectionValue * 10} connection
                                    </p>
                                </div>
                            </div>

                            <p className="text-white/80 text-sm leading-relaxed mb-3">
                                {activeLocation.opportunity}
                            </p>

                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 mb-4">
                                <p className="text-violet-300 text-xs leading-relaxed">
                                    {activeLocation.insight}
                                </p>
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium cursor-pointer transition-all"
                            >
                                explore this place →
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default NewCity;