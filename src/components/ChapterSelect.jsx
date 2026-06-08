import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const chapters = [
    // add seperate backgorunds to chpaters
    {
        number: 1,
        tag: "Chapter 1",
        title: "Age 10 - 17",
        background: "cafeteria",
        accentColor: "violet",
        characters: [
            {
                id: "Tiya",
                name: "Tiya",
                ageGroup: "Teenager (15)",
                description: "Peer exclusion, school life, and the loneliness of not fitting in.",
                startSceneId: "cafeteria_intro",
                background: "cafeteria",
            },
            {
                id: "liam",
                name: "liam",
                ageGroup: "Teenager (13)",
                description: "Liam wants connection but has spent years in an environment where emotions are rarely discussed. He carries the habit of silence with him everywhere.",
                startSceneId: "liam_intro",
                background: "liam_bedroom",
            },
        ],
    },
    {
        number: 2,
        tag: "Chapter 2",
        title: "Age 18-25",
        background: "bedroom",
        accentColor: "indigo",
        characters: [
            {
                id: "ethan",
                name: "Ethan",
                ageGroup: "Young Adult (22)",
                description: "Loneliness among young adults, even when surrounded by people.",
                startSceneId: "chapter2_start",
                background: "bedroom",
            },
        ],
    },
    {
        number: 3,
        tag: "Chapter 3",
        title: "Age 26-32",
        background: "balcony",
        accentColor: "pink",
        characters: [
            {
                id: "sarah",
                name: "Sarah",
                ageGroup: "Adult (29)",
                description: "Career pressures, changing friendships, and the hidden loneliness of adult life.",
                startSceneId: "chapter3_start",
                background: "balcony",
            },
        ],
    },
    {
        number: 4,
        tag: "Chapter 4",
        title: "Age 33-40",
        background: "daniel_living_room",
        accentColor: "violet",
        characters: [
            {
                id: "daniel",
                name: "Daniel",
                ageGroup: "Adult (38)",
                description: "Divorce, social withdrawal, and rebuilding life after losing a long-term relationship.",
                startSceneId: "daniel_intro",
                background: "daniel_living_room",
            },
            {
                id: "saya",
                name: "Saya",
                ageGroup: "Adult (33)",
                description: "Feeling misunderstood, losing confidence, and struggling to recognize yourself after major life changes.",
                startSceneId: "saya_intro",
                background: "saya_office",
            },
            {
                id: "noah",
                name: "Noah",
                ageGroup: "Adult (35)",
                description: "Relocation, starting over, homesickness, and building belonging in a new environment.",
                startSceneId: "noah_intro",
                background: "noah_coffee_shop",
            },
        ],
    },
    {
        number: 5,
        tag: "Chapter 5",
        title: "Age 41-60",
        background: "rajan_train",
        accentColor: "indigo",
        characters: [
            {
                id: "rajan",
                name: "Rajan",
                ageGroup: "Adult (57)",
                description: "Retirement on the horizon, adult children who no longer call, a marriage that has settled into silence, and the quiet loss of a professional identity that once defined everything.",
                startSceneId: "rajan_intro",
                background: "rajan_train",
            },
        ],
    },
    {
        number: 6,
        tag: "Chapter 6",
        title: "Age 60+",
        background: "eleanor_garden_intro",
        accentColor: "pink",
        characters: [
            {
                id: "thomas",
                name: "Thomas",
                ageGroup: "Senior (68)",
                description: "Widowhood, technology gap, retired identity, and the invisible loneliness that hides behind daily routine.",
                startSceneId: "thomas_intro",
                background: "thomas_living_room",
            },
            {
                id: "eleanor",
                name: "Eleanor",
                ageGroup: "Senior (71)",
                description: "Empty nest, volunteering stopped, growing plants for no one, and the ache of a full life without an audience.",
                startSceneId: "eleanor_intro",
                background: "eleanor_garden_intro",
            },
        ],
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
    pink: {
        border: "border-pink-500/40",
        hoverBorder: "hover:border-pink-400/70",
        tag: "text-pink-400",
        tagBg: "bg-pink-500/15",
        glow: "shadow-pink-900/60",
        button: "bg-pink-600 hover:bg-pink-500",
        dot: "bg-pink-400",
        overlay: "from-pink-950/60",
    },
};

const ChapterCard = ({ chapter, index, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    const ac = accentClasses[chapter.accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 shadow-xl ${ac.border} ${ac.hoverBorder} ${ac.glow}`}
            onClick={() => onSelect(chapter)}
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
                    {chapter.title}
                </h2>

                {/* Character count */}
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${ac.dot}`} />
                    <p className="text-white/60 text-sm">
                        {chapter.characters.length} {chapter.characters.length === 1 ? "story" : "stories"}
                    </p>
                </div>

                {/* Character names preview */}
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                    {chapter.characters.map(c => c.name).join(" · ")}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/10">
                    <p className="text-white/30 text-xs">
                        {chapter.characters.length === 1 ? "1 character" : `${chapter.characters.length} characters`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-250 gap-4">
                {chapters.map((chapter, i) => (
                    <ChapterCard
                        key={chapter.number}
                        chapter={chapter}
                        index={i}
                        onSelect={onSelect}
                    />
                ))}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-14 flex flex-col items-center gap-3"
            >
                <div className="flex items-center gap-3 text-white/15">
                    <div className="w-8 h-px bg-white/15" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium">A lifespan of loneliness</span>
                    <div className="w-8 h-px bg-white/15" />
                </div>
                <p className="text-white/20 text-[11px] text-center max-w-sm leading-relaxed">
                    Every chapter is a different life. Every life carries the same quiet weight.
                </p>
            </motion.div>
        </div>
    );
};

export default ChapterSelect;
