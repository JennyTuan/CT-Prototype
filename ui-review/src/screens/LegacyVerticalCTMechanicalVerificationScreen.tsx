import { useMemo, useState } from "react";
import {
    ShieldAlert,
    Settings,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Move,
    Monitor,
    Share2,
    ArrowLeftRight,
    Telescope,
    View,
    ArrowRight,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";

type ModeKey = "horizontal" | "vertical";

export default function LegacyVerticalCTMechanicalVerificationScreen() {
    const configSupportsModeSwitch = true;

    const [modeMatched, setModeMatched] = useState(false);
    const [standbyReady, setStandbyReady] = useState(false);
    const [selectedMode, setSelectedMode] = useState<ModeKey>("horizontal");

    const standbyDetails = useMemo(
        () => [
            { id: "bed", name: "扫描床", status: standbyReady },
            { id: "chair", name: "座椅", status: standbyReady },
            { id: "ring", name: "扫描环", status: true },
        ],
        [standbyReady]
    );

    const canProceed = configSupportsModeSwitch ? modeMatched && standbyReady : standbyReady;
    const currentPhysicalMode = modeMatched
        ? selectedMode
        : selectedMode === "horizontal"
            ? "vertical"
            : "horizontal";

    const selectedModeLabel = selectedMode === "horizontal" ? "水平模式" : "垂直模式";
    const physicalModeLabel = currentPhysicalMode === "horizontal" ? "水平模式" : "垂直模式";

    return (
        <div className="flex h-[768px] w-[1024px] select-none flex-col overflow-hidden bg-[#f0f4f8] font-sans text-[#334155]">
            <header className="relative h-20 shrink-0">
                <div className="absolute inset-0 bg-[#C1C5D5] opacity-50" />
                <div className="relative z-10 flex h-full items-center px-6">
                    <div className="relative h-[52px] w-[115px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6] shadow-sm">
                        <LegacyPatientAvatar alt="患者头像" />
                        <div className="absolute left-[44px] top-[10px] w-16 text-[12px] font-bold leading-tight text-slate-600">
                            <div>欧阳祖华</div>
                            <div className="font-mono text-[10px] opacity-60">000001</div>
                        </div>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 text-center text-slate-600">
                        <div className="text-[34px] font-black leading-none tracking-tighter">12:24</div>
                        <div className="mt-1 text-sm font-bold uppercase tracking-widest opacity-80">3月31日</div>
                    </div>

                    <LegacyToolbarIcon kind="emergency" alt="急停" left={756} />
                    <LegacyToolbarIcon kind="laser" alt="激光" left={820} />
                    <LegacyToolbarIcon kind="machine" alt="机器状态" left={884} />
                    <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
                </div>
            </header>

            <main className="flex flex-1 gap-4 overflow-hidden px-4 py-4">
                {configSupportsModeSwitch ? (
                    <section className="flex w-[180px] shrink-0 flex-col gap-3">
                        <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                            <Settings size={14} />
                            <span>扫描模式</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedMode("horizontal")}
                            className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 px-4 py-5 transition-all ${
                                selectedMode === "horizontal"
                                    ? "border-blue-500 bg-white shadow-md"
                                    : "border-transparent bg-white/40 opacity-60 grayscale"
                            }`}
                        >
                            <div
                                className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
                                    selectedMode === "horizontal" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-300"
                                }`}
                            >
                                <Monitor size={40} />
                            </div>
                            <span className="whitespace-nowrap text-[15px] font-bold">水平模式</span>
                            {selectedMode === "horizontal" ? (
                                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">Target</span>
                            ) : null}
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedMode("vertical")}
                            className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 px-4 py-5 transition-all ${
                                selectedMode === "vertical"
                                    ? "border-blue-500 bg-white shadow-md"
                                    : "border-transparent bg-white/40 opacity-60 grayscale"
                            }`}
                        >
                            <div
                                className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
                                    selectedMode === "vertical" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-300"
                                }`}
                            >
                                <div className="rotate-90">
                                    <Monitor size={40} />
                                </div>
                            </div>
                            <span className="whitespace-nowrap text-[15px] font-bold">垂直模式</span>
                            {selectedMode === "vertical" ? (
                                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">Target</span>
                            ) : null}
                        </button>
                    </section>
                ) : null}

                <section className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <ShieldAlert size={14} />
                        <span>开机自检</span>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                        {configSupportsModeSwitch ? (
                            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h3 className="text-[15px] font-bold whitespace-nowrap">1. 扫描模式匹配校验</h3>
                                    {!modeMatched ? (
                                        <div className="flex items-center gap-1.5 rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1 text-[12px] font-bold text-orange-600">
                                            <AlertCircle size={14} />
                                            <span>模式不匹配</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                                            <CheckCircle2 size={14} />
                                            <span>已匹配</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-5 rounded-2xl bg-slate-50/50 px-4 py-5">
                                    <div className="min-w-0 text-center">
                                        <div className="mb-2 text-[10px] font-bold uppercase text-slate-400">已选模式</div>
                                        <div className="whitespace-nowrap text-[17px] font-black text-blue-600">【{selectedModeLabel}】</div>
                                    </div>
                                    <ArrowRight size={20} className="shrink-0 text-slate-300" />
                                    <div className="min-w-0 text-center">
                                        <div className="mb-2 text-[10px] font-bold uppercase text-slate-400">物理机械位置</div>
                                        <div className={`whitespace-nowrap text-[17px] font-black ${!modeMatched ? "text-orange-500" : "text-slate-700"}`}>
                                            【{physicalModeLabel}】
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div
                            className={`flex min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${
                                !configSupportsModeSwitch ? "flex-1 justify-center" : ""
                            }`}
                        >
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="text-[15px] font-bold whitespace-nowrap">{configSupportsModeSwitch ? "2. " : ""}待机位状态校验</h3>
                                {!standbyReady ? (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1 text-[12px] font-bold text-orange-600">
                                        <AlertCircle size={14} />
                                        <span>位置未就绪</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                                        <CheckCircle2 size={14} />
                                        <span>全部位就绪</span>
                                    </div>
                                )}
                            </div>

                            <div className={`grid flex-1 grid-cols-3 gap-3 ${!configSupportsModeSwitch ? "py-10" : ""}`}>
                                {standbyDetails.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex min-h-0 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3 transition-all ${
                                            item.status ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100 bg-slate-50/30 shadow-sm"
                                        }`}
                                    >
                                        <div className={item.status ? "text-emerald-500" : "text-orange-400"}>
                                            {item.status ? <CheckCircle2 size={32} /> : <Move size={32} className="animate-pulse" />}
                                        </div>
                                        <div className="text-center text-[14px] font-bold text-slate-600">{item.name}</div>
                                        <div className={`text-center text-[10px] font-bold leading-4 ${item.status ? "text-emerald-600" : "text-orange-600"}`}>
                                            {item.status ? "已在待机位" : "偏离待机位"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="flex w-[240px] shrink-0 flex-col">
                    {!canProceed ? (
                        <div className="flex flex-1 flex-col rounded-3xl border border-orange-200 bg-white p-6 shadow-md">
                            <div className="mb-6 flex items-center gap-3 border-b border-orange-50 pb-4 text-orange-600">
                                <AlertCircle size={32} />
                                <h2 className="text-2xl font-black uppercase italic">
                                    {!standbyReady && configSupportsModeSwitch && modeMatched
                                        ? "位置未就绪"
                                        : !modeMatched && configSupportsModeSwitch
                                            ? "模式不匹配"
                                            : "自检未通过"}
                                </h2>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">提示说明</div>
                                    <p className="text-xs font-medium leading-relaxed text-slate-500">
                                        {configSupportsModeSwitch
                                            ? "当前选定模式与机械物理位置不符，或部分组件未在位。请点击下方按钮进行自动调整。"
                                            : "检测到机械组件未处于预设待机位置，请在开始扫描前进行一键复位。"}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">需执行操作</div>
                                    {configSupportsModeSwitch && !modeMatched ? (
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                            <span>{selectedMode === "horizontal" ? "物理切换至水平模式" : "物理切换至垂直模式"}</span>
                                        </div>
                                    ) : null}
                                    {!standbyReady ? (
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                            <span>移动组件至待机位</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-auto space-y-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModeMatched(true);
                                        setStandbyReady(true);
                                    }}
                                    className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#10b981] text-white shadow-lg shadow-emerald-50 transition-all hover:bg-[#059669] active:scale-95"
                                >
                                    <RefreshCw size={24} />
                                    <span className="text-xl font-bold">{configSupportsModeSwitch ? "模式切换" : "一键复位"}</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-12 w-full rounded-xl font-bold text-slate-400 transition-colors hover:bg-slate-50"
                                >
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
                            <button
                                type="button"
                                className="h-16 w-full rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-50 transition-all active:scale-95"
                            >
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
