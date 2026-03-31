import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertTriangle,
    ArrowLeftRight,
    CheckCircle2,
    Image as LucideImage,
    Info,
    RefreshCcw,
    Send,
    Telescope,
    View,
    Zap,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";

const premiumFont = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

type Mode = "水平模式" | "垂直模式";

function DataCard({ title, value, unit = "", isMoving }: { title: string; value: string; unit?: string; isMoving: boolean }) {
    return (
        <div className={`flex flex-col rounded-2xl border p-5 transition-all duration-300 ${isMoving ? "scale-[1.01] border-blue-400 bg-blue-50/50 shadow-inner" : "border-slate-200 bg-white"}`}>
            <div className="flex shrink-0 items-start justify-between">
                <span className="text-sm font-bold tracking-wide text-slate-500">{title}</span>
                {isMoving && <Zap size={14} className="text-blue-500" />}
            </div>

            <div className="group my-4 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50">
                <div className="flex flex-col items-center text-slate-300">
                    <LucideImage size={32} className={`mb-2 opacity-30 ${isMoving ? "animate-bounce" : ""}`} />
                    <span className="text-[10px] font-medium uppercase tracking-widest opacity-40">Machine Sketch</span>
                </div>
            </div>

            <div className="flex shrink-0 items-baseline justify-center">
                <span className={`whitespace-nowrap text-4xl font-bold tracking-tighter tabular-nums transition-colors ${isMoving ? "text-blue-600" : "text-slate-800"}`}>
                    {value}
                </span>
                {unit ? <span className="ml-1 text-sm font-bold text-slate-400">{unit}</span> : null}
            </div>
        </div>
    );
}

const modeTargets: Record<Mode, { x: number; y: number; a: number; b: number }> = {
    水平模式: { x: 133.0, y: -189.0, a: -60, b: -12 },
    垂直模式: { x: 0.0, y: 500.0, a: 90, b: 0 },
};

