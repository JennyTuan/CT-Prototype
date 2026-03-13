import { useEffect, useRef, useState } from "react";
import {
    ArrowRightLeft,
    Download,
    ScanLine,
    Telescope,
    View,
} from "lucide-react";

const imgSystem = "https://www.figma.com/api/mcp/asset/0f00e16f-223e-459a-a4a1-fba281a95725";
const imgMachine = "https://www.figma.com/api/mcp/asset/a434ca2c-b5c7-4847-985a-8429917eb0e9";
const imgLaser = "https://www.figma.com/api/mcp/asset/aff6e8ff-2b61-43bf-914d-9d401cfccea1";
const imgEmergency = "https://www.figma.com/api/mcp/asset/bfc511ee-8358-46e6-9d1c-3959ad3f6809";
const imgPatient = "https://www.figma.com/api/mcp/asset/03451ece-f71a-4cbf-9dfe-fa05e0bcc6a9";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

const scoutParams = [
    { label: "扫描方向", value: "前后位" },
    { label: "定位长度", value: "420 mm" },
    { label: "视野 FOV", value: "500 mm" },
    { label: "层厚", value: "1.0 mm" },
] as const;

const confirmItems = [
    "确认患者姿态与垂直摆位一致",
    "确认激光线与胸腹中心对位",
    "确认定位范围覆盖目标区域",
] as const;

function ToolbarIcon({ src, alt, left }: { src: string; alt: string; left: number }) {
    return (
        <img
            src={src}
            alt={alt}
            draggable={false}
            className="absolute top-[20px] h-[32px] w-[32px] object-contain select-none"
            style={{ left }}
        />
    );
}

function ParameterRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-[8px] border border-[#C1C7D4] bg-[rgba(244,247,252,0.8)] px-[12px] py-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
            <span className="text-[12px] font-semibold text-[#627086]">{label}</span>
            <span className="text-[13px] font-bold text-[#253248]">{value}</span>
        </div>
    );
}

function ConfirmItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-[10px] rounded-[8px] border border-[#C7CFDC] bg-[rgba(246,248,252,0.88)] px-[12px] py-[10px]">
            <div className="mt-[2px] h-[8px] w-[8px] rounded-full bg-[#6E95DC]" />
            <span className="text-[12px] font-medium leading-[1.45] text-[#4F5D73]">{text}</span>
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
                    video: {
                        width: { ideal: 960 },
                        height: { ideal: 720 },
                    },
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
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="relative h-[470px] w-full max-w-[700px] overflow-hidden rounded-[10px] border border-[#aab1c1] bg-[#8d95a8] shadow-[0_2px_8px_rgba(96,104,122,0.18)]">
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
                <span className="text-[12px] font-medium tracking-[0.04em]">定位像实时画面</span>
                <span className="rounded-full bg-[rgba(77,211,123,0.92)] px-2 py-[2px] text-[10px] font-bold text-[#0c2a14]">LIVE</span>
            </div>
        </div>
    );
}

export default function LegacyVerticalCTScoutConfirmScreen() {
    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-[#DCE0ED] text-[#535353]" style={{ fontFamily: pingFang }}>
            <div className="absolute left-0 top-0 h-[80px] w-full bg-[#C1C5D5] opacity-50" />
            <div className="absolute left-0 top-0 z-10 h-[80px] w-full">
                <div className="absolute left-[20px] top-[12px] h-[50px] w-[100px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6]">
                    <img
                        src={imgPatient}
                        alt="patient"
                        draggable={false}
                        className="absolute left-[4px] top-[8px] h-[29.818px] w-[31.552px] object-contain select-none"
                    />
                    <div className="absolute left-[38px] top-[4px] w-[56px] whitespace-nowrap text-center text-[14px] font-medium leading-[1.15] text-[#717579]">
                        <div>欧阳祖华</div>
                        <div>000001</div>
                    </div>
                </div>
                <div className="absolute left-1/2 top-[12px] -translate-x-1/2 text-center text-[#717579]">
                    <div className="text-[32px] font-black leading-none">13:06</div>
                    <div className="mt-[9px] text-[15px] font-black leading-none">3月9日 周日</div>
                </div>
                <ToolbarIcon src={imgEmergency} alt="急停" left={760} />
                <ToolbarIcon src={imgLaser} alt="激光" left={824} />
                <ToolbarIcon src={imgMachine} alt="设备状态" left={888} />
                <ToolbarIcon src={imgSystem} alt="系统管理" left={952} />
            </div>

            <div className="absolute left-[20px] right-[20px] top-[92px] h-[588px]">
                <div className="flex h-full">
                    <section className="w-[312px] pt-[10px]">
                        <div className="flex h-[580px] flex-col rounded-[12px] border border-[#b6bbc8] bg-[linear-gradient(180deg,#d8dbe4_0%,#d3d6df_100%)] px-[14px] py-[16px] shadow-[0_2px_8px_rgba(112,117,131,0.22)]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[17px] font-semibold text-[#23262b]">定位像参数确认</h2>
                                <span className="rounded-full bg-[#D8E6FF] px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-[#2D64C7]">
                                    SCOUT
                                </span>
                            </div>

                            <div className="mt-[14px]">
                                <div className="mb-[8px] text-[13px] font-semibold text-[#59657B]">扫描参数</div>
                                <div className="flex flex-col gap-[10px]">
                                    {scoutParams.map((item) => (
                                        <ParameterRow key={item.label} label={item.label} value={item.value} />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-[18px] rounded-[10px] border border-dashed border-[#AEB7C7] bg-[linear-gradient(180deg,#E5E9F2_0%,#D7DCE7_100%)] px-[14px] py-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]">
                                <div className="flex items-center gap-[8px]">
                                    <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.64)] text-[#5D77A8]">
                                        <ScanLine size={16} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-semibold text-[#31425F]">定位范围预览</div>
                                        <div className="mt-[2px] text-[11px] text-[#73819A]">当前定位线覆盖肩部至膈顶区域</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[20px] border-t border-[#bcc1cd] pt-[18px]">
                                <h2 className="text-[17px] font-semibold text-[#23262b]">确认要点</h2>
                                <div className="mt-[14px] flex flex-col gap-[10px]">
                                    {confirmItems.map((item) => (
                                        <ConfirmItem key={item} text={item} />
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
        </div>
    );
}
