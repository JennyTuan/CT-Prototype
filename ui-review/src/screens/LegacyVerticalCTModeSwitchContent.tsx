type LegacyVerticalCTModeSwitchContentProps = {
    isMoving?: boolean;
    onCancel: () => void;
};

export default function LegacyVerticalCTModeSwitchContent({
    isMoving = false,
    onCancel,
}: LegacyVerticalCTModeSwitchContentProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#EDF1F7] shadow-lg">
            <div className="flex flex-1 flex-col items-end justify-start p-0 pb-2">
                <div className="relative h-[520px] w-fit">
                    <img
                        src="/弹出实体按键.png"
                        alt="Simulator panel"
                        draggable={false}
                        className="h-[520px] w-auto max-w-full select-none object-contain"
                    />
                    {!isMoving && (
                        <div className="pointer-events-none absolute left-[15%] top-[31%] flex -translate-x-1/2 flex-col items-center animate-bounce">
                            <div className="rounded-md bg-[#008D64] px-3 py-1 text-[10px] font-black text-white shadow-md">
                                按住绿色按钮
                            </div>
                            <div className="h-0 w-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#008D64]" />
                        </div>
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
