import { useState } from "react";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

type MoveMode = "horizontal" | "vertical";

const modeContent: Record<MoveMode, { title: string; description: string }> = {
    horizontal: {
        title: "平行移动",
        description: "扫描环与底部轨道平行",
    },
    vertical: {
        title: "垂直移动",
        description: "扫描环与底部轨道垂直",
    },
};

function ModeOption({ mode, selected, onClick }: { mode: MoveMode; selected: boolean; onClick: () => void }) {
    const { title, description } = modeContent[mode];
    const isParallel = mode === "horizontal";
    const iconSrc = isParallel ? "/movement-mode-parallel.png" : "/movement-mode-vertical.png";

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative flex h-[144px] flex-1 flex-col items-center justify-center rounded-[5px] border px-4 transition-colors"
            style={{
                borderColor: selected ? "#668FDB" : "#AAB1BD",
                background: selected
                    ? "linear-gradient(180deg,#E5EDFA 0%,#D0DDF3 100%)"
                    : "linear-gradient(180deg,#F4F5F7 0%,#DFE2E8 100%)",
                boxShadow: selected
                    ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(68,86,121,0.22)"
                    : "inset 0 1px 0 rgba(255,255,255,0.92)",
            }}
        >
            <img src={iconSrc} alt="" aria-hidden="true" className="mb-1 h-[68px] w-[128px] object-contain" />
            <div className={`text-[19px] font-semibold ${selected ? "text-[#315C9E]" : "text-[#454B55]"}`}>{title}</div>
            <div className="mt-1 text-[12px] text-[#707887]">{description}</div>
        </button>
    );
}

export default function LegacyVerticalCTMovementModeSelectScreen() {
    const [selectedMode, setSelectedMode] = useState<MoveMode>("horizontal");

    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-transparent" style={{ fontFamily: pingFang }}>
            {/* 独立半透明蒙层：可叠加在任意底层界面上查看效果。 */}
            <div className="absolute inset-0 bg-[rgba(52,59,73,0.30)]" />

            <section className="absolute left-1/2 top-1/2 w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[7px] border border-[#8B99B1] bg-[#E5E8EE] shadow-[0_14px_36px_rgba(40,48,64,0.38)]">
                <div className="flex h-[42px] items-center border-b border-[#A8B1C0] bg-[linear-gradient(180deg,#F4F5F7_0%,#D4D9E2_100%)] px-4">
                    <span className="text-[16px] font-semibold text-[#343A45]">选择行走模式</span>
                </div>

                <div className="px-7 pb-6 pt-5">
                    <p className="mb-4 text-[14px] text-[#505966]">请确认扫描环与底部轨道的相对位置，并选择本次行走方式。</p>
                    <div className="flex gap-4">
                        <ModeOption mode="horizontal" selected={selectedMode === "horizontal"} onClick={() => setSelectedMode("horizontal")} />
                        <ModeOption mode="vertical" selected={selectedMode === "vertical"} onClick={() => setSelectedMode("vertical")} />
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            className="flex h-[34px] min-w-[86px] items-center justify-center rounded-[3px] border border-[#A8B0BC] bg-[linear-gradient(180deg,#F8F9FB_0%,#DDE1E7_100%)] text-[13px] text-[#4E5662]"
                        >
                            取消
                        </button>
                        <button
                            type="button"
                            className="flex h-[34px] min-w-[86px] items-center justify-center rounded-[3px] border border-[#75AA61] bg-[linear-gradient(180deg,#A5D78A_0%,#82BA69_100%)] text-[13px] font-semibold text-white"
                        >
                            确认
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
