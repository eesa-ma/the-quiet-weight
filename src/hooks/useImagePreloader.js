import { useState, useEffect } from "react";

export const useImagePreloader = (imageUrls) => {
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        setImagesPreloaded(false);

        const preloadImages = async () => {
            const promises = imageUrls.map((url) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = resolve;
                    img.onerror = resolve; // Resolve on error so we don't block the UI forever
                });
            });

            await Promise.all(promises);

            if (!isCancelled) {
                setImagesPreloaded(true);
            }
        };

        if (imageUrls && imageUrls.length > 0) {
            preloadImages();
        } else {
            setImagesPreloaded(true);
        }

        return () => {
            isCancelled = true;
        };
    }, [JSON.stringify(imageUrls)]); // use JSON stringify to deep compare the array

    return { imagesPreloaded };
};
