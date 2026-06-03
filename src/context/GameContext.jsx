import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
    const [score, setScore] = useState({ connection: 0, awareness: 0 });

    return (
        <GameContext.Provider value={{ score, setScore }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => useContext(GameContext);