import { MovementArtwork, MovementProgress, MovementRemote, MovementShell } from "./legacyMovementShared";
import type { MovementPageProps } from "./legacyMovementShared";
import { useMovementProgress, useMovementText } from "../lib/movementPrototype";

export default function LegacyHorizontalMovementLowerScreen(props: MovementPageProps) {
    const { progress, direction, setDirection } = useMovementProgress(props.initialProgress);
    const t = useMovementText();
    return <MovementShell {...props} step={6} instruction={progress === 100 ? t("机架落地模拟完成，行走轮已收起（模拟）。", "Lowering simulation complete. Travel wheels retracted.") : t("请按住高亮的按钮，使机架落地。", "Press and hold the highlighted button to lower the gantry.")} nextDisabled={progress < 100}>
        <MovementArtwork source="lower" x={79} y={117} width={324} height={284} label={t("液压下降及行走轮收起的引导图", "Gantry lowering and travel wheel retraction illustration")} />
        <MovementProgress value={progress} down />
        <MovementRemote mode="lower" activeDirection={direction} onDirectionChange={setDirection} complete={progress === 100} />
    </MovementShell>;
}
