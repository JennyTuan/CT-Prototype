import { MovementArtwork, MovementShell } from "./legacyMovementShared";
import type { MovementPageProps } from "./legacyMovementShared";
import { useMovementText } from "../lib/movementPrototype";

export default function LegacyHorizontalMovementRotateScreen(props: MovementPageProps) {
    const t = useMovementText();
    if (props.verticalMovement) {
        return <MovementShell {...props} step={2} showStepIndicator={false} instruction={t("请旋转扫描环，使其与底部轨道垂直。", "Rotate the scan ring so it is perpendicular to the base rail.")}>
            <img src="/movement/rotate-to-perpendicular-ui-design.png" alt={t("扫描环绕同一中心由平行旋转至垂直，底部轨道保持不动的示意图", "The scan ring rotates about one pivot from parallel to perpendicular while the base rail stays fixed")} className="absolute left-[55px] top-[85px] h-[300px] w-[490px] object-contain" />
        </MovementShell>;
    }
    return <MovementShell {...props} step={2} instruction={t("旋转扫描环与底座平行。", "Rotate the scan ring parallel to the base rail.")}>
        <MovementArtwork source="rotate" x={80} y={110} width={435} height={279} label={t("扫描环旋转至与底座平行的引导图", "Rotate the scan ring parallel to the base rail")} />
    </MovementShell>;
}
