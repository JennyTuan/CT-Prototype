type Phase = "mode-color" | "mode-enable" | "standby";
type TargetMode = "horizontal" | "vertical";

type LegacyVerticalCTModeSwitchContentProps = {
    phase?: Phase;
    targetMode?: TargetMode;
    isMoving?: boolean;
    onAdvance?: () => void;
    onCancel: () => void;
};

const MODE_IMAGES: Record<TargetMode, string> = {
    horizontal: "/弹出实体按键-水平.png",
    vertical: "/弹出实体按键-垂直.png",
};
const MODE_BUBBLE_POS: Record<TargetMode, { left: string; top: string }> = {
    horizontal: { left: "15%", top: "31%" },
    vertical: { left: "70%", top: "23%" },
};
const ENABLE_IMAGE = "/弹出实体按键-使能.png";

export default function LegacyVerticalCTModeSwitchContent({
    phase = "mode-color",
    targetMode = "horizontal",
    isMoving = false,
    onAdvance,
    onCancel,
}: LegacyVerticalCTModeSwitchContentProps) {
    const imgSrc = phase === "mode-color" ? MODE_IMAGES[targetMode] : ENABLE_IMAGE;
    const modeBubblePos = MODE_BUBBLE_POS[targetMode];

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#EDF1F7] shadow-lg">
            <div className="flex flex-1 flex-col items-end justify-start p-0 pb-2">
                <div className="relative h-[520px] w-fit">
                    <img
                        src={imgSrc}
                        alt="Simulator panel"
                        draggable={false}
                        className="h-[520px] w-auto max-w-full select-none object-contain"
                    />
                    {!isMoving && phase === "mode-color" && (
                        <button
                            type="button"
                            onClick={onAdvance}
                            disabled={!onAdvance}
                            style={{ left: modeBubblePos.left, top: modeBubblePos.top }}
                            className="absolute flex -translate-x-1/2 flex-col items-center border-0 bg-transparent p-0 animate-bounce focus:outline-none disabled:cursor-default"
                        >
                            <div className="rounded-md bg-[#008D64] px-3 py-1 text-[10px] font-black text-white shadow-md">
                                按住绿色按钮
                            </div>
                            <div className="h-0 w-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#008D64]" />
                        </button>
                    )}
                    {!isMoving && (phase === "mode-enable" || phase === "standby") && (
                        <button
                            type="button"
                            onClick={onAdvance}
                            disabled={!onAdvance}
                            className="absolute right-[48%] top-[11%] flex -translate-y-1/2 items-center border-0 bg-transparent p-0 animate-bounce focus:outline-none disabled:cursor-default"
                        >
                            <div className="whitespace-nowrap rounded-md bg-[#008D64] px-3 py-1 text-[10px] font-black text-white shadow-md">
                                按住使能按键
                            </div>
                            <div className="h-0 w-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[#008D64]" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex shrink-0 justify-end px-6 pb-5 pt-0">
                <button
                    disabled={isMoving}
                    onClick={onCancel}
                    className="min-w-[108px] rounded-full border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(233,239,247,0.96)_100%)] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all hover:border-slate-400/80 hover:text-slate-700 hover:shadow-[0_14px_28px_-18px_rgba(15,23,42,0.6),inset_0_1px_0_rgba(255,255,255,1)] active:scale-95 active:bg-[linear-gradient(180deg,rgba(232,238,246,0.98)_0%,rgba(255,255,255,0.96)_100%)] disabled:cursor-not-allowed disabled:opacity-35"
                >
                    取消
                </button>
            </div>
        </div>
    );
}
