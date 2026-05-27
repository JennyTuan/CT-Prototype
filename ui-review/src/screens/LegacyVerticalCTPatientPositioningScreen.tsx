import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRightLeft,
    ChevronRight,
    Download,
    Telescope,
    View,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

type PostureId = "supine" | "prone" | "left" | "right";
type DirectionId = "head-first" | "feet-first";

const postureOptions: ReadonlyArray<{ id: PostureId; label: string }> = [
    { id: "supine", label: "仰卧" },
    { id: "prone", label: "俯卧" },
    { id: "left", label: "左侧卧" },
    { id: "right", label: "右侧卧" },
];

const directionOptions: ReadonlyArray<{ id: DirectionId; label: string }> = [
    { id: "head-first", label: "头先进" },
    { id: "feet-first", label: "脚先进" },
];

const postureImageMap: Record<PostureId, string> = {
    supine: "/仰卧.png",
    prone: "/俯卧.png",
    left: "/左侧卧.png",
    right: "/右侧卧.png",
};

function SelectionButton({
    label,
    active = false,
    wide = false,
    onClick,
}: {
    label: string;
    active?: boolean;
    wide?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-[38px] items-center justify-center rounded-[3px] text-[14px] font-semibold tracking-[0.02em] transition-colors ${wide ? "w-full" : "w-[110px]"}`}
            style={{
                color: "#F4F7FF",
                backgroundColor: active ? "#7EA4EE" : "#717A8D",
                boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.2)" : "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
        >
            {label}
        </button>
    );
}

function PatientPoseIllustration({ posture }: { posture: PostureId }) {
    return (
        <img
            src={postureImageMap[posture]}
            alt={`体位示意图：${postureOptions.find((o) => o.id === posture)?.label ?? ""}`}
            className="block h-[92px] w-[240px] object-contain"
        />
    );
}

function CameraPreviewPanel() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        let active = true;
        let stream: MediaStream | null = null;

        async function startCamera() {
            if (!navigator.mediaDevices?.getUserMedia) {
                if (active) setStatus("error");
                return;
            }

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 960 }, height: { ideal: 720 } },
                    audio: false,
                });

                if (!active) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play().catch(() => undefined);
                }

                setStatus("ready");
            } catch {
                if (active) setStatus("error");
            }
        }

        startCamera();

        return () => {
            active = false;
            if (stream) stream.getTracks().forEach((track) => track.stop());
        };
    }, []);

    return (
        <div className="relative h-[470px] w-full max-w-[700px] overflow-hidden rounded-[8px] border border-[#aab1c1] bg-[#8d95a8] shadow-[0_2px_8px_rgba(96,104,122,0.18)]">
            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            {status !== "ready" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(88,96,114,0.82)_0%,rgba(64,71,87,0.92)_100%)] text-[#eef2fb]">
                    <div className="text-[15px] font-semibold">{status === "loading" ? "正在连接摄像头..." : "无法显示实时画面"}</div>
                    <div className="mt-2 text-[12px] text-[#d5dbea]">
                        {status === "loading" ? "请稍候" : "请检查摄像头权限或设备连接"}
                    </div>
                </div>
            ) : null}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-[linear-gradient(180deg,rgba(17,22,31,0.68)_0%,rgba(17,22,31,0)_100%)] px-3 py-2 text-white">
                <span className="text-[12px] font-medium tracking-[0.04em]">实时画面</span>
                <span className="rounded-full bg-[rgba(77,211,123,0.92)] px-2 py-[2px] text-[10px] font-bold text-[#0c2a14]">LIVE</span>
            </div>
        </div>
    );
}

export default function LegacyVerticalCTPatientPositioningScreen() {
    const [posture, setPosture] = useState<PostureId>("supine");
    const [direction, setDirection] = useState<DirectionId>("head-first");

    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-[#DCE0ED] text-[#535353]" style={{ fontFamily: pingFang }}>
            <div className="absolute left-0 top-0 h-[80px] w-full bg-[#C1C5D5] opacity-50" />
            <div className="absolute left-0 top-0 z-10 h-[80px] w-full">
                <div className="absolute left-[20px] top-[12px] h-[50px] w-[100px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6]">
                    <LegacyPatientAvatar alt="患者" />
                    <div className="absolute left-[38px] top-[4px] w-[56px] whitespace-nowrap text-center text-[14px] font-medium leading-[1.15] text-[#717579]">
                        <div>欧阳祖华</div>
                        <div>000001</div>
                    </div>
                </div>
                <div className="absolute left-1/2 top-[12px] -translate-x-1/2 text-center text-[#717579]">
                    <div className="text-[32px] font-black leading-none">13:06</div>
                    <div className="mt-[9px] text-[15px] font-black leading-none">3月9日 周日</div>
                </div>
                <LegacyToolbarIcon kind="emergency" alt="急停" left={756} />
                <LegacyToolbarIcon kind="laser" alt="激光" left={820} />
                <LegacyToolbarIcon kind="machine" alt="机器状态" left={884} />
                <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
            </div>

            <div className="absolute left-[20px] right-[20px] top-[92px] h-[588px]">
                <div className="flex h-full">
                    <section className="w-[312px] pt-[10px]">
                        <div className="flex h-[580px] flex-col rounded-[10px] border border-[#b6bbc8] bg-[linear-gradient(180deg,#d8dbe4_0%,#d3d6df_100%)] px-[14px] py-[16px] shadow-[0_2px_8px_rgba(112,117,131,0.22)]">
                            <h2 className="text-[17px] font-semibold text-[#23262b]">请选择患者的体位</h2>
                            <div className="mt-[14px] grid grid-cols-2 gap-x-[18px] gap-y-[12px]">
                                {postureOptions.map((option) => (
                                    <SelectionButton
                                        key={option.id}
                                        label={option.label}
                                        active={posture === option.id}
                                        onClick={() => setPosture(option.id)}
                                    />
                                ))}
                            </div>

                            <div className="mt-[18px] flex justify-center">
                                <PatientPoseIllustration posture={posture} />
                            </div>

                            <div className="mt-[20px] border-t border-[#bcc1cd] pt-[18px]">
                                <h2 className="text-[17px] font-semibold text-[#23262b]">请选择患者的方向</h2>
                                <div className="mt-[16px] flex flex-col gap-[12px]">
                                    {directionOptions.map((option) => (
                                        <SelectionButton
                                            key={option.id}
                                            label={option.label}
                                            active={direction === option.id}
                                            onClick={() => setDirection(option.id)}
                                            wide
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="ml-[14px] h-full w-px bg-[#b7bcc9]" />

                    <section className="flex flex-1 flex-col pl-[24px] pt-[18px]">
                        <div className="pl-[8px]">
                            <div className="mb-[10px] text-[16px] font-semibold text-[#23262b]">患者摄像头画面</div>
                            <CameraPreviewPanel />
                        </div>

                        <div className="mt-auto flex items-center justify-between px-[8px] pb-[12px]">
                            <button
                                type="button"
                                className="flex h-[36px] w-[76px] items-center justify-center gap-2 rounded-[3px] border border-[#dd8f92] bg-[#e89a99] text-[13px] font-semibold text-[#fff5f4]"
                            >
                                <ArrowLeft size={14} strokeWidth={2.2} />
                                <span>返回</span>
                            </button>

                            <button
                                type="button"
                                className="flex h-[36px] w-[76px] items-center justify-center gap-2 rounded-[3px] border border-[#8ebf73] bg-[#8cc06d] text-[13px] font-semibold text-[#f8fff3]"
                            >
                                <span>继续</span>
                                <ChevronRight size={15} strokeWidth={2.5} />
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-[#88A3D2] px-[18px] pt-[8px]">
                <div className="grid h-[64px] w-full grid-cols-4 gap-[2px]">
                    <button
                        type="button"
                        className="flex h-full items-center justify-center gap-4 rounded-[12px] border border-[#5F86CC] bg-[linear-gradient(180deg,#164CA7_0%,#2A63BE_100%)] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                    >
                        <ArrowRightLeft size={34} strokeWidth={2.1} />
                        <span className="text-[20px] font-semibold tracking-[0.06em]">位置信息</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-full items-center justify-center gap-3 rounded-[10px] bg-[#DCE8FF] text-[#265FBC]"
                    >
                        <Telescope size={32} strokeWidth={1.9} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">扫描成像</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <View size={30} strokeWidth={1.9} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">成像视图</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <Download size={30} strokeWidth={1.9} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">传输</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