export default function LegacyVerticalCTModeConfirmScreen() {
    const [currentMode, setCurrentMode] = useState<Mode>("水平模式");
    const [deviceState, setDeviceState] = useState<Mode>("垂直模式");
    const [time, setTime] = useState(new Date());
    const [isSwitching, setIsSwitching] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [progress, setProgress] = useState(0);

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isMoving) {
            timerRef.current = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setIsMoving(false);
                        setIsSwitching(false);
                        setDeviceState(currentMode);
                        return 100;
                    }
                    return prev + 1.2;
                });
            }, 30);
        } else if (timerRef.current) {
            window.clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [isMoving, currentMode]);

    const values = useMemo(() => {
        const start = modeTargets[deviceState];
        const end = modeTargets[currentMode];
        const p = Math.min(progress / 100, 1);
        return {
            x: (start.x + (end.x - start.x) * p).toFixed(1),
            y: (start.y + (end.y - start.y) * p).toFixed(1),
            a: Math.round(start.a + (end.a - start.a) * p),
            b: Math.round(start.b + (end.b - start.b) * p),
        };
    }, [progress, deviceState, currentMode]);

    useEffect(() => {
        const timer = window.setInterval(() => setTime(new Date()), 60000);
        return () => window.clearInterval(timer);
    }, []);

    const isMatch = currentMode === deviceState;
    const highlightedMode = deviceState;

    return (
        <div className="flex h-[768px] w-[1024px] flex-col overflow-hidden bg-[#f0f4f8] text-slate-800" style={{ fontFamily: premiumFont }}>
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
                        <div className="text-[34px] font-black leading-none tracking-tighter">
                            {time.getHours().toString().padStart(2, "0")}:{time.getMinutes().toString().padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-sm font-bold uppercase tracking-widest opacity-80">
                            {time.getMonth() + 1}月{time.getDate()}日
                        </div>
                    </div>

                    <LegacyToolbarIcon kind="emergency" alt="急停" left={756} />
                    <LegacyToolbarIcon kind="laser" alt="激光" left={820} />
                    <LegacyToolbarIcon kind="machine" alt="机器状态" left={884} />
                    <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
                </div>
            </header>

            <main className="flex flex-1 gap-4 overflow-hidden p-4">
                <section className="flex w-64 flex-col gap-3">
                    <h2 className="mb-1 flex items-center px-2 text-lg font-bold text-slate-400">
                        <Info size={16} className="mr-2" /> 扫描模式
                    </h2>
                    {(["水平模式", "垂直模式"] as const).map((mode) => {
                        const isMechanicalActive = highlightedMode === mode;
                        const isTargetMode = currentMode === mode;

                        return (
                            <button
                                key={mode}
                                disabled={isSwitching || isMoving}
                                onClick={() => {
                                    setCurrentMode(mode);
                                    setProgress(0);
                                }}
                                className={`relative flex flex-1 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${isMechanicalActive ? "border-blue-400 bg-blue-600 text-white shadow-xl shadow-blue-200/50" : "border-slate-100 bg-white text-slate-400 hover:border-blue-100"} ${(isSwitching || isMoving) && "opacity-50"}`}
                            >
                                {!isMatch && isTargetMode && !isMechanicalActive ? (
                                    <div className="absolute right-3 top-3 rounded-full bg-[#E8EEF9] px-2 py-1 text-[10px] font-bold tracking-[0.08em] text-[#43689D]">
                                        目标
                                    </div>
                                ) : null}
                                <div className={`mb-4 flex h-24 w-44 items-center justify-center rounded-xl border border-dashed ${isMechanicalActive ? "border-white/30 bg-white/10" : "border-slate-100 bg-slate-50"}`}>
                                    <LucideImage size={32} className={isMechanicalActive ? "text-white/40" : "text-slate-200"} />
                                </div>
                                <span className="text-xl font-bold">{mode}</span>
                            </button>
                        );
                    })}
                </section>

                <section className="grid flex-1 grid-cols-2 grid-rows-2 gap-4">
                    <DataCard title="水平位移" value={`${parseFloat(values.x) > 0 ? "+" : ""}${values.x}`} unit="mm" isMoving={isMoving} />
                    <DataCard title="垂直高度" value={`${parseFloat(values.y) >= 0 ? "+" : ""}${values.y}`} unit="mm" isMoving={isMoving} />
                    <DataCard title="倾斜角度 A" value={`${values.a}°`} isMoving={isMoving} />
                    <DataCard title="旋转角度 B" value={`${values.b}°`} isMoving={isMoving} />
                </section>

                <section className={`flex shrink-0 flex-col ${isSwitching ? "w-fit" : "w-[240px]"}`}>
                    {!isSwitching ? (
                        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className={`mb-8 flex items-center ${isMatch ? "text-emerald-500" : "text-amber-500"}`}>
                                {isMatch ? <CheckCircle2 size={32} className="mr-3" /> : <AlertTriangle size={32} className="mr-3" />}
                                <h3 className="text-2xl font-black tracking-tight text-slate-800">{isMatch ? "状态匹配" : "模式不匹配"}</h3>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="rounded-xl border-l-8 border-blue-500 bg-slate-50 p-4 shadow-sm">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Selected Mode</p>
                                    <p className="text-xl font-black text-blue-700">【{currentMode}】</p>
                                </div>
                                <div className={`rounded-xl border-l-8 p-4 shadow-sm ${isMatch ? "border-emerald-500 bg-slate-50" : "border-slate-300 bg-slate-50"}`}>
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mechanical State</p>
                                    <p className="text-xl font-black text-slate-700">【{deviceState}】</p>
                                </div>
                                {!isMatch && (
                                    <div className="mt-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                        <Info size={18} className="mt-0.5 shrink-0 text-blue-500" />
                                        <p className="text-xs font-medium leading-relaxed text-blue-600/80">
                                            当前模式与机械位置不符。左侧高亮表示当前机械状态，右侧卡片中的 Selected Mode 表示你的目标模式。
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                {!isMatch && (
                                    <button
                                        onClick={() => setIsSwitching(true)}
                                        className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3 text-lg font-black text-white shadow-xl shadow-emerald-200/50 transition-all hover:bg-emerald-600 active:scale-95"
                                    >
                                        <RefreshCcw size={20} className="mr-3" /> 模式切换
                                    </button>
                                )}
                                <button className="w-full py-2 text-sm font-bold tracking-widest text-slate-300 transition-colors hover:text-slate-500">
                                    返回首页
                                </button>
                            </div>
                        </div>
                    ) : (
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
                                    onClick={() => {
                                        setIsSwitching(false);
                                        setProgress(0);
                                    }}
                                    className="min-w-[108px] rounded-full border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(233,239,247,0.96)_100%)] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all hover:border-slate-400/80 hover:text-slate-700 hover:shadow-[0_14px_28px_-18px_rgba(15,23,42,0.6),inset_0_1px_0_rgba(255,255,255,1)] active:scale-95 active:bg-[linear-gradient(180deg,rgba(232,238,246,0.98)_0%,rgba(255,255,255,0.96)_100%)] disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <footer className="h-20 shrink-0 bg-[#88A3D2] px-[18px] pt-[8px]">
                <div className="grid h-[64px] w-full grid-cols-4 gap-[2px]">
                    <button className="flex h-full items-center justify-center gap-4 rounded-[12px] border border-[#5F86CC] bg-[linear-gradient(180deg,#164CA7_0%,#2A63BE_100%)] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                        <ArrowLeftRight size={34} strokeWidth={2.1} />
                        <span className="text-[20px] font-semibold tracking-[0.06em]">位置信息</span>
                    </button>
                    {[
                        { icon: <Telescope size={32} />, label: "扫描成像" },
                        { icon: <View size={30} />, label: "成像视图" },
                        { icon: <Send size={30} className="-rotate-12" />, label: "传输" },
                    ].map((btn, idx) => (
                        <button key={idx} className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50">
                            {btn.icon}
                            <span className="text-[18px] font-medium tracking-[0.03em]">{btn.label}</span>
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
}
