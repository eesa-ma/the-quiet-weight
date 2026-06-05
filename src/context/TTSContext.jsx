import { createContext, useContext, useState } from "react";

const TTSContext = createContext(null);

export const TTSProvider = ({ children }) => {
    const [muted, setMuted] = useState(false);
    const toggle = () => setMuted(prev => !prev);

    return (
        <TTSContext.Provider value={{ muted, toggle }}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTSContext = () => useContext(TTSContext);
