import { useState } from "react";
import {
    AlertCircle,
    ArrowLeftRight,
    ArrowRight,
    CheckCircle2,
    Monitor,
    Move,
    RefreshCw,
    Settings,
    Share2,
    ShieldAlert,
    Telescope,
    View,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";

export default function LegacyVerticalCTMechanicalVerificationScreen() {
    const [modeMatched, setModeMatched] = useState(false);
    const [standbyReady, setStandbyReady] = useState(false);
    const [selectedMode, setSelectedMode] = useState<"horizontal" | "vertical">("horizontal");

    const standbyDetails = [
        { id: "bed", name: "扫描床", status: false },
        { id: "chair", name: "座椅", status: false },
        { id: "ring", name: "扫描环", status: true },
    ];

    const selectedModeLabel = selectedMode === "horizontal" ? "水平模式" : "垂直模式";
    const physicalMode = modeMatched
        ? selectedMode
        : selectedMode === "horizontal"
            ? "vertical"
            : "horizontal";
    const physicalModeLabel = physicalMode === "horizontal" ? "水平模式" : "垂直模式";
    const actionLabel = selectedMode === "horizontal" ? "切换至水平模式" : "切换至垂直模式";

    return (
        <div className="flex h-[768px] w-[1024px] select-none flex-col overflow-hidden bg-[#f0f4f8] font-sans text-[#334155]">
            <header className="relative h-20 shrink-0">
                <div className="absolute inset-0 bg-[#C1C5D5] opacity-50" />
                <div className="relative z-10 flex h-full items-center px-6">
                    <div className="relative h-[52px] w-[115px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6] shadow-sm">
                        <LegacyPatientAvatar alt="患者" />
                        <div className="absolute left-[44px] top-[10px] w-16 text-[12px] font-bold leading-tight text-slate-600">
                            <div>欧阳祖华</div>
                            <div className="font-mono text-[10px] opacity-60">000001</div>
                        </div>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 text-center text-slate-600">
                        <div className="font-mono text-[34px] font-black leading-none tracking-tighter">12:24</div>
                        <div className="mt-1 text-sm font-bold uppercase tracking-widest opacity-80">3月31日</div>
                    </div>

                    <LegacyToolbarIcon kind="emergency" alt="急停" left={756} />
                    <LegacyToolbarIcon kind="laser" alt="激光" left={820} />
                    <LegacyToolbarIcon kind="machine" alt="机器状态" left={884} />
                    <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
                </div>
            </header>

            <main className="flex flex-1 gap-6 overflow-hidden p-6">
                <section className="flex w-64 flex-col gap-4">
                    <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <Settings size={14} /> 模式选取
                    </div>

                    <div
                        onClick={() => setSelectedMode("horizontal")}
                        className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 p-6 transition-all ${
                            selectedMode === "horizontal"
                                ? "border-blue-500 bg-white shadow-md"
                                : "border-transparent bg-white/40 opacity-60 grayscale"
                        }`}
                    >
                        <div className={`flex h-24 w-24 items-center justify-center rounded-2xl ${selectedMode === "horizontal" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-300"}`}>
                            <Monitor size={48} />
                        </div>
                        <span className="text-xl font-bold">水平模式</span>
                        {selectedMode === "horizontal" ? (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">Target</span>
                        ) : null}
                    </div>

                    <div
                        onClick={() => setSelectedMode("vertical")}
                        className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 p-6 transition-all ${
                            selectedMode === "vertical"
                                ? "border-blue-500 bg-white shadow-md"
                                : "border-transparent bg-white/40 opacity-60 grayscale"
                        }`}
                    >
                        <div className={`flex h-24 w-24 items-center justify-center rounded-2xl ${selectedMode === "vertical" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-300"}`}>
                            <div className="rotate-90">
                                <Monitor size={48} />
                            </div>
                        </div>
                        <span className="text-xl font-bold">垂直模式</span>
                        {selectedMode === "vertical" ? (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">Target</span>
                        ) : null}
                    </div>
                </section>

                <section className="flex flex-1 flex-col gap-6">
                    <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <ShieldAlert size={14} /> 机械状态校验
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-6">
                        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">1. 扫描模式匹配校验</h3>
                                    <p className="mt-1 text-sm text-slate-400">确认目标模式与当前机械物理位置一致后，才能继续后续流程。</p>
                                </div>
                                {!modeMatched ? (
                                    <div className="flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-600">
                                        <AlertCircle size={16} /> 模式不匹配
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
                                        <CheckCircle2 size={16} /> 已匹配
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-5 rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#F8FAFC_0%,#F1F5F9_100%)] p-5">
                                <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-[0_8px_18px_-16px_rgba(37,99,235,0.45)]">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Selected Mode</div>
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">Target</span>
                                    </div>
                                    <div className="text-[28px] font-black leading-none text-blue-600">【{selectedModeLabel}】</div>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
                                        <Monitor size={16} className="text-blue-400" />
                                        操作员本次选择的扫描模式
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${modeMatched ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-500"}`}>
                                        <ArrowRight size={24} />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-[0_8px_18px_-16px_rgba(15,23,42,0.28)]">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Mechanical State</div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                                                modeMatched ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                                            }`}
                                        >
                                            {modeMatched ? "Matched" : "Current"}
                                        </span>
                                    </div>
                                    <div className={`text-[28px] font-black leading-none ${modeMatched ? "text-slate-700" : "text-orange-500"}`}>
                                        【{physicalModeLabel}】
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
                                        <Move size={16} className={modeMatched ? "text-emerald-400" : "text-orange-400"} />
                                        设备当前实际停留的机械模式
                                    </div>
                                </div>
                            </div>

                            <div className={`mt-5 rounded-2xl border px-5 py-4 ${modeMatched ? "border-emerald-100 bg-emerald-50/70" : "border-orange-100 bg-orange-50/70"}`}>
                                <div className="flex items-start gap-3">
                                    {modeMatched ? (
                                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                                    ) : (
                                        <AlertCircle size={20} className="mt-0.5 shrink-0 text-orange-600" />
                                    )}
                                    <div>
                                        <div className={`text-sm font-bold ${modeMatched ? "text-emerald-700" : "text-orange-700"}`}>
                                            {modeMatched ? "模式校验通过" : "模式校验未通过"}
                                        </div>
                                        <div className="mt-1 text-sm leading-relaxed text-slate-600">
                                            {modeMatched
                                                ? "当前机械位置与已选扫描模式一致，可以继续进入待机位校验。"
                                                : `当前机械位置为【${physicalModeLabel}】，与目标模式【${selectedModeLabel}】不一致，需要先执行模式切换。`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold">2. 待机位状态校验</h3>
                                {!standbyReady ? (
                                    <div className="flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-600">
                                        <AlertCircle size={16} /> 位置未就绪
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
                                        <CheckCircle2 size={16} /> 全部位就绪
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {standbyDetails.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col items-center gap-3 rounded-2xl border p-5 ${
                                            item.status ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100 bg-slate-50/30"
                                        }`}
                                    >
                                        <div className={item.status ? "text-emerald-500" : "text-orange-400"}>
                                            {item.status ? <CheckCircle2 size={32} /> : <Move size={32} />}
                                        </div>
                                        <div className="font-bold text-slate-600">{item.name}</div>
                                        <div className={`text-[10px] font-bold ${item.status ? "text-emerald-600" : "text-orange-600"}`}>
                                            {item.status ? "已在待机位" : "偏离待机位"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="flex w-72 flex-col">
                    {!modeMatched || !standbyReady ? (
                        <div className="flex flex-1 flex-col rounded-3xl border border-orange-200 bg-white p-6 shadow-md">
                            <div className="mb-6 flex items-center gap-3 border-b border-orange-50 pb-4 text-orange-600">
                                <AlertCircle size={32} />
                                <h2 className="text-2xl font-black uppercase italic">模式不匹配</h2>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">提示说明</div>
                                    <p className="text-xs font-medium leading-relaxed text-slate-500">
                                        当前选定模式与机械物理位置不符。左侧高亮显示当前机械状态，右侧卡片中的 Selected Mode 表示你的目标模式。
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">需执行操作</div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                        {actionLabel}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                        自动移动至待机位
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-3 pt-6">
                                <button
                                    onClick={() => {
                                        setModeMatched(true);
                                        setStandbyReady(true);
                                    }}
                                    className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#10b981] text-white shadow-lg shadow-emerald-50 transition-all active:scale-95 hover:bg-[#059669]"
                                >
                                    <RefreshCw size={24} />
                                    <span className="text-xl font-bold">模式切换</span>
                                </button>
                                <button className="h-12 w-full rounded-xl font-bold text-slate-400 transition-colors hover:bg-slate-50">
                                    返回首页
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-md">
                            <div className="flex flex-1 flex-col items-center justify-center gap-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-700">校验已完成</h2>
                                <p className="px-4 text-sm text-slate-400">系统物理状态已就绪，可以开始进行后续扫描操作。</p>
                            </div>
                            <button className="h-16 w-full rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-50 transition-all active:scale-95">
                                下一步
                            </button>
                        </div>
                    )}
                </aside>
            </main>

            <footer className="h-20 shrink-0 bg-[#88A3D2] px-[18px] pt-[8px]">
                <div className="grid h-[64px] w-full grid-cols-4 gap-[2px]">
                    <button className="flex h-full items-center justify-center gap-4 rounded-[12px] border border-[#5F86CC] bg-[linear-gradient(180deg,#164CA7_0%,#2A63BE_100%)] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                        <ArrowLeftRight size={34} strokeWidth={2.1} />
                        <span className="text-[20px] font-semibold tracking-[0.06em]">位置信息</span>
                    </button>
                    <button className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50">
                        <Telescope size={32} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">扫描成像</span>
                    </button>
                    <button className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50">
                        <View size={30} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">成像视图</span>
                    </button>
                    <button className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50">
                        <Share2 size={30} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">传输</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
