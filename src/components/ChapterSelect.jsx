import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chapter1 from "../data/chapter1.json";
import chapter2 from "../data/chapter2.json";

const chapters = [
    {
        data: chapter1,
        startSceneId: "cafeteria_intro",
        number: 1,
        background: "cafeteria",
        accentColor: "violet",
        tag: "Chapter 1",
    },
    {
        data: chapter2,
        startSceneId: "chapter2_start",
        number: 2,
        background: "bedroom",
        accentColor: "indigo",
        tag: "Chapter 2",
    },
];

const accentClasses = {
    violet: {
        border: "border-violet-500/40",
        hoverBorder: "hover:border-violet-400/70",
        tag: "text-violet-400",
        tagBg: "bg-violet-500/15",
        glow: "shadow-violet-900/60",
        button: "bg-violet-600 hover:bg-violet-500",
        dot: "bg-violet-400",
        overlay: "from-violet-950/60",
    },
    indigo: {
        border: "border-indigo-500/40",
        hoverBorder: "hover:border-indigo-400/70",
        tag: "text-indigo-300",
        tagBg: "bg-indigo-500/15",
        glow: "shadow-indigo-900/60",
        button: "bg-indigo-600 hover:bg-indigo-500",
        dot: "bg-indigo-400",
        overlay: "from-indigo-950/60",
    },
};

const ChapterCard = ({ chapter, index, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    const ac = accentClasses[chapter.accentColor];
    const { data } = chapter;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 shadow-xl ${ac.border} ${ac.hoverBorder} ${ac.glow}`}
            onClick={() => onSelect(chapter.startSceneId)}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{
                    backgroundImage: `url('/assets/backgrounds/${chapter.background}.png')`,
                    transform: hovered ? "scale(1.05)" : "scale(1)",
                }}
            />

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-linear-to-t ${ac.overlay} via-gray-950/70 to-gray-950/20`} />

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col gap-3 min-h-70 justify-end">

                {/* Tag */}
                <motion.span
                    animate={{ opacity: 1 }}
                    className={`self-start text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${ac.tag} ${ac.tagBg}`}
                >
                    {chapter.tag}
                </motion.span>

                {/* Title */}
                <h2 className="text-white text-2xl font-bold leading-tight">
                    {data.title}
                </h2>

                {/* Character */}
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${ac.dot}`} />
                    <p className="text-white/60 text-sm">
                        {data.character} · {data.ageGroup}
                    </p>
                </div>

                {/* Theme */}
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                    {data.theme}
                </p>

                {/* Scene count */}
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/10">
                    <p className="text-white/30 text-xs">
                        {data.scenes.length} scenes
                    </p>
                    <motion.p
                        animate={{ x: hovered ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-xs font-medium ${ac.tag}`}
                    >
                        play →
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};

const ChapterSelect = ({ onSelect }) => {
    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-950 overflow-hidden px-6 py-12">

            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-100 h-75 bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <p className="text-violet-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                    Mind Empowered
                </p>
                <h1 className="text-white text-4xl font-bold tracking-tight mb-3">
                    The Quiet Weight
                </h1>
                <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                    An interactive experience about loneliness — the kind that hides in plain sight.
                </p>
            </motion.div>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-16 h-px bg-white/15 mb-10"
            />

            {/* Chapter cards */}
            <div className="w-full max-w-lg flex flex-col gap-4">
                {chapters.map((chapter, i) => (
                    <ChapterCard
                        key={chapter.number}
                        chapter={chapter}
                        index={i}
                        onSelect={onSelect}
                    />
                ))}
            </div>

            {/* Footer note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/20 text-xs mt-10 text-center"
            >
                More chapters coming soon
            </motion.p>
        </div>
    );
};

export default ChapterSelect;
