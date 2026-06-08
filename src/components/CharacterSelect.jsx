import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const accentClasses = {
    violet: {
        border: "border-violet-500/40",
        hoverBorder: "hover:border-violet-400/70",
        tag: "text-violet-400",
        tagBg: "bg-violet-500/15",
        glow: "shadow-violet-900/60",
        button: "bg-violet-600 hover:bg-violet-500",
        dot: "bg-violet-400",
        overlay: "from-violet-950/70",
        ring: "ring-violet-500/50",
    },
    indigo: {
        border: "border-indigo-500/40",
        hoverBorder: "hover:border-indigo-400/70",
        tag: "text-indigo-300",
        tagBg: "bg-indigo-500/15",
        glow: "shadow-indigo-900/60",
        button: "bg-indigo-600 hover:bg-indigo-500",
        dot: "bg-indigo-400",
        overlay: "from-indigo-950/70",
        ring: "ring-indigo-500/50",
    },
    pink: {
        border: "border-pink-500/40",
        hoverBorder: "hover:border-pink-400/70",
        tag: "text-pink-400",
        tagBg: "bg-pink-500/15",
        glow: "shadow-pink-900/60",
        button: "bg-pink-600 hover:bg-pink-500",
        dot: "bg-pink-400",
        overlay: "from-pink-950/70",
        ring: "ring-pink-500/50",
    },
    amber: {
        border: "border-amber-500/40",
        hoverBorder: "hover:border-amber-400/70",
        tag: "text-amber-400",
        tagBg: "bg-amber-500/15",
        glow: "shadow-amber-900/60",
        button: "bg-amber-600 hover:bg-amber-500",
        dot: "bg-amber-400",
        overlay: "from-amber-950/70",
        ring: "ring-amber-500/50",
    },
};

const CharacterCard = ({ character, chapter, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    const ac = accentClasses[chapter.accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 shadow-xl
                ${ac.border} ${ac.hoverBorder} ${ac.glow}
                ${hovered ? `ring-1 ${ac.ring}` : ""}`}
            onClick={() => onSelect(character.startSceneId)}
        >
            {/* Background: chapter background dimmed */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{
                    backgroundImage: `url('/assets/backgrounds/${character.background}.png')`,
                    transform: hovered ? "scale(1.05)" : "scale(1)",
                }}
            />
            <div className={`absolute inset-0 bg-linear-to-t ${ac.overlay} via-gray-950/80 to-gray-950/30`} />

            {/* Character sprite */}
            {/* {character.sprite && (
                <motion.img
                    src={character.sprite}
                    alt={character.name}
                    animate={{ scale: hovered ? 1.04 : 1 }}
                    transition={{ duration: 0.35 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-56 w-auto object-contain z-10 drop-shadow-xl"
                />
            )} */}

            {/* Placeholder silhouette when no sprite */}
            {/* {!character.sprite && (
                <motion.div
                    animate={{ opacity: hovered ? 0.25 : 0.15 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-48 z-10"
                >
                    <svg viewBox="0 0 100 200" className="w-full h-full fill-white/60">
                        <ellipse cx="50" cy="35" rx="22" ry="25" />
                        <path d="M15 90 Q15 60 50 60 Q85 60 85 90 L90 180 H10 Z" />
                    </svg>
                </motion.div>
            )} */}

            {/* Content */}
            <div className="relative z-20 p-6 flex flex-col gap-3 min-h-64 justify-end">

                {/* Name */}
                <h3 className="text-white text-2xl font-bold leading-tight">{character.name}</h3>

                {/* Age */}
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${ac.dot}`} />
                    <p className="text-white/60 text-sm">{character.ageGroup}</p>
                </div>

                {/* Description */}
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                    {character.description}
                </p>

                {/* Play button */}
                <motion.div
                    animate={{ x: hovered ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`self-start mt-2 px-5 py-2 rounded-xl text-white text-xs font-semibold ${ac.button} transition-colors`}
                >
                    play →
                </motion.div>
            </div>
        </motion.div>
    );
};

const CharacterSelect = ({ chapter, onSelect, onBack }) => {
    const ac = accentClasses[chapter.accentColor];

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-950 overflow-hidden px-6 py-12">

            {/* Ambient glow matching chapter colour */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ background: `var(--${chapter.accentColor}-glow, #7c3aed)` }} />

            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onClick={onBack}
                className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                </svg>
                back
            </motion.button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
            >
                <span className={`text-xs font-semibold uppercase tracking-[0.25em] px-3 py-1 rounded-full ${ac.tag} ${ac.tagBg}`}>
                    {chapter.tag}
                </span>
                <h1 className="text-white text-3xl font-bold tracking-tight mt-4 mb-2">
                    {chapter.title}
                </h1>
                <p className="text-white/40 text-sm">
                    Choose whose story you want to follow
                </p>
            </motion.div>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-16 h-px bg-white/15 mb-10"
            />

            {/* Character cards */}
            <AnimatePresence>
                <div className={`w-full max-w-3xl grid gap-5 ${chapter.characters.length === 1
                    ? "grid-cols-1 max-w-sm"
                    : chapter.characters.length === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                    }`}>
                    {chapter.characters.map((character, i) => (
                        <motion.div
                            key={character.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.1 }}
                        >
                            <CharacterCard
                                character={character}
                                chapter={chapter}
                                onSelect={onSelect}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-white/20 text-xs mt-10 text-center"
                >
                    More characters coming soon
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

export default CharacterSelect;
