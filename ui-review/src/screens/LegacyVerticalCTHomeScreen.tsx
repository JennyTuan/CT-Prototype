import {
    Bell,
    BriefcaseMedical,
    MonitorSmartphone,
    Settings,
    Sparkles,
    Wrench,
} from "lucide-react";

type ModeCardProps = {
    active?: boolean;
    title: string;
    icon: React.ReactNode;
};

const ModeCard = ({ active = false, title, icon }: ModeCardProps) => {
    return (
        <button
            type="button"
            className={[
                "flex-1 rounded-[6px] border border-[#2A6DE5] transition-all duration-200",
                active ? "bg-[#1E4898] text-white shadow-[inset_0_1px_3px_rgba(7,72,166,0.85)]" : "bg-[#7E9DD2] text-[#6F747A] hover:bg-[#89A6D8]",
            ].join(" ")}
        >
            <div className="h-full min-h-[208px] flex flex-col items-center justify-center gap-5">
                <div className="flex items-center justify-center h-[96px]">{icon}</div>
                <div className={["text-[18px] leading-none", active ? "font-bold" : "font-light text-[#5C6167]"].join(" ")}>{title}</div>
            </div>
        </button>
    );
};

function HorizontalModeIcon() {
    return (
        <div className="relative w-[116px] h-[116px]">
            <div className="absolute left-0 top-[16px] h-[84px] w-[14px] rounded-full bg-[#F3F4F6]" />
            <div className="absolute right-0 top-[16px] h-[84px] w-[14px] rounded-full bg-[#F3F4F6]" />
            <div className="absolute left-[10px] top-0 h-[28px] w-[96px] rounded-[10px] bg-[#F3F4F6]" />
            <div className="absolute left-1/2 top-[40px] h-[62px] w-[62px] -translate-x-1/2 rounded-full border-[4px] border-[#F3F4F6]" />
        </div>
    );
}

function VerticalModeIcon() {
    return (
        <div className="relative w-[116px] h-[116px]">
            <div className="absolute left-[8px] top-[18px] h-[84px] w-[12px] rounded-full bg-[#F3F4F6]" />
            <div className="absolute right-[8px] top-[18px] h-[84px] w-[12px] rounded-full bg-[#F3F4F6]" />
            <div className="absolute left-1/2 top-0 h-[32px] w-[116px] -translate-x-1/2 rounded-[12px] border border-[#2E5AA7] bg-[#E9EAED]" />
            <div className="absolute left-1/2 top-[62px] h-[36px] w-[86px] -translate-x-1/2 rounded-[12px] border-[3px] border-[#F3F4F6]" />
        </div>
    );
}

export default function LegacyVerticalCTHomeScreen() {
    return (
        <div className="w-[1024px] h-[768px] overflow-hidden bg-[#DCE0ED] text-[#535353] font-sans relative">
            <div className="absolute inset-x-0 top-0 h-[73px] bg-[#C1C5D5]/70 border-b border-white/30" />

            <div className="absolute left-0 top-0 h-full w-[73px]">
                <div className="absolute left-[20px] top-[18px] flex flex-col gap-10 text-[#3396FF]">
                    <Settings className="size-8" strokeWidth={1.8} />
                    <MonitorSmartphone className="size-8" strokeWidth={1.8} />
                    <Sparkles className="size-8" strokeWidth={1.8} />
                    <Bell className="size-8" strokeWidth={1.8} />
                </div>

                <div className="absolute left-[11px] top-[458px] flex items-center gap-3 text-[#717579]">
                    <div className="text-[32px] font-black leading-none tracking-[0.02em]">13:06</div>
                    <div className="text-[15px] font-extrabold leading-none">3月9日 周日</div>
                </div>

                <div className="absolute left-[12px] bottom-[8px] h-[50px] w-[100px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6] px-2 py-1 text-[#717579]">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#95B0E2] bg-[#E4E8F2] text-[#2A6DE5]">
                            <BriefcaseMedical className="size-4" strokeWidth={1.8} />
                        </div>
                        <div className="leading-tight">
                            <div className="text-[14px] font-medium">欧阳祖华</div>
                            <div className="text-[14px] font-medium">000001</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute left-[438px] top-[130px] text-[64px] font-bold leading-none text-[#2A6DE5]">欢迎</div>

            <div className="absolute left-[14px] top-[280px] w-[996px] h-[208px] flex rounded-[5px] overflow-hidden">
                <ModeCard active title="水平模式" icon={<HorizontalModeIcon />} />
                <ModeCard title="垂直模式" icon={<VerticalModeIcon />} />
                <ModeCard
                    title="服务模式"
                    icon={<Wrench className="size-[100px] text-[#F3F4F6]" strokeWidth={1.5} />}
                />
            </div>
        </div>
    );
}

