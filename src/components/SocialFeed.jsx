import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DialogueBox from "./DialogueBox";

const postColors = [
    "from-pink-500/40 to-rose-600/40",
    "from-blue-500/40 to-cyan-600/40",
    "from-amber-500/40 to-orange-600/40",
    "from-green-500/40 to-emerald-600/40",
    "from-violet-500/40 to-purple-600/40",
];

const fakeLikes = [142, 89, 231, 67, 178];
const fakeUsernames = ["jaden_k", "sofia.m", "ethan__r", "chloe.w", "jaden_k"];

const SocialFeed = ({ scene, onComplete }) => {

    const [phase, setPhase] = useState("intro");
    const [visiblePosts, setVisiblePosts] = useState([]);

    useEffect(() => {
        if (phase !== "scrolling") return;

        if (visiblePosts.length < scene.feed_posts.length) {
            const timeout = setTimeout(() => {
                setVisiblePosts(prev => [...prev, scene.feed_posts[prev.length]]);
            }, 600);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setPhase("observation");
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [visiblePosts, phase]);

    const getCurrentDialogue = () => {
        switch (phase) {
            case "intro":        return scene.intro_dialogue;
            case "observation":  return scene.observation_dialogue;
            case "key":          return scene.key_observation.dialogue;
            case "closing":      return scene.closing_dialogue;
            default:             return null;
        }
    };

    const handleDialogueComplete = () => {
        switch (phase) {
            case "intro":       return setPhase("scrolling");
            case "observation": return setPhase("key");
            case "key":         return setPhase("closing");
            case "closing":     return onComplete();
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-col">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Phone Frame */}
            <div className="relative z-10 flex items-center justify-center h-full p-2 md:p-4">
                <motion.div
                    animate={{ opacity: phase === "scrolling" ? 1 : 0.4 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[288px] h-[90dvh] max-h-130 md:h-130 bg-gray-950 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                >

                    {/* Instagram-style header */}
                    <div className="flex items-center justify-between px-4 py-2.5 md:px-5 md:py-3 border-b border-white/10 bg-gray-900 shrink-0">
                        <span className="text-white font-semibold text-xs md:text-sm italic">instagram</span>
                        <div className="flex gap-2.5 md:gap-3 text-white/40 text-base md:text-lg">
                            <span>♡</span>
                            <span>✉</span>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-0">
                        {visiblePosts.map((post, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col border-b border-white/5"
                            >
                                {/* Post header */}
                                <div className="flex items-center gap-2 px-3 py-2">
                                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-violet-400 to-pink-400" />
                                    <span className="text-white/70 text-xs">{fakeUsernames[index]}</span>
                                </div>

                                {/* Post image placeholder */}
                                <div className={`w-full h-36 bg-linear-to-br ${postColors[index]} flex items-center justify-center`}>
                                    <p className="text-white/60 text-xs text-center px-4">{post.label}</p>
                                </div>

                                {/* Post actions — faded, not clickable */}
                                <div className="px-3 py-2">
                                    <div className="flex gap-3 text-white/20 text-sm mb-1">
                                        <span>♡</span>
                                        <span>💬</span>
                                        <span>↗</span>
                                    </div>
                                    <p className="text-white/30 text-xs">{fakeLikes[index]} likes</p>
                                </div>

                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>

            {/* Dialogue — all phases */}
            {phase !== "scrolling" && getCurrentDialogue() && (
                <DialogueBox
                    key={phase}
                    scene={{
                        lines: getCurrentDialogue(),
                        background: scene.background
                    }}
                    onComplete={handleDialogueComplete}
                    noBackground
                />
            )}

        </div>
    );
};

export default SocialFeed;