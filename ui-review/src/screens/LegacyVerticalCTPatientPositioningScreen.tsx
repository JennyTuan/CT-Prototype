import {
    ArrowRightLeft,
    Download,
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

function ChairPositioningGraphic() {
    return (
        <div className="relative h-[420px] w-[520px]">
            <div className="absolute left-1/2 top-0 h-[82px] w-[256px] -translate-x-1/2 rounded-b-[28px] border border-[#BFCDE4] bg-[linear-gradient(180deg,#DCE5F3_0%,#C7D3E6_100%)] shadow-[0_10px_18px_rgba(112,132,171,0.14)]" />
            <div className="absolute left-1/2 top-[68px] h-[90px] w-[20px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#B9C7DE_0%,#98A9C8_100%)]" />
            <div className="absolute left-1/2 top-[122px] h-[92px] w-[208px] -translate-x-1/2 rounded-[48px] border-[16px] border-[#8FA7D6] bg-[radial-gradient(circle_at_50%_50%,#F8FBFF_0%,#EEF4FD_58%,#DCE6F3_100%)] shadow-[0_18px_30px_rgba(96,119,170,0.18)]" />
            <div className="absolute left-1/2 top-[145px] h-[46px] w-[46px] -translate-x-1/2 rounded-full border border-[#B5C4DE] bg-white/85" />

            <div className="absolute left-[112px] top-[220px] h-[104px] w-[88px] rounded-[22px] border border-[#AAB9D4] bg-[linear-gradient(180deg,#E8F0FB_0%,#D6E0EF_100%)]" />
            <div className="absolute left-[136px] top-[262px] h-[72px] w-[118px] rounded-[18px] border border-[#AAB9D4] bg-[linear-gradient(180deg,#DCE6F4_0%,#C4D1E6_100%)]" />
            <div className="absolute left-[182px] top-[328px] h-[28px] w-[28px] rounded-[8px] bg-[#8FA2C2]" />
            <div className="absolute left-[128px] top-[354px] h-[16px] w-[136px] rounded-full bg-[#97A8C6]" />

            <div className="absolute left-[218px] top-[196px] h-[42px] w-[42px] rounded-full border border-[#A6B8D6] bg-[radial-gradient(circle_at_35%_35%,#F7FBFF_0%,#DAE5F4_72%,#C2D0E5_100%)]" />
            <div className="absolute left-[208px] top-[234px] h-[86px] w-[60px] rounded-[24px] border border-[#A6B8D6] bg-[linear-gradient(180deg,#EDF4FD_0%,#D8E3F1_100%)]" />
            <div className="absolute left-[184px] top-[244px] h-[28px] w-[48px] rounded-[18px] border border-[#A6B8D6] bg-[linear-gradient(180deg,#EAF1FC_0%,#D2DDEF_100%)] -rotate-[25deg]" />
            <div className="absolute left-[246px] top-[244px] h-[28px] w-[48px] rounded-[18px] border border-[#A6B8D6] bg-[linear-gradient(180deg,#EAF1FC_0%,#D2DDEF_100%)] rotate-[28deg]" />
            <div className="absolute left-[212px] top-[318px] h-[78px] w-[20px] rounded-[12px] border border-[#A6B8D6] bg-[linear-gradient(180deg,#EAF1FC_0%,#D2DDEF_100%)]" />
            <div className="absolute left-[240px] top-[318px] h-[78px] w-[20px] rounded-[12px] border border-[#A6B8D6] bg-[linear-gradient(180deg,#EAF1FC_0%,#D2DDEF_100%)]" />

            <div className="absolute left-1/2 top-[96px] h-[280px] w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(42,109,229,0)_0%,rgba(42,109,229,0.82)_18%,rgba(42,109,229,0.82)_82%,rgba(42,109,229,0)_100%)]" />
            <div className="absolute left-[92px] top-[168px] h-[2px] w-[336px] bg-[linear-gradient(90deg,rgba(42,109,229,0)_0%,rgba(42,109,229,0.82)_18%,rgba(42,109,229,0.82)_82%,rgba(42,109,229,0)_100%)]" />
            <div className="absolute left-1/2 top-[160px] h-[18px] w-[18px] -translate-x-1/2 rounded-full border-2 border-[#2A6DE5] bg-white shadow-[0_0_0_6px_rgba(42,109,229,0.12)]" />

            <div className="absolute right-[22px] top-[122px] rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#6E7D97] shadow-sm">
                吊挂扫描环
            </div>
            <div className="absolute left-[28px] bottom-[24px] rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#6E7D97] shadow-sm">
                患者坐姿中心
            </div>
            <div className="absolute right-[36px] bottom-[54px] rounded-[16px] border border-[#C7D8F3] bg-white/82 px-4 py-3 text-[12px] font-semibold leading-[1.45] text-[#66758F] shadow-sm">
                <div>患者坐在固定椅位</div>
                <div>扫描环从上方下降并旋转到位</div>
                <div>激光交点锁定胸部中心线</div>
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
                    <div className="flex items-center justify-between rounded-[14px] border border-[#C9D7F0] bg-white/70 px-4 py-3">
                        <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8B97AE]">Position Preview</div>
                            <div className="mt-1 text-[18px] font-bold text-[#355A9C]">扫描环中心已对准患者胸部区域</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#EAF2FF]">
                                <img src={imgVertical} alt="垂直模式" draggable={false} className="h-[32px] w-[32px] object-contain" />
                            </div>
                            <div className="rounded-full bg-[#D8E6FF] px-4 py-1 text-[12px] font-black text-[#2A6DE5]">
                                坐姿摆位 / 垂直 CT
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-1">
                        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[18px] border border-[#CBD8EE] bg-[radial-gradient(circle_at_50%_20%,#FFFFFF_0%,#ECF3FF_52%,#DEE7F4_100%)]">
                            <div className="absolute left-[28px] top-[24px] rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-[#6B7280] shadow-sm">
                                坐姿中心预览
                            </div>
                            <div className="absolute right-[28px] top-[24px] rounded-full bg-[#E8F1FF] px-3 py-1 text-[11px] font-bold text-[#2A6DE5] shadow-sm">
                                激光已锁定
                            </div>
                            <ChairPositioningGraphic />
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
