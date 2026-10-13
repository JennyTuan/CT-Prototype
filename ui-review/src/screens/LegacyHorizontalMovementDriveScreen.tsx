import { useState } from "react";
import { CameraOff } from "lucide-react";
import { MovementArtwork, MovementRemote, MovementShell } from "./legacyMovementShared";
import type { MovementPageProps } from "./legacyMovementShared";
import { useMovementText } from "../lib/movementPrototype";
import type { MovementDirection } from "../lib/movementPrototype";

export default function LegacyHorizontalMovementDriveScreen(props: MovementPageProps) {
    const [camera, setCamera] = useState(true);
    const [draftSpeed, setDraftSpeed] = useState(0.1);
    const [speed, setSpeed] = useState(0.1);
    const [direction, setDirection] = useState<MovementDirection | null>(null);
    const t = useMovementText();
    return <MovementShell {...props} step={5} instruction={t("移动", "Movement")}>
        <div className="absolute left-[12px] top-[75px] flex h-[23px] items-center gap-[7px] text-[8px]">
            <label htmlFor="movement-speed">{t("设置机器速度(m/s):", "Set speed (m/s):")}</label>
            <input id="movement-speed" aria-label={t("设置机器速度（米每秒）", "Set speed in meters per second")} type="range" min="0.1" max="0.5" step="0.1" value={draftSpeed} onChange={(event) => setDraftSpeed(Number(event.target.value))} className="h-[12px] w-[115px] accent-[#79B7F2]" />
            <button type="button" onClick={() => setSpeed(draftSpeed)} className="ml-[5px] h-[23px] w-[40px] rounded-[2px] border-0 bg-white p-0 text-[#778398]">{t("确定", "Apply")}</button>
            <span className="ml-[17px]">{t("机器当前速度(cm/s):", "Current speed (cm/s):")}</span>
            <output aria-label={t("机器当前速度（厘米每秒）", "Current speed in centimeters per second")} className="flex h-[23px] w-[57px] items-center rounded-[2px] bg-[#F4F6FA] px-2 text-[#7A899E]">{direction ? Math.round(speed * 100) : 0}</output>
        </div>
        {camera ? <><MovementArtwork source="drive" x={65} y={103} width={350} height={261} label={t("原稿提供的摄像头场景静态参考图", "Static camera reference image")} /><span className="absolute left-[72px] top-[109px] rounded bg-black/40 px-1.5 py-0.5 text-[8px] text-white">{t("模拟画面", "Simulation")}</span></> : <div className="absolute left-[65px] top-[103px] flex h-[261px] w-[350px] flex-col items-center justify-center gap-3 bg-[#707B8D] text-[12px] text-white"><CameraOff size={32} />{t("摄像头已关闭（模拟）", "Camera off (simulation)")}</div>}
        <div className="absolute left-[172px] top-[371px] flex gap-[6px]">
            <button type="button" aria-pressed={camera} onClick={() => setCamera(true)} className="h-[23px] w-[65px] rounded-[2px] border-0 p-0 text-[8px]" style={{ background: camera ? "#B8DB90" : "white", color: camera ? "#429ACE" : "#788499" }}>{t("启动摄像头", "Start camera")}</button>
            <button type="button" aria-pressed={!camera} onClick={() => setCamera(false)} className="h-[23px] w-[65px] rounded-[2px] border-0 p-0 text-[8px]" style={{ background: !camera ? "#B8DB90" : "white", color: "#788499" }}>{t("关闭摄像头", "Stop camera")}</button>
        </div>
        <div className="absolute left-[70px] top-[408px] text-[9px] text-[#6D7E95]" aria-live="polite">{t("速度设定", "Set speed")} {speed.toFixed(1)} m/s{draftSpeed !== speed ? t(" · 修改后请点确定", " · Press Apply to confirm") : t(" · 按住方向键模拟移动", " · Hold an arrow to simulate movement")}</div>
        <MovementRemote mode="drive" activeDirection={direction} onDirectionChange={setDirection} />
    </MovementShell>;
}
