import { AlertTriangle, ArrowRightLeft, CheckCircle2, CircleGauge, Download, MoveHorizontal, ScanLine, ShieldAlert, StretchVertical, Telescope, View } from "lucide-react";

const imgSystem = "https://www.figma.com/api/mcp/asset/0f00e16f-223e-459a-a4a1-fba281a95725";
const imgMachine = "https://www.figma.com/api/mcp/asset/a434ca2c-b5c7-4847-985a-8429917eb0e9";
const imgLaser = "https://www.figma.com/api/mcp/asset/aff6e8ff-2b61-43bf-914d-9d401cfccea1";
const imgEmergency = "https://www.figma.com/api/mcp/asset/bfc511ee-8358-46e6-9d1c-3959ad3f6809";
const imgPatient = "https://www.figma.com/api/mcp/asset/03451ece-f71a-4cbf-9dfe-fa05e0bcc6a9";
const imgHorizontalTop = "https://www.figma.com/api/mcp/asset/2b51e6ea-1ef4-4b74-be4e-edb6db29a755";
const imgHorizontalLeft = "https://www.figma.com/api/mcp/asset/f40f5a53-0237-411a-a83e-91f2413d02cc";
const imgHorizontalRight = "https://www.figma.com/api/mcp/asset/4b9efe58-947d-427b-90e4-8a05a8551143";
const imgHorizontalBottom = "https://www.figma.com/api/mcp/asset/380a0507-e3a3-495d-9ac9-c0d76016f63c";
const imgVertical = "https://www.figma.com/api/mcp/asset/f7d2c225-ca8f-4d34-b88b-c399b50b89ec";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

type Mode = "vertical" | "horizontal";

const modeMeta: Record<
    Mode,
    {
        label: string;
        accent: string;
        soft: string;
        badge: string;
    }
> = {
    vertical: {
        label: "垂直模式",
        accent: "#2A6DE5",
        soft: "#EAF2FF",
        badge: "#D8E6FF",
    },
    horizontal: {
        label: "水平模式",
        accent: "#4F74B8",
        soft: "#EDF3FF",
        badge: "#DAE4F7",
    },
};

const hardwareParams = [
    { label: "扫描环角度", value: "90.0°", icon: CircleGauge },
    { label: "扫描臂角度", value: "0.0°", icon: ScanLine },
    { label: "高度", value: "1240 mm", icon: StretchVertical },
    { label: "水平移动距离", value: "315 mm", icon: MoveHorizontal },
];

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

function HorizontalModeGraphic() {
    return (
        <div className="relative h-[120px] w-[108px] select-none">
            <img src={imgHorizontalTop} alt="" draggable={false} className="absolute left-0 top-0 h-[31px] w-[107px] object-contain" />
            <img src={imgHorizontalLeft} alt="" draggable={false} className="absolute left-0 top-[4px] h-[103px] w-[11px] object-contain" />
            <img src={imgHorizontalRight} alt="" draggable={false} className="absolute right-0 top-[8px] h-[103px] w-[10px] object-contain" />
            <img src={imgHorizontalBottom} alt="" draggable={false} className="absolute left-[21px] bottom-0 h-[63px] w-[64px] object-contain" />
        </div>
    );
}

function ModePreview({ mode }: { mode: Mode }) {
    return mode === "vertical" ? (
        <img src={imgVertical} alt="垂直模式" draggable={false} className="h-[108px] w-[108px] object-contain select-none" />
    ) : (
        <HorizontalModeGraphic />
    );
}

function ModeBadge({
    title,
    mode,
    active = false,
}: {
    title: string;
    mode: Mode;
    active?: boolean;
}) {
    const meta = modeMeta[mode];

    return (
        <div
            className="relative flex h-[180px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[5px] border transition-all"
            style={{
                borderColor: active ? meta.accent : "#AFC3EA",
                background: active ? `linear-gradient(180deg, ${meta.soft} 0%, #FFFFFF 100%)` : "#F3F6FC",
                boxShadow: active ? `0 16px 28px -20px ${meta.accent}` : "none",
            }}
        >
            <div
                className="absolute left-[12px] top-[12px] rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{
                    color: active ? meta.accent : "#6D7991",
                    backgroundColor: active ? meta.badge : "#E6EBF5",
                }}
            >
                {title}
            </div>
            <ModePreview mode={mode} />
            <div
                className="mt-4 text-[24px] font-bold leading-none"
                style={{ color: active ? meta.accent : "#5A6781" }}
            >
                {meta.label}
            </div>
        </div>
    );
}

