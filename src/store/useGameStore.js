import { use } from "react";
import { create } from "zustand";

const useGameStore = create((set) => ({
    // --- STATE ---
    gameState: 'playing', // Added: skips the start menu for testing
    currentChapter: 1,    // Added: tracks the active chapter
    
    // We start directly in the cafeteria scene so we can test it immediately
    currentSceneId: 'ch1_cafeteria_observation',

    // Scores based on your Game Design Document
    connectionMeter: 50, // Starts neutral in the middle (0-100 scale)
    awarenessScore: 0,   // Starts at 0, increases as player finds hidden signals

    // --- ACTIONS ---
    // Function to move to the next scene/node in your story data
    setScene: (sceneId) => set({ currentSceneId: sceneId }),

    // Function to update both scores simultaneously
    updateScores: (connectionChange, awarenessChange) =>
        set((state) => ({
            // We use Math.max and Math.min to ensure the connection meter never goes below 0 or above 100
            connectionMeter: Math.max(0, Math.min(100, state.connectionMeter + connectionChange)),
            // Awareness just accumulates as they learn more
            awarenessScore: state.awarenessScore + awarenessChange,
        })),
}));

export default useGameStore;