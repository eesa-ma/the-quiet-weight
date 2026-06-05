import { useEffect, useRef, useCallback } from "react";

// Voice profiles per speaker
const VOICE_PROFILES = {
    narration: {
        // Female narrator — calm, measured
        preferredNames: ["Samantha", "Karen", "Moira", "Fiona", "Victoria", "Zira", "Hazel", "Google UK English Female"],
        pitch: 1.1,
        rate: 0.85,
        volume: 0.9,
    },
    avery: {
        // Male — slightly deeper, relaxed
        preferredNames: ["Daniel", "Google UK English Male", "Microsoft David", "Alex", "Mark"],
        pitch: 0.9,
        rate: 0.92,
        volume: 1,
    },
    player: {
        // Male — slightly higher pitch than Avery to distinguish
        preferredNames: ["Daniel", "Google UK English Male", "Microsoft David", "Alex", "Mark"],
        pitch: 1.0,
        rate: 0.95,
        volume: 1,
    },
};

// Pick the best available voice for a profile
const pickVoice = (voices, profile) => {
    for (const name of profile.preferredNames) {
        const match = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
        if (match) return match;
    }
    // Fallback: first English voice available
    return voices.find(v => v.lang.startsWith("en")) ?? voices[0] ?? null;
};

export const useTTS = (muted) => {
    const synthRef = useRef(window.speechSynthesis);
    const voicesRef = useRef([]);
    const utteranceRef = useRef(null);

    // Load voices (async on some browsers)
    useEffect(() => {
        const load = () => {
            voicesRef.current = synthRef.current.getVoices();
        };
        load();
        synthRef.current.addEventListener("voiceschanged", load);
        return () => synthRef.current.removeEventListener("voiceschanged", load);
    }, []);

    // Cancel any ongoing speech
    const cancel = useCallback(() => {
        synthRef.current.cancel();
        utteranceRef.current = null;
    }, []);

    // Speak a line
    const speak = useCallback((text, speaker = "narration") => {
        cancel();
        if (muted || !text) return;

        const profile = VOICE_PROFILES[speaker] ?? VOICE_PROFILES.narration;
        const voice = pickVoice(voicesRef.current, profile);

        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
        utterance.pitch = profile.pitch;
        utterance.rate = profile.rate;
        utterance.volume = profile.volume;

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
    }, [muted, cancel]);

    // Stop speech when component unmounts
    useEffect(() => () => cancel(), [cancel]);

    return { speak, cancel };
};
