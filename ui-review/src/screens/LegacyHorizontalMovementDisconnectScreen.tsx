import { MovementArtwork, MovementShell } from "./legacyMovementShared";
import type { MovementPageProps } from "./legacyMovementShared";
import { useMovementText } from "../lib/movementPrototype";

export default function LegacyHorizontalMovementDisconnectScreen(props: MovementPageProps) {
    const t = useMovementText();
    return <MovementShell {...props} step={1} instruction={t("请断开CT电源，以便进行移动。", "Disconnect the CT power supply before moving.")}>
        <MovementArtwork source="disconnect" x={120} y={105} width={470} height={294} label={t("扫描环正面及拔出电源插头的引导图", "Scan ring and power disconnection illustration")} />
    </MovementShell>;
}