export default function LegacyVerticalCTModeConfirmScreen() {
    const selectedMode = "vertical" as Mode;
    const hardwareMode = "horizontal" as Mode;
    const isMismatch = selectedMode !== hardwareMode;
    const selectedMeta = modeMeta[selectedMode];
    const hardwareMeta = modeMeta[hardwareMode];

    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-[#DCE0ED] text-[#535353]" style={{ fontFamily: pingFang }}>
            <div className="absolute left-0 top-0 h-[80px] w-full bg-[#C1C5D5] opacity-50" />

            <div className="absolute left-0 top-0 h-[80px] w-full">
                <div className="absolute left-[20px] top-[12px] h-[50px] w-[100px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6]">
                    <img
                        src={imgPatient}
                        alt="患者"
                        draggable={false}
                        className="absolute left-[4px] top-[8px] h-[29.818px] w-[31.552px] object-contain select-none"
                    />
                    <div className="absolute left-[38px] top-[4px] w-[56px] text-center text-[14px] font-medium leading-[1.15] text-[#717579] whitespace-nowrap">
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

            <div className="absolute left-[48px] top-[104px] right-[48px] h-[560px] rounded-[8px] border border-[#B8C8E9] bg-[linear-gradient(180deg,#F6F9FF_0%,#EDF2FC_100%)] shadow-[0_18px_45px_rgba(88,117,170,0.16)]">
                <div className="absolute left-[32px] top-[24px] flex items-start gap-4">
                    <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#DCE8FF] text-[#2A6DE5]">
                        <ArrowRightLeft size={22} />
                    </div>
                    <div>
                        <div className="text-[34px] font-bold leading-none text-[#2A6DE5]">模式确认</div>
                        <div className="mt-3 text-[16px] leading-none text-[#69758B]">
                            扫描前请确认目标模式与当前硬件状态一致
                        </div>
                    </div>
                </div>


                <div className="absolute left-[32px] right-[32px] top-[124px] flex items-center gap-4">
                    <ModeBadge title="用户选择" mode={selectedMode} active />
                    <div className="flex w-[78px] flex-col items-center justify-center gap-3 text-[#7E8AA4]">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isMismatch ? "bg-[#FFE3D8] text-[#F37B4D]" : "bg-[#D9F3E3] text-[#3EA96F]"}`}>
                            {isMismatch ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
                        </div>
                        <div className="text-[13px] font-semibold">
                            {isMismatch ? "状态不一致" : "状态一致"}
                        </div>
                    </div>
                    <ModeBadge title="硬件当前状态" mode={hardwareMode} active />
                </div>

                <div
                    className="absolute left-[32px] right-[32px] top-[314px] rounded-[8px] border px-5 py-4"
                    style={{
                        borderColor: isMismatch ? "#F2B79E" : "#A7D8B7",
                        background: isMismatch ? "linear-gradient(180deg, #FFF3EE 0%, #FFF9F7 100%)" : "linear-gradient(180deg, #EFFBF3 0%, #F7FFFA 100%)",
                    }}
                >
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex gap-4">
                            <div className={`mt-1 flex h-11 w-11 items-center justify-center rounded-[5px] ${isMismatch ? "bg-[#FFD8C8] text-[#E46839]" : "bg-[#D8F1E0] text-[#2E9361]"}`}>
                                {isMismatch ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div>
                                <div className={`text-[22px] font-bold leading-none ${isMismatch ? "text-[#D9653B]" : "text-[#2E9361]"}`}>
                                    {isMismatch ? "硬件当前处于水平模式，请先切换模式" : "硬件状态已就绪，可直接进入扫描"}
                                </div>
                                <div className="mt-3 text-[14px] leading-[1.55] text-[#6E778C]">
                                    {isMismatch
                                        ? `当前计划进入${selectedMeta.label}，但探测到硬件实际处于${hardwareMeta.label}。请先完成模式切换，再继续扫描流程。`
                                        : `当前计划进入${selectedMeta.label}，硬件状态与目标模式一致。`}
                                </div>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                            <div className="rounded-full bg-white/80 px-3 py-1 text-[12px] font-semibold text-[#72809B]">
                                当前目标: {selectedMeta.label}
                            </div>
                            <div className="rounded-full bg-white/80 px-3 py-1 text-[12px] font-semibold text-[#72809B]">
                                当前硬件: {hardwareMeta.label}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute left-[32px] right-[32px] bottom-[26px] flex items-end justify-between gap-5">
                    <div className="flex-1">
                        <div className="mb-3 text-[15px] font-semibold text-[#62708B]">
                            当前硬件定位参数
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {hardwareParams.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-[8px] border border-[#C8D6F0] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(92,120,173,0.08)]"
                                    >
                                        <div className="flex items-center gap-2 text-[13px] text-[#7B86A0]">
                                            <Icon size={15} className="text-[#7693D0]" />
                                            {item.label}
                                        </div>
                                        <div className="mt-3 text-[24px] font-bold leading-none text-[#355A9C]">
                                            {item.value}
                                        </div>
                                    </div>
                                );
                            })}
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
                        className="flex h-full items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <Telescope size={32} strokeWidth={1.9} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">扫描成像</span>
                    </button>

                    <button
                        type="button"
                        className="flex h-full items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <View size={30} strokeWidth={1.9} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">成像视图</span>
                    </button>

                    <button
                        type="button"
                        className="flex h-full items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <Download size={30} strokeWidth={1.9} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">传输</span>
                    </button>
                </div>
                </div>
            </div>
    );
}




