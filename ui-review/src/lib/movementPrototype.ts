import { createContext, useContext, useEffect, useState } from "react";

export type MovementLanguage = "zh" | "en";
export type MovementDirection = "up" | "down" | "left" | "right";
export const MovementLanguageContext = createContext<MovementLanguage>("zh");

export function useMovementText() {
    const language = useContext(MovementLanguageContext);
    return (zh: string, en: string) => language === "en" ? en : zh;
}

export function useMovementProgress(initialProgress = 0) {
    const [progress, setProgress] = useState(initialProgress);
    const [direction, setDirection] = useState<MovementDirection | null>(null);
    useEffect(() => {
        if (!direction || progress >= 100) return;
        const interval = window.setInterval(() => setProgress((value) => Math.min(100, value + 2)), 80);
        return () => window.clearInterval(interval);
    }, [direction, progress]);
    return { progress, direction: progress === 100 ? null : direction, setDirection };
}
