import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";

const ReflectionScreen = ({ scene, onComplete }) => {

    const { score } = useGame();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 300);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-950 overflow-y-auto">
             <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/bedroom.png')` }}
            />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" />

            <div className="absolute inset-0 bg-linear-to-b from-violet-950/20 via-gray-950/60 to-gray-950" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: show ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-lg mx-6 flex flex-col gap-8 py-12 px-6"
            >

                {/* Chapter badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                >
                    <div className="px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
                        <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest">
                            {scene.title}
                        </p>
                    </div>
                </motion.div>

                {/* Summary */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-white/80 text-base leading-relaxed text-center italic"
                >
                    "{scene.summary}"
                </motion.p>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="w-full h-px bg-white/10"
                />

                {/* Key Learnings */}
                <div className="flex flex-col gap-3">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white/30 text-xs uppercase tracking-widest"
                    >
                        what you learned
                    </motion.p>

                    {scene.keyLearnings.map((point, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.4, duration: 0.5 }}
                            className="flex gap-3 items-start bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                        >
                            <span className="text-violet-400 mt-0.5">◆</span>
                            <p className="text-white/70 text-sm leading-relaxed">{point}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2.8, duration: 0.6 }}
                    className="w-full h-px bg-white/10"
                />

                {/* Score summary */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.5 }}
                    className="flex gap-4"
                >
                    {/* Connection meter */}
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                        <p className="text-white/30 text-xs uppercase tracking-widest">connection</p>
                        <p className="text-white text-2xl font-bold">{score.connection}</p>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                            <motion.div
                                className="h-1.5 bg-blue-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((score.connection / 10) * 100, 100)}%` }}
                                transition={{ delay: 3.2, duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    {/* Awareness score */}
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                        <p className="text-white/30 text-xs uppercase tracking-widest">awareness</p>
                        <p className="text-white text-2xl font-bold">{score.awareness}</p>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                            <motion.div
                                className="h-1.5 bg-violet-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((score.awareness / 53) * 100, 100)}%` }}
                                transition={{ delay: 3.4, duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Continue button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.6 }}
                    onClick={onComplete}
                    className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all cursor-pointer"
                >
                    continue to chapter 2 →
                </motion.button>

            </motion.div>
        </div>
    );
};

export default ReflectionScreen;