import { MovementArtwork, MovementProgress, MovementRemote, MovementShell } from "./legacyMovementShared";
import type { MovementPageProps } from "./legacyMovementShared";
import { useMovementProgress, useMovementText } from "../lib/movementPrototype";

export default function LegacyHorizontalMovementRaiseScreen(props: MovementPageProps) {
    const { progress, direction, setDirection } = useMovementProgress();
    const t = useMovementText();
    return <MovementShell {...props} step={4} instruction={progress === 100 ? t("机架抬起模拟完成，请进入下一步。", "Raising simulation complete. Continue to the next step.") : t("请按住高亮的按钮，使机架抬起。", "Press and hold the highlighted button to raise the gantry.")} nextDisabled={progress < 100}>
        <MovementArtwork source="raise" x={82} y={85} width={315} height={285} label={t("扫描环向上抬起及行走轮操作示意", "Gantry raising and travel wheel illustration")} />
        <MovementProgress value={progress} />
        <MovementRemote mode="raise" activeDirection={direction} onDirectionChange={setDirection} complete={progress === 100} />
    </MovementShell>;
}
