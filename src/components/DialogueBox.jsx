import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTTSContext } from "../context/TTSContext";
import { useTTS } from "../hooks/useTTS";


const DialogueBox = ({ scene, onComplete, noBackground = false }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [displayedText, setDisplayedText] = useState("");

    const { muted } = useTTSContext();
    const { speak, cancel } = useTTS(muted);

    useEffect(() => {
        const line = scene.lines[currentIndex];
        const fullText = line.text;
        setDisplayedText("");
        setIsTyping(true);

        // Speak the full text immediately while typewriter plays
        speak(fullText, line.speaker);

        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 25);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleClick = () => {
        if (isTyping) {
            // Skip typewriter — let TTS keep playing
            setDisplayedText(scene.lines[currentIndex].text);
            setIsTyping(false);
        } else {
            cancel(); // Stop current speech before next line
            if (currentIndex < scene.lines.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                handleClick();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isTyping, currentIndex, scene.lines.length, onComplete]);

    const characterSprites = {
        avery:  "/assets/characters/avery.png",
        player: "/assets/characters/player.png",
    };

    const currentLine = scene.lines[currentIndex];
    const isNarration = currentLine.speaker === "narration";
    const isAvery = currentLine.speaker === "avery";
    const isPlayer = currentLine.speaker === "player";

    return (
        <div
            className="relative w-full h-screen flex flex-col justify-end cursor-pointer"
            onClick={handleClick}
        >

            {/* Background */}
            {!noBackground && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
                />
            )}

            {/* Dark overlay */}
            {!noBackground && (
                <div className="absolute inset-0 bg-black/40" />
            )}

            {/* Characters + Speech Bubbles */}
            {!isNarration && (
                <>
                    {/* Avery — left side */}
                    <div className="absolute bottom-0 left-8 z-10 flex flex-col items-start">

                        {/* Speech bubble above Avery */}
                        {isAvery && (
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative mb-2 max-w-55"
                            >
                                {/* Bubble */}
                                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg">
                                    <p className="text-violet-700 text-xs font-bold mb-1">Avery</p>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        {displayedText}
                                    </p>
                                    {/* Continue dot */}
                                    {!isTyping && (
                                        <motion.span
                                            className="text-gray-400 text-xs"
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.2 }}
                                        >
                                            ●
                                        </motion.span>
                                    )}
                                </div>
                                {/* Bubble tail pointing down-left */}
                                <div className="w-3 h-3 bg-white absolute -bottom-1.5 left-4 rotate-45 rounded-sm" />
                            </motion.div>
                        )}

                        {/* Avery sprite */}
                        <motion.img
                            src={characterSprites["avery"]}
                            alt="avery"
                            animate={{
                                opacity: isAvery ? 1 : 0.35,
                                scale:   isAvery ? 1 : 0.95
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-72 w-auto object-contain"
                        />
                    </div>

                    {/* Player — right side */}
                    <div className="absolute bottom-0 right-8 z-10 flex flex-col items-end">

                        {/* Speech bubble above Player */}
                        {isPlayer && (
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative mb-2 max-w-55"
                            >
                                {/* Bubble */}
                                <div className="bg-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
                                    <p className="text-blue-600 text-xs font-bold mb-1 text-right">You</p>
                                    <p className="text-gray-800 text-sm leading-relaxed text-right">
                                        {displayedText}
                                    </p>
                                    {!isTyping && (
                                        <motion.span
                                            className="text-gray-400 text-xs flex justify-end"
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.2 }}
                                        >
                                            ●
                                        </motion.span>
                                    )}
                                </div>
                                {/* Bubble tail pointing down-right */}
                                <div className="w-3 h-3 bg-white absolute -bottom-1.5 right-4 rotate-45 rounded-sm" />
                            </motion.div>
                        )}

                        {/* Player sprite */}
                        <motion.img
                            src={characterSprites["player"]}
                            alt="player"
                            animate={{
                                opacity: isPlayer ? 1 : 0.35,
                                scale:   isPlayer ? 1 : 0.95
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-72 w-auto object-contain"
                        />
                    </div>
                </>
            )}

            {/* Narration — bottom bar only */}
            {isNarration && (
                <div className="relative z-10 m-6 rounded-2xl bg-black/70 backdrop-blur-sm border border-white/10 p-6 min-h-30">
                    <motion.p
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-300 text-base leading-relaxed text-center italic"
                    >
                        {displayedText}
                    </motion.p>
                    {!isTyping && (
                        <motion.span
                            className="absolute bottom-4 right-6 text-white/50 text-xs"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                            click to continue ▼
                        </motion.span>
                    )}
                </div>
            )}

        </div>
    );
};

export default DialogueBox;