import { useEffect, useRef, useState } from "react";
import { CircleDot, Zap } from "lucide-react";
import lungCtSample from "../assets/lung-ct-sample.svg";
import ScanConfirmScreen from "./ScanConfirmScreen";

const HOLD_DURATION_MS = 3000;
const EXPOSURE_DURATION_MS = 1200;
const RENDER_DURATION_MS = 2200;
const SCOUT_RULER_TICKS = Array.from({ length: 9 }, (_, index) => ({
    label: `${index * 50}`,
    top: `${8 + index * 10.5}%`,
}));

type ScanStage = "idle" | "arming" | "enabled" | "exposing" | "rendering" | "completed";

export default function ScoutExecuteScanScreen() {
    const [stage, setStage] = useState<ScanStage>("idle");
    const [holdProgress, setHoldProgress] = useState(0);
    const [guideVisible, setGuideVisible] = useState(true);
    const [renderProgress, setRenderProgress] = useState(0);
    const rafRef = useRef<number | null>(null);
    const holdStartRef = useRef<number | null>(null);
    const progressStartRef = useRef<number | null>(null);
    const exposureTimerRef = useRef<number | null>(null);

    const clearHoldRaf = () => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            clearHoldRaf();
            if (exposureTimerRef.current !== null) {
                window.clearTimeout(exposureTimerRef.current);
            }
        };
    }, []);

    const runRenderAnimation = () => {
        progressStartRef.current = performance.now();

        const tick = (timestamp: number) => {
            const startedAt = progressStartRef.current ?? timestamp;
            const nextProgress = Math.min((timestamp - startedAt) / RENDER_DURATION_MS, 1);

            setRenderProgress(nextProgress);

            if (nextProgress < 1) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            rafRef.current = null;
            setStage("completed");
        };

        rafRef.current = requestAnimationFrame(tick);
    };

    const triggerScanSequence = () => {
        clearHoldRaf();
        setHoldProgress(1);
        setStage("enabled");

        window.setTimeout(() => {
            setStage("exposing");
            setGuideVisible(false);
        }, 180);

        exposureTimerRef.current = window.setTimeout(() => {
            setStage("rendering");
            setRenderProgress(0);
            runRenderAnimation();
        }, EXPOSURE_DURATION_MS);
    };

    const startHold = () => {
        if (!guideVisible || stage === "exposing" || stage === "rendering" || stage === "completed") {
            return;
        }

        clearHoldRaf();
        holdStartRef.current = performance.now();
        setStage("arming");

        const tick = (timestamp: number) => {
            const startedAt = holdStartRef.current ?? timestamp;
            const nextProgress = Math.min((timestamp - startedAt) / HOLD_DURATION_MS, 1);

            setHoldProgress(nextProgress);

            if (nextProgress >= 1) {
                triggerScanSequence();
                return;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
    };

    const stopHold = () => {
        if (stage !== "arming") {
            return;
        }

        clearHoldRaf();
        holdStartRef.current = null;
        setHoldProgress(0);
        setStage("idle");
    };

    const statusText =
        stage === "arming"
            ? `长按触发 ${Math.max(0, ((1 - holdProgress) * 3)).toFixed(1)}s`
            : stage === "enabled"
                ? "使能已建立"
                : stage === "exposing"
                    ? "曝光中..."
                    : stage === "rendering"
                        ? "定位像生成中..."
                        : stage === "completed"
                            ? "定位像已生成"
                            : "等待操作";

    const guideTitle =
        stage === "arming"
            ? "持续按住绿色按钮"
            : stage === "enabled"
                ? "系统已使能"
                : stage === "exposing"
                    ? "正在曝光"
                    : "按住绿色按钮";

    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden">
            <ScanConfirmScreen activeScoutStepIndex={2} readOnlyMode />

            <div className="pointer-events-none absolute bottom-[80px] left-[246px] right-0 top-[82px] z-20 overflow-hidden rounded-lg">
                <div className="flex h-full flex-col border border-white/5 bg-[#1A222B]">
                    <div className="flex h-[44px] items-center justify-between border-b border-white/10 bg-[#131A22] px-4">
                        <div className="flex items-center gap-2 text-[#C6D4E1]">
                            <CircleDot size={12} className={stage === "exposing" ? "text-[#66BB6A]" : "text-[#4D94FF]"} />
                            <span className="text-[11px] font-bold tracking-wide">影像区域</span>
                        </div>
                        <span className="text-[11px] text-[#90A4AE]">{statusText}</span>
                    </div>

                    <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_50%_16%,rgba(120,166,255,0.12),transparent_34%),linear-gradient(180deg,#111821_0%,#141D26_45%,#1A222B_100%)]">
                        <div className={`absolute inset-0 transition-opacity duration-500 ${stage === "idle" || stage === "arming" || stage === "enabled" ? "opacity-100" : "opacity-30"}`}>
                            <div className="flex h-full items-center justify-center text-[52px] font-thin uppercase tracking-[16px] text-[#546E7A]/70">
                                Viewport
                            </div>
                        </div>

                        <div className={`absolute inset-0 transition-opacity duration-500 ${stage === "rendering" || stage === "completed" ? "opacity-100" : "opacity-0"}`}>
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_16%,transparent_84%,rgba(255,255,255,0.04))]" />
                            <div className="absolute inset-[28px] rounded-[28px] border border-white/10 bg-[#0B1219] shadow-[0_22px_50px_rgba(0,0,0,0.45)]">
                                <div className="absolute inset-x-0 top-0 flex h-[34px] items-center justify-between border-b border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] px-4 text-[10px] font-bold tracking-[0.22em] text-[#8FA5BB]">
                                    <span>SCOUT AP</span>
                                    <span>80KV / 10MA</span>
                                    <span>FOV 500</span>
                                </div>

                                <div className="absolute inset-x-[18px] bottom-[18px] top-[52px] flex gap-4">
                                    <div className="relative w-[56px] rounded-[16px] border border-white/6 bg-[linear-gradient(180deg,rgba(17,24,32,0.96),rgba(12,17,24,0.96))]">
                                        <div className="absolute inset-x-0 top-3 text-center text-[9px] font-black tracking-[0.28em] text-[#6C8197]">
                                            MM
                                        </div>
                                        {SCOUT_RULER_TICKS.map((tick) => (
                                            <div
                                                key={tick.label}
                                                className="absolute left-0 right-0"
                                                style={{ top: tick.top }}
                                            >
                                                <div className="flex items-center gap-2 px-2">
                                                    <div className="h-px flex-1 bg-[#506170]" />
                                                    <span className="w-[22px] text-right text-[9px] font-bold text-[#89A0B8]">{tick.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#263443] bg-[#101821] px-2 py-1 text-[9px] font-bold tracking-[0.18em] text-[#6C8197]">
                                            HFS
                                        </div>
                                    </div>

                                    <div className="relative flex-1 overflow-hidden rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,#0E151D_0%,#111A23_100%)]">
                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent_14%,transparent_86%,rgba(255,255,255,0.02))]" />
                                        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(143,165,187,0.45)_12%,rgba(143,165,187,0.45)_88%,transparent)]" />

                                        <div className="absolute inset-x-[16%] top-[16%] h-px border-t border-dashed border-[#B7C6D5]/55" />
                                        <div className="absolute right-[10%] top-[calc(16%-10px)] rounded border border-[#3D5368] bg-[#0F1821]/88 px-2 py-1 text-[9px] font-bold tracking-[0.16em] text-[#AFC3D8]">
                                            START
                                        </div>
                                        <div className="absolute inset-x-[16%] bottom-[16%] h-px border-t border-dashed border-[#B7C6D5]/55" />
                                        <div className="absolute right-[10%] bottom-[calc(16%-10px)] rounded border border-[#3D5368] bg-[#0F1821]/88 px-2 py-1 text-[9px] font-bold tracking-[0.16em] text-[#AFC3D8]">
                                            END
                                        </div>

                                        <div className="absolute inset-y-[6%] left-1/2 w-[290px] -translate-x-1/2 overflow-hidden rounded-[20px] border border-white/8 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.05),transparent_34%),linear-gradient(180deg,#141D27_0%,#182330_100%)] shadow-[inset_0_0_40px_rgba(255,255,255,0.03)]">
                                            <img
                                                src={lungCtSample}
                                                alt="定位像模拟出图"
                                                draggable={false}
                                                className="absolute inset-0 h-full w-full object-cover object-center select-none transition-opacity duration-300"
                                                style={{
                                                    clipPath: `inset(${(1 - renderProgress) * 100}% 0 0 0)`,
                                                    opacity: 0.24 + renderProgress * 0.72,
                                                    filter: `grayscale(1) contrast(${1.28 + renderProgress * 0.42}) brightness(${0.55 + renderProgress * 0.18}) blur(${Math.max(0, 1.2 - renderProgress)}px)`,
                                                    transform: "scale(1.55, 1.12)",
                                                    transformOrigin: "center center",
                                                }}
                                            />

                                            <div
                                                className="absolute inset-x-[10%] rounded-[999px] border border-[#E7F7FF]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
                                                style={{
                                                    top: "12%",
                                                    bottom: "12%",
                                                    opacity: 0.2 + renderProgress * 0.3,
                                                }}
                                            />

                                            <div
                                                className="pointer-events-none absolute left-[10%] right-[10%] h-[4px] bg-[linear-gradient(90deg,transparent,rgba(128,255,211,0.95),rgba(224,255,246,0.92),rgba(128,255,211,0.95),transparent)] shadow-[0_0_20px_rgba(94,234,212,0.95)] transition-opacity duration-200"
                                                style={{
                                                    top: `calc(${12 + Math.min(renderProgress, 0.995) * 76}% - 2px)`,
                                                    opacity: stage === "completed" ? 0 : 1,
                                                }}
                                            />

                                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.03))]" />
                                            <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.018)_0px,rgba(255,255,255,0.018)_1px,transparent_1px,transparent_3px)] opacity-25" />
                                            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(220,230,240,0.3)_10%,rgba(220,230,240,0.3)_90%,transparent)]" />
                                        </div>

                                        <div className="absolute inset-y-[14%] left-[calc(50%-170px)] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08),transparent)]" />
                                        <div className="absolute inset-y-[14%] right-[calc(50%-170px)] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08),transparent)]" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#28485A] bg-[#0E1821]/88 px-5 py-2 text-[11px] font-bold tracking-[0.18em] text-[#A7F3D0] shadow-[0_18px_36px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
                                {stage === "completed" ? "SCOUT READY" : "SCOUT RENDERING"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`absolute bottom-[84px] right-0 top-[88px] z-40 flex items-stretch transition-all duration-500 ${guideVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
                <div className="w-12 bg-gradient-to-l from-black/18 to-transparent" />
                <div className="pointer-events-auto flex h-full w-[235px] flex-col overflow-hidden rounded-l-2xl border border-r-0 border-[#CBD5E1] bg-[#EDF1F7] shadow-[-24px_0_48px_rgba(15,23,42,0.22)]">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="text-[14px] font-black text-slate-700">实体按键操作引导</div>
                        <div className="mt-1 text-[11px] font-medium text-slate-400">演示长按三秒后触发使能与曝光，并模拟右侧出图。</div>
                    </div>

                    <div className="flex flex-1 flex-col">
                        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="rounded-full border border-[#B9C7D6] bg-white/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                                    Physical Trigger
                                </div>
                                <div className="text-center">
                                    <div className="text-[16px] font-black text-slate-700">{guideTitle}</div>
                                    <div className="mt-1 text-[11px] font-medium text-slate-400">{statusText}</div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onMouseDown={startHold}
                                onMouseUp={stopHold}
                                onMouseLeave={stopHold}
                                onTouchStart={startHold}
                                onTouchEnd={stopHold}
                                className={`group flex h-[132px] w-[132px] items-center justify-center rounded-full border-[10px] shadow-[0_22px_40px_rgba(15,23,42,0.28)] transition-all duration-200 ${stage === "arming" || stage === "enabled" || stage === "exposing"
                                    ? "border-[#14532D] bg-[radial-gradient(circle_at_35%_30%,#7EF29C_0%,#22C55E_45%,#15803D_100%)] scale-[0.97]"
                                    : "border-[#1F6E44] bg-[radial-gradient(circle_at_35%_30%,#90F8AE_0%,#22C55E_40%,#166534_100%)] hover:scale-[1.02]"
                                    }`}
                            >
                                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-white/35 bg-white/10 shadow-[inset_0_10px_18px_rgba(255,255,255,0.2)]">
                                    <Zap size={30} className="text-white drop-shadow-[0_4px_10px_rgba(255,255,255,0.2)]" />
                                </div>
                            </button>

                            <div className="w-full rounded-2xl border border-[#D6E0EA] bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                    <span>长按进度</span>
                                    <span>{Math.round(holdProgress * 100)}%</span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#DCE6F1]">
                                    <div
                                        className="h-full rounded-full bg-[linear-gradient(90deg,#22C55E,#86EFAC)] transition-[width] duration-75"
                                        style={{ width: `${holdProgress * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 justify-end px-6 pb-5 pt-2">
                            <div className="min-w-[108px] rounded-full border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(233,239,247,0.96)_100%)] px-6 py-2.5 text-center text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.95)]">
                                {statusText}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
