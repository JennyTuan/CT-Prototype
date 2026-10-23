import { MovementArtwork, MovementShell } from "./legacyMovementShared";
import type { MovementPageProps } from "./legacyMovementShared";
import { useMovementText } from "../lib/movementPrototype";

export default function LegacyHorizontalMovementCableScreen(props: MovementPageProps) {
    const t = useMovementText();
    return <MovementShell {...props} step={3} instruction={t("确认收线、绕线。", "Confirm that the power cable is wound and stowed.")}>
        {props.verticalMovement ? <img
            src="/movement/vertical-cable-reference.jpg"
            alt={t("垂直模式电源线收纳位置与绕线方式的局部放大图", "Vertical mode power cable storage and winding detail")}
            draggable={false}
            className="pointer-events-none absolute left-[35px] top-[90px] h-[295px] w-[530px] object-contain mix-blend-multiply"
        /> : <MovementArtwork source="cable" x={65} y={100} width={501} height={286} label={t("电源线收纳位置与绕线方式的局部放大图", "Power cable storage and winding detail")} />}
    </MovementShell>;
}
