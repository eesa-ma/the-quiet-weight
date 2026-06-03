import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DialogueBox from "./DialogueBox";

const TextMessage = ({ scene, onComplete }) => {

    const [visibleMessages, setVisibleMessages] = useState([]);
    const [showingDialogue, setShowingDialogue] = useState(false);

    useEffect(() => {
        if (visibleMessages.length < scene.messages.length) {
            const timeout = setTimeout(() => {
                setVisibleMessages(prev => [...prev, scene.messages[prev.length]]);
            }, 800);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setShowingDialogue(true);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [visibleMessages]);

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
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="w-80 h-[520px] bg-gray-950 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden">

                    {/* Phone top bar */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gray-900">
                        <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center">
                            <span className="text-violet-300 text-xs font-bold">P</span>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">Preethi</p>
                            <p className="text-white/30 text-xs">online</p>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-hidden">

                        <AnimatePresence>
                            {visibleMessages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: msg.sender === "maya" ? 40 : -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.sender === "maya" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                                        ${msg.sender === "maya"
                                            ? "bg-violet-600 text-white rounded-br-sm"
                                            : "bg-gray-700 text-white/90 rounded-bl-sm"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator */}
                        {visibleMessages.length < scene.messages.length && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-white/50"
                                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Observation Dialogue */}
            {showingDialogue && (
                <DialogueBox
                    scene={{
                        lines: scene.observation.dialogue,
                        background: scene.background
                    }}
                    onComplete={onComplete}
                />
            )}

        </div>
    );
};

export default TextMessage;