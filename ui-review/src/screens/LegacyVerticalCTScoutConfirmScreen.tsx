import { useEffect, useRef, useState } from "react";
import {
    ArrowRightLeft,
    ArrowUpDown,
    AlertTriangle,
    Download,
    ScanLine,
    Telescope,
    View,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";
import LegacyVerticalCTModeSwitchContent from "./LegacyVerticalCTModeSwitchContent";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

const scoutParams = [
    { label: "扫描长度", value: "122.00" },
    { label: "扫描协议", value: "Head_Surview90" },
    { label: "体位", value: "HFS" },
    { label: "mA", value: "10" },
    { label: "kV", value: "80" },
    { label: "平扫角度", value: "90" },
] as const;

function ParamField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-[8px]">
            <span className="w-[70px] text-[12px] font-semibold text-[#6c7f97]">{label}:</span>
            <div className="h-[30px] flex-1 rounded-[6px] border border-[#ccd8e8] bg-[#eef2f7] px-[10px] text-[13px] leading-[30px] text-[#7f90a7] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                {value}
            </div>
        </div>
    );
}

function ParamOptionField({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
}) {
    return (
        <div className={`flex items-center gap-[8px] ${label ? "" : "pl-[78px]"}`}>
            {label ? <span className="w-[70px] text-[12px] font-semibold text-[#6c7f97]">{label}:</span> : null}
            <div className="flex flex-1 rounded-[6px] border border-[#ccd8e8] bg-[#eef2f7] p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                {options.map((option) => {
                    const active = value === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`flex-1 rounded-[4px] px-[6px] py-[4px] text-[12px] font-semibold transition-all ${active ? "bg-white text-[#4d6f9f] shadow-[0_1px_2px_rgba(149,166,191,0.22)]" : "text-[#7f90a7]"}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
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
        <div className="relative h-[470px] w-full max-w-[700px] overflow-hidden rounded-[10px] border border-[#aab1c1] bg-[#8d95a8] shadow-[0_2px_8px_rgba(96,104,122,0.18)]">
            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            {status !== "ready" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(88,96,114,0.82)_0%,rgba(64,71,87,0.92)_100%)] text-[#eef2fb]">
                    <div className="text-[15px] font-semibold">
                        {status === "loading" ? "正在连接摄像头..." : "无法显示实时画面"}
                    </div>
                    <div className="mt-2 text-[12px] text-[#d5dbea]">
                        {status === "loading" ? "请稍候" : "请检查摄像头权限或设备连接"}
                    </div>
                </div>
            ) : null}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-[linear-gradient(180deg,rgba(17,22,31,0.68)_0%,rgba(17,22,31,0)_100%)] px-3 py-2 text-white">
                <span className="text-[12px] font-medium tracking-[0.04em]">定位像实时画面</span>
                <span className="rounded-full bg-[rgba(77,211,123,0.92)] px-2 py-[2px] text-[10px] font-bold text-[#0c2a14]">LIVE</span>
            </div>
        </div>
    );
}

export default function LegacyVerticalCTScoutConfirmScreen() {
    const [startPos, setStartPos] = useState("472.95");
    const [endPos, setEndPos] = useState("595.17");
    const [selectedPosition, setSelectedPositionState] = useState<"start" | "end">("start");
    const [tableDirection, setTableDirection] = useState<"进床" | "出床">("进床");
    const [tiltSynced, setTiltSynced] = useState(false);
    const [seatAtScanPosition, setSeatAtScanPosition] = useState(false);
    const [showSyncDialog, setShowSyncDialog] = useState(false);
    const [showEnablePanel, setShowEnablePanel] = useState(false);

    useEffect(() => {
        if (!tiltSynced) setShowSyncDialog(true);
    }, []);

    const selectPosition = (next: "start" | "end") => {
        if (!tiltSynced) {
            setShowSyncDialog(true);
            return;
        }
        setSelectedPositionState(next);
    };

    const handleStartSync = () => {
        setShowSyncDialog(false);
        setShowEnablePanel(true);
    };

    const handleEnableConfirm = () => {
        setShowEnablePanel(false);
        setTiltSynced(true);
        setSelectedPositionState("end");
    };

    const handleSwap = () => {
        setStartPos(endPos);
        setEndPos(startPos);
    };

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
                <LegacyToolbarIcon kind="machine" alt="设备状态" left={884} />
                <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
            </div>

            <div className="absolute left-[20px] right-[20px] top-[92px] h-[588px]">
                <div className="flex h-full">
                    <section className="w-[312px] pt-[10px]">
                        <div className="flex h-[580px] flex-col rounded-[14px] border border-[#bcc6d5] bg-[linear-gradient(180deg,#f1f4f9_0%,#e4e9f2_100%)] px-[16px] py-[18px] shadow-[0_6px_18px_rgba(112,117,131,0.14)]">
                            <div className="whitespace-nowrap text-[22px] font-medium leading-[1.1] text-[#4b6f9f]">请打开激光灯获取定位</div>

                            <div className="mt-[18px] rounded-[10px] border border-[#D7E1EE] bg-[rgba(255,255,255,0.45)] px-[12px] py-[10px]">
                                <div className="flex h-[118px] items-stretch gap-3">
                                    <div className="flex shrink-0 flex-col items-center self-stretch justify-center py-2">
                                        <button
                                            type="button"
                                            onClick={() => selectPosition("start")}
                                            className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 p-[2px] transition-all ${selectedPosition === "start" ? "border-white bg-[#4D94FF] shadow-sm" : "border-[#B0C4DE] bg-white"}`}
                                        >
                                            {selectedPosition === "start" && <div className="h-full w-full rounded-full bg-white" />}
                                        </button>
                                        <div className="my-1 flex-1 w-px bg-[#C5D5E8]" />
                                        <button
                                            type="button"
                                            onClick={handleSwap}
                                            title="交换起始/结束位置"
                                            className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-[#B0C4DE] bg-white text-[#78A0BF] shadow-sm transition-all hover:border-[#4D94FF] hover:bg-[#EEF6FF] hover:text-[#4D94FF] active:scale-90"
                                        >
                                            <ArrowUpDown size={10} />
                                        </button>
                                        <div className="my-1 flex-1 w-px bg-[#C5D5E8]" />
                                        <button
                                            type="button"
                                            onClick={() => selectPosition("end")}
                                            className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 p-[2px] transition-all ${selectedPosition === "end" ? "border-white bg-[#66BB6A] shadow-sm" : "border-[#B0C4DE] bg-white"}`}
                                        >
                                            {selectedPosition === "end" && <div className="h-full w-full rounded-full bg-white" />}
                                        </button>
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-4">
                                        <div onClick={() => selectPosition("start")} className="flex h-[32px] min-w-0 cursor-pointer items-center gap-2">
                                            <span className={`w-[60px] shrink-0 text-[12px] font-bold transition-colors ${selectedPosition === "start" ? "text-[#4D94FF]" : "text-[#90A4AE]"}`}>起始位置:</span>
                                            <input
                                                type="text"
                                                value={startPos}
                                                onChange={(e) => {
                                                    selectPosition("start");
                                                    setStartPos(e.target.value);
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    selectPosition("start");
                                                }}
                                                className={`h-[32px] min-w-0 flex-1 rounded border bg-white px-2 text-[13px] font-bold outline-none transition-colors ${selectedPosition === "start" ? "border-[#4D94FF] text-[#4D94FF]" : "border-[#B0C4DE] text-[#90A4AE]"} focus:border-[#4D94FF]`}
                                            />
                                        </div>
                                        <div onClick={() => selectPosition("end")} className="flex h-[32px] min-w-0 cursor-pointer items-center gap-2">
                                            <span className={`w-[60px] shrink-0 text-[12px] font-bold transition-colors ${selectedPosition === "end" ? "text-[#66BB6A]" : "text-[#90A4AE]"}`}>结束位置:</span>
                                            <input
                                                type="text"
                                                value={endPos}
                                                onChange={(e) => {
                                                    selectPosition("end");
                                                    setEndPos(e.target.value);
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    selectPosition("end");
                                                }}
                                                className={`h-[32px] min-w-0 flex-1 rounded border bg-white px-2 text-[13px] font-bold outline-none transition-colors ${selectedPosition === "end" ? "border-[#66BB6A] text-[#66BB6A]" : "border-[#B0C4DE] text-[#90A4AE]"} focus:border-[#4D94FF]`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[18px] border-t border-[#c7d0de] pt-[14px]">
                                <div className="mb-[10px] text-[13px] font-semibold text-[#526d8f]">扫描参数</div>
                                <div className="flex flex-col gap-[8px]">
                                    <ParamOptionField
                                        label=""
                                        value={tableDirection}
                                        options={["进床", "出床"] as const}
                                        onChange={(value) => setTableDirection(value as "进床" | "出床")}
                                    />
                                    {scoutParams.map((item) => (
                                        <ParamField key={item.label} label={item.label} value={item.value} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="ml-[14px] h-full w-px bg-[#b7bcc9]" />

                    <section className="flex flex-1 flex-col pl-[24px] pt-[18px]">
                        <div className="pl-[8px]">
                            <div className="mb-[10px] flex items-end justify-between">
                                <div className="text-[16px] font-semibold text-[#23262b]">定位像实时画面</div>
                                <div className="rounded-full bg-[#E5ECFA] px-3 py-[5px] text-[11px] font-bold tracking-[0.08em] text-[#4A659C]">
                                    垂直模式 / 定位像确认中
                                </div>
                            </div>
                            <CameraPreviewPanel />
                            <div className="mt-[14px] flex justify-end gap-[10px] pr-[2px]">
                                <button
                                    type="button"
                                    className="flex h-[38px] items-center justify-center rounded-[6px] border border-[#B8C6DA] bg-[#EEF2F7] px-[18px] text-[13px] font-semibold text-[#6B7C93]"
                                >
                                    <span>取消</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex h-[38px] items-center justify-center gap-2 rounded-[6px] border border-[#8EBF73] bg-[#8CC06D] px-[16px] text-[13px] font-semibold text-[#F8FFF3]"
                                >
                                    <ScanLine size={15} strokeWidth={2.1} />
                                    <span>定位扫描</span>
                                </button>
                            </div>
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

            {showSyncDialog && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(20,28,44,0.32)]">
                    <div className="w-[380px] overflow-hidden rounded-[14px] border border-[#c9d3e3] bg-white shadow-[0_18px_40px_rgba(40,52,80,0.28)]">
                        {seatAtScanPosition ? (
                            <>
                                <div className="flex items-start gap-3 px-[22px] pt-[20px] pb-[14px]">
                                    <div className="mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4E0] text-[#E0A23A]">
                                        <AlertTriangle size={18} strokeWidth={2.2} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[15px] font-semibold text-[#2c3a55]">扫描环倾角与座椅靠背未同步</div>
                                        <div className="mt-[6px] text-[12px] leading-[1.55] text-[#6b7a92]">
                                            扫描环从顶部下降前必须先与座椅靠背倾角对齐，否则下降过程可能与座椅发生碰撞。请点击"开始同步"完成倾角对齐后再进行起始 / 结束位置的上下定位。
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-[10px] border-t border-[#eef1f7] bg-[#f7f9fc] px-[20px] py-[12px]">
                                    <button
                                        type="button"
                                        onClick={() => setShowSyncDialog(false)}
                                        className="h-[32px] rounded-[6px] border border-[#c7d1e0] bg-white px-[14px] text-[12px] font-semibold text-[#5b6b85]"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStartSync}
                                        className="h-[32px] rounded-[6px] bg-[#3A6FD4] px-[14px] text-[12px] font-semibold text-white shadow-[0_2px_6px_rgba(58,111,212,0.32)]"
                                    >
                                        开始同步
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-start gap-3 px-[22px] pt-[20px] pb-[14px]">
                                    <div className="mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFE6E6] text-[#D9534F]">
                                        <AlertTriangle size={18} strokeWidth={2.2} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[15px] font-semibold text-[#2c3a55]">座椅尚未到达扫描位置</div>
                                        <div className="mt-[6px] text-[12px] leading-[1.55] text-[#6b7a92]">
                                            请使用<span className="font-semibold text-[#3A6FD4]">手持控制器</span>将座椅移动到扫描位置，到位后将自动进入倾角同步。
                                        </div>
                                        <div className="mt-[12px] flex items-center gap-2 rounded-[6px] border border-[#F3D6D6] bg-[#FFF6F6] px-[10px] py-[7px]">
                                            <span className="relative flex h-[8px] w-[8px]">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5746E] opacity-70" />
                                                <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-[#D9534F]" />
                                            </span>
                                            <span className="text-[11px] font-semibold text-[#9c3d3a]">座椅状态：未到位</span>
                                            <span className="ml-auto text-[11px] text-[#b48b89]">等待中…</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-[10px] border-t border-[#eef1f7] bg-[#f7f9fc] px-[20px] py-[10px]">
                                    <button
                                        type="button"
                                        onClick={() => setSeatAtScanPosition(true)}
                                        className="text-[11px] font-medium text-[#8a96ad] underline decoration-dotted underline-offset-2"
                                    >
                                        模拟座椅已到位
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showEnablePanel && (
                <div className="absolute right-0 top-[92px] z-30 h-[588px] w-[210px]">
                    <LegacyVerticalCTModeSwitchContent
                        phase="mode-enable"
                        targetMode="vertical"
                        onAdvance={handleEnableConfirm}
                        onCancel={() => setShowEnablePanel(false)}
                    />
                </div>
            )}
        </div>
    );
}
