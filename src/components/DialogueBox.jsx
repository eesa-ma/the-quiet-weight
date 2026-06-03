import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DialogueBox = ({ scene, onComplete }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        const fullText = scene.lines[currentIndex].text;
        setDisplayedText("");
        setIsTyping(true);

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
            setDisplayedText(scene.lines[currentIndex].text);
            setIsTyping(false);
        } else {
            if (currentIndex < scene.lines.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }
    };

    const getSpeakerStyle = (speaker) => {
        switch (speaker) {
            case "avery": return { name: "Avery", color: "text-violet-400", align: "text-left" };
            case "player": return { name: "You", color: "text-blue-400", align: "text-right" };
            case "narration": return { name: null, color: "text-gray-400", align: "text-center italic" };
        }
    };

    const currentLine = scene.lines[currentIndex];
    const style = getSpeakerStyle(currentLine.speaker);

    return (
        <div
            className="relative w-full h-screen flex flex-col justify-end cursor-pointer"
            onClick={handleClick}
        >

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/backgrounds/${scene.background}.png')` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Dialogue Box */}
            <div className="relative z-10 m-6 rounded-2xl bg-black/70 backdrop-blur-sm border border-white/10 p-6 min-h-[160px]">

                {/* Speaker Name */}
                {style.name && (
                    <p className={`text-sm font-semibold mb-2 ${style.color} ${style.align}`}>
                        {style.name}
                    </p>
                )}

                {/* Dialogue Text */}
                <motion.p
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-white text-base leading-relaxed ${style.align} ${currentLine.speaker === "narration" ? "italic text-gray-300" : ""}`}
                >
                    {displayedText}
                </motion.p>

                {/* Continue Indicator */}
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
        </div>
    );
};

export default DialogueBox;