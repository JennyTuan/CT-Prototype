import {
    ArrowLeft,
    ArrowRightLeft,
    Download,
    LocateFixed,
    Telescope,
    View,
} from "lucide-react";

const imgSystem = "https://www.figma.com/api/mcp/asset/0f00e16f-223e-459a-a4a1-fba281a95725";
const imgMachine = "https://www.figma.com/api/mcp/asset/a434ca2c-b5c7-4847-985a-8429917eb0e9";
const imgLaser = "https://www.figma.com/api/mcp/asset/aff6e8ff-2b61-43bf-914d-9d401cfccea1";
const imgEmergency = "https://www.figma.com/api/mcp/asset/bfc511ee-8358-46e6-9d1c-3959ad3f6809";
const imgPatient = "https://www.figma.com/api/mcp/asset/03451ece-f71a-4cbf-9dfe-fa05e0bcc6a9";
const imgVertical = "https://www.figma.com/api/mcp/asset/f7d2c225-ca8f-4d34-b88b-c399b50b89ec";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

const seatOptions: Array<{ code: string; label: string; desc: string; active?: boolean }> = [
    { code: "S1", label: "标准坐姿", desc: "背部贴靠，双手自然扶把", active: true },
    { code: "S2", label: "后仰坐姿", desc: "胸部轻微后仰，便于胸肺扫描" },
    { code: "S3", label: "侧向坐姿", desc: "用于特殊角度摆位或介入观察" },
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

function SeatOption({
    code,
    label,
    desc,
    active = false,
}: {
    code: string;
    label: string;
    desc: string;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            className="flex items-start rounded-[12px] border px-4 py-3 text-left transition-all"
            style={{
                borderColor: active ? "#2A6DE5" : "#C8D6F0",
                background: active ? "linear-gradient(180deg,#EDF4FF 0%,#FFFFFF 100%)" : "rgba(255,255,255,0.78)",
                boxShadow: active ? "0 10px 18px rgba(42,109,229,0.14)" : "none",
            }}
        >
            <div
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] text-[13px] font-black"
                style={{
                    backgroundColor: active ? "#2A6DE5" : "#E6EDF9",
                    color: active ? "#FFFFFF" : "#5A6781",
                }}
            >
                {code}
            </div>
            <div className="ml-3 min-w-0">
                <div className="text-[13px] font-bold text-[#334155]">{label}</div>
                <div className="mt-1 text-[11px] font-semibold leading-[1.35] text-[#7C879D]">{desc}</div>
            </div>
        </button>
    );
}

function PositioningPreviewPlaceholder() {
    return (
        <div className="relative flex h-[420px] w-[520px] items-center justify-center rounded-[20px] border-2 border-dashed border-[#B9CBEA] bg-[linear-gradient(180deg,#F8FBFF_0%,#EEF4FF_100%)]">
            <div className="flex flex-col items-center text-center text-[#6A7A96]">
                <div className="h-14 w-14 rounded-[16px] border border-[#C7D7F2] bg-white/85" />
                <div className="mt-3 text-[16px] font-bold text-[#5B6C8A]">示意图占位区域</div>
                <div className="mt-1 text-[12px] font-semibold">后续由 UI 补充正式插画</div>
            </div>
        </div>
    );
}

export default function LegacyVerticalCTPatientPositioningScreen() {
    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-[#DCE0ED] text-[#535353]" style={{ fontFamily: pingFang }}>
            <div className="absolute left-0 top-0 h-[80px] w-full bg-[#C1C5D5] opacity-50" />
            <div className="absolute left-0 top-0 z-10 h-[80px] w-full">
                <div className="absolute left-[20px] top-[12px] h-[50px] w-[100px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6]">
                    <img
                        src={imgPatient}
                        alt="患者"
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
                <ToolbarIcon src={imgMachine} alt="机器状态" left={888} />
                <ToolbarIcon src={imgSystem} alt="系统管理" left={952} />
            </div>

            <div className="absolute left-[20px] right-[20px] top-[92px] flex h-[588px] gap-4">
                <div className="flex w-[300px] flex-col rounded-[16px] border border-[#B8C8E9] bg-[linear-gradient(180deg,#F6F9FF_0%,#EDF2FC_100%)] p-5 shadow-[0_15px_40px_rgba(88,117,170,0.12)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#2A6DE5] text-white shadow-lg">
                            <ArrowRightLeft size={22} />
                        </div>
                        <div>
                            <div className="text-[28px] font-bold leading-none text-[#2A6DE5]">患者摆位</div>

                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="mb-2 text-[12px] font-black text-[#5A6781]">坐姿模板</div>
                        <div className="grid grid-cols-1 gap-2.5">
                            {seatOptions.map((item) => (
                                <SeatOption
                                    key={item.code}
                                    code={item.code}
                                    label={item.label}
                                    desc={item.desc}
                                    active={item.active}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 rounded-[14px] border border-[#F3C5B3] bg-[rgba(255,243,238,0.86)] p-4">
                        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D66B43]">摆位提示</div>
                        <div className="mt-2 text-[13px] font-semibold leading-[1.45] text-[#6C7286]">
                            引导患者坐稳并保持头颈正中。通过吊挂扫描环的升降、旋转和前后平移，让环心对准胸部扫描中心线。
                        </div>
                    </div>

                </div>

                <div className="flex flex-1 flex-col rounded-[16px] border border-[#B8C8E9] bg-[linear-gradient(180deg,#F7FAFF_0%,#EEF3FC_100%)] px-5 py-4 shadow-[0_15px_40px_rgba(88,117,170,0.12)]">
                    <div className="flex items-center justify-between px-2 py-2">
                        <div>
                            <div className="text-[18px] font-bold text-[#355A9C]">Position Preview</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/35">
                                <img src={imgVertical} alt="垂直模式" draggable={false} className="h-[32px] w-[32px] object-contain" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-1 flex-col">
                        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#F3F7FF_0%,#E8F0FD_100%)]">
                            <div className="pointer-events-none absolute inset-0 rounded-[18px] border border-[#CBD8EE]" />
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(237,244,255,0)_24%,rgba(155,177,220,0.06)_100%)]" />

                            <PositioningPreviewPlaceholder />

                            <div className="hidden absolute bottom-5 right-6 items-center gap-3">
                                <button
                                    type="button"
                                    className="flex h-[42px] items-center gap-2 rounded-[12px] border border-[#7CA1E3] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(233,241,255,0.98)_100%)] px-4 text-[15px] font-semibold text-[#2A63BE] shadow-[0_10px_24px_rgba(114,145,201,0.18)]"
                                >
                                    <ArrowLeft size={16} strokeWidth={2.2} />
                                    <span>返回</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex h-[42px] items-center gap-2 rounded-[12px] border border-[#2459B2] bg-[linear-gradient(180deg,#2A6DE5_0%,#1E56B9_100%)] px-5 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(42,109,229,0.28)]"
                                >
                                    <LocateFixed size={16} strokeWidth={2.2} />
                                    <span>开始定位</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-2 pb-1 pt-4">
                            <button
                                type="button"
                                className="flex h-[42px] items-center gap-2 rounded-[12px] border border-[#7CA1E3] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(233,241,255,0.98)_100%)] px-4 text-[15px] font-semibold text-[#2A63BE] shadow-[0_10px_24px_rgba(114,145,201,0.18)]"
                            >
                                <ArrowLeft size={16} strokeWidth={2.2} />
                                <span>返回</span>
                            </button>
                            <button
                                type="button"
                                className="flex h-[42px] items-center gap-2 rounded-[12px] border border-[#2459B2] bg-[linear-gradient(180deg,#2A6DE5_0%,#1E56B9_100%)] px-5 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(42,109,229,0.28)]"
                            >
                                <LocateFixed size={16} strokeWidth={2.2} />
                                <span>开始定位</span>
                            </button>
                        </div>
                    </div>
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
