import ScanConfirmScreen from "./ScanConfirmScreen";

export default function ScoutExecuteScanScreen() {
    return (
        <div className="relative w-[1024px] h-[768px]">
            <ScanConfirmScreen activeScoutStepIndex={2} readOnlyMode />

            <div className="pointer-events-none absolute inset-y-[88px] right-0 z-40 flex items-stretch">
                <div className="pointer-events-auto w-[380px] rounded-l-2xl border border-r-0 border-[#CBD5E1] bg-[#EDF1F7] shadow-[-24px_0_48px_rgba(15,23,42,0.22)] overflow-hidden">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="text-[14px] font-black text-slate-700">实体按键操作引导</div>
                        <div className="mt-1 text-[11px] font-medium text-slate-400">执行扫描前请确认实体控制器状态</div>
                    </div>

                    <div className="flex h-full flex-col">
                        <div className="flex-1 flex items-start justify-end overflow-hidden pt-2">
                            <div className="relative h-[500px] w-fit">
                                <img
                                    src="/弹出实体按键.png"
                                    alt="实体按键引导"
                                    draggable={false}
                                    className="h-[500px] w-auto max-w-none object-contain select-none"
                                />
                                <div className="pointer-events-none absolute left-[15%] top-[31%] flex -translate-x-1/2 flex-col items-center animate-bounce">
                                    <div className="rounded-md bg-[#008D64] px-3 py-1 text-[10px] font-black text-white shadow-md">
                                        按住绿色按钮
                                    </div>
                                    <div className="h-0 w-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#008D64]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 justify-end px-6 pb-5 pt-2">
                            <div className="min-w-[108px] rounded-full border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(233,239,247,0.96)_100%)] px-6 py-2.5 text-center text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.95)]">
                                等待操作
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
