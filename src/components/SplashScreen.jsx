import { motion } from "framer-motion";

const SplashScreen = () => {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-950 overflow-hidden">
            {/* Background ambient gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-violet-900/20 to-gray-950" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 flex flex-col items-center gap-6"
            >
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white/90">
                    THE QUIET WEIGHT
                </h1>

                {/* Loading indicator */}
                <div className="flex gap-2 items-center mt-8">
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
