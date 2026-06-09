import { motion } from "framer-motion";

/**
 * Full-screen overlay prompting the user to rotate their device to landscape.
 * Shown during gameplay when the device is in portrait orientation.
 */
const RotateDevice = () => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-gray-950 select-none">

            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-900/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">

                {/* Animated phone rotation icon */}
                <motion.div
                    animate={{ rotate: [0, -90, -90, 0] }}
                    transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.35, 0.65, 1],
                    }}
                    className="relative"
                >
                    {/* Phone outline */}
                    <svg
                        width="64"
                        height="96"
                        viewBox="0 0 64 96"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="2"
                            y="2"
                            width="60"
                            height="92"
                            rx="12"
                            stroke="url(#phone-gradient)"
                            strokeWidth="3"
                            fill="none"
                        />
                        {/* Screen area */}
                        <rect
                            x="8"
                            y="14"
                            width="48"
                            height="64"
                            rx="4"
                            fill="rgba(139, 92, 246, 0.08)"
                            stroke="rgba(139, 92, 246, 0.2)"
                            strokeWidth="1"
                        />
                        {/* Home indicator */}
                        <rect
                            x="22"
                            y="84"
                            width="20"
                            height="3"
                            rx="1.5"
                            fill="rgba(139, 92, 246, 0.3)"
                        />
                        {/* Camera notch */}
                        <circle cx="32" cy="8" r="2" fill="rgba(139, 92, 246, 0.25)" />
                        <defs>
                            <linearGradient id="phone-gradient" x1="0" y1="0" x2="64" y2="96">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                {/* Curved rotation arrow */}
                <motion.svg
                    width="48"
                    height="32"
                    viewBox="0 0 48 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="-mt-4"
                >
                    <path
                        d="M8 24C8 12 18 4 28 4"
                        stroke="rgba(139, 92, 246, 0.5)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        d="M24 0L30 4L24 8"
                        stroke="rgba(139, 92, 246, 0.5)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </motion.svg>

                {/* Text content */}
                <div className="flex flex-col gap-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-white text-xl font-bold tracking-tight"
                    >
                        Rotate Your Device
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-white/40 text-sm max-w-xs leading-relaxed"
                    >
                        This experience is best played in landscape mode.
                        Please rotate your device to continue.
                    </motion.p>
                </div>

                {/* Subtle pulsing ring decoration */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -z-10 w-48 h-48 rounded-full border border-violet-500/20"
                />
            </div>
        </div>
    );
};

export default RotateDevice;
