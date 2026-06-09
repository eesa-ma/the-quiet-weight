import { useState, useEffect } from "react";

/**
 * Reactively tracks device orientation.
 * Returns { isPortrait, isLandscape }.
 */
export function useOrientation() {
    const getIsPortrait = () => window.innerHeight > window.innerWidth;

    const [isPortrait, setIsPortrait] = useState(getIsPortrait);

    useEffect(() => {
        // Prefer matchMedia for orientation changes (works well on mobile)
        const mql = window.matchMedia("(orientation: portrait)");

        const handleChange = (e) => setIsPortrait(e.matches);

        // Also listen to resize as a fallback for desktop / devtools
        const handleResize = () => setIsPortrait(getIsPortrait());

        mql.addEventListener("change", handleChange);
        window.addEventListener("resize", handleResize);

        // Sync on mount
        setIsPortrait(getIsPortrait());

        return () => {
            mql.removeEventListener("change", handleChange);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return { isPortrait, isLandscape: !isPortrait };
}
