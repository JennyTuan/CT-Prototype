import {
    LegacyHorizontalModeIllustration,
    LegacyPatientAvatar,
    LegacyServiceModeIllustration,
    LegacyToolbarIcon,
    LegacyVerticalModeIllustration,
} from "./legacyVerticalCtVisuals";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

type ModeCardProps = {
    active?: boolean;
    title: string;
    left: number;
    children: React.ReactNode;
};

function ModeCard({ active = false, title, left, children }: ModeCardProps) {
    return (
        <button
            type="button"
            className="absolute top-0 h-[208px] w-[330px] overflow-hidden rounded-[5px] border border-[#145AD3]"
            style={{ left, backgroundColor: active ? "#113C88" : "#7E9DD2", boxShadow: active ? "inset 0 1px 3px 0 #0748A6" : undefined }}
        >
            {children}
            <div
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[18px] leading-none"
                style={{
                    bottom: 18,
                    color: active ? "#FFFFFF" : "#535353",
                    fontWeight: active ? 700 : 300,
                    fontFamily: pingFang,
                }}
            >
                {title}
            </div>
        </button>
    );
}

export default function LegacyVerticalCTHomeScreen() {
    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-[#DCE0ED] text-[#535353]" style={{ fontFamily: pingFang }}>
            <div className="absolute left-0 top-0 h-[73px] w-full bg-[#C1C5D5] opacity-50" />

            <div className="absolute left-0 top-0 h-[73px] w-full">
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

            <div className="absolute left-[448px] top-[130px] text-[64px] font-bold leading-none text-[#2A6DE5]">欢迎</div>

            <div className="absolute left-[14px] top-[280px] h-[208px] w-[996px]">
                <ModeCard active title="水平模式" left={0}>
                    <LegacyHorizontalModeIllustration />
                </ModeCard>

                <ModeCard title="垂直模式" left={331}>
                    <LegacyVerticalModeIllustration />
                </ModeCard>

                <ModeCard title="服务模式" left={662}>
                    <LegacyServiceModeIllustration />
                </ModeCard>
            </div>
        </div>
    );
}
