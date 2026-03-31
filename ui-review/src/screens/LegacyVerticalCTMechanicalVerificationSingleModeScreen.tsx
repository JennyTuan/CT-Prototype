import { useMemo, useState } from "react";
import {
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Move,
    ArrowLeftRight,
    Telescope,
    View,
    Share2,
    Lock,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";
import LegacyVerticalCTModeSwitchContent from "./LegacyVerticalCTModeSwitchContent";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

// 单模式配置（配置1 / 2 / 3）：模式出厂设定，无需切换
// currentMode 由配置文件注入，此处以"垂直模式"为示例
const currentMode = "垂直模式";

export default function LegacyVerticalCTMechanicalVerificationSingleModeScreen() {
    const [standbyReady] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    const standbyDetails = useMemo(
        () => [
            { id: "chair", name: "座椅", status: standbyReady },
            { id: "ring", name: "扫描环", status: true },
        ],
        [standbyReady]
    );

    const canProceed = standbyReady;

    return (
        <div
            className="flex h-[768px] w-[1024px] select-none flex-col overflow-hidden bg-[#DCE0ED]"
            style={{ fontFamily: pingFang }}
        >
            {/* ── Header ── */}
            <header className="relative h-[80px] shrink-0">
                <div className="absolute inset-0 bg-[#C1C5D5] opacity-50" />
                <div className="relative z-10 flex h-full items-center px-5">
                    <div className="relative h-[52px] w-[115px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6]">
                        <LegacyPatientAvatar alt="患者头像" />
                        <div className="absolute left-[44px] top-[10px] w-16 text-[12px] font-bold leading-tight text-slate-600">
                            <div>欧阳祖华</div>
                            <div className="font-mono text-[10px] opacity-60">000001</div>
                        </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-center text-[#717579]">
                        <div className="text-[32px] font-black leading-none">12:24</div>
                        <div className="mt-[9px] text-[15px] font-black leading-none">3月31日</div>
                    </div>
                    <LegacyToolbarIcon kind="emergency" alt="急停" left={756} />
                    <LegacyToolbarIcon kind="laser" alt="激光" left={820} />
                    <LegacyToolbarIcon kind="machine" alt="机器状态" left={884} />
                    <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
                </div>
            </header>

            {/* ── Main ── */}
            <main className="flex min-h-0 flex-1 gap-4 px-5 py-5">

                {/* Left column — fills full height */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">

                    {/* Mode indicator — fixed height */}
                    <div className="flex shrink-0 items-center gap-3 rounded-[14px] border border-white/80 bg-white/60 px-4 py-[10px] shadow-sm">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2A63BE]">
                            <Lock size={13} strokeWidth={2.2} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[11px] font-bold tracking-widest text-slate-400">
                                当前扫描模式 · 出厂设定
                            </span>
                            <span className="text-[15px] font-black text-[#2A63BE]">{currentMode}</span>
                        </div>
                    </div>

                    {/* Standby card — flex-1, fills remaining height */}
                    <div
                        className={`flex min-h-0 flex-1 flex-col rounded-[16px] border bg-white p-4 shadow-sm ${
                            standbyReady ? "border-emerald-100" : "border-orange-100"
                        }`}
                    >
                        {/* Section header */}
                        <div className="mb-3 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-black tracking-widest text-slate-300">01</span>
                                <span className="text-[15px] font-bold text-slate-700">待机位状态</span>
                            </div>
                            <div
                                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-bold ${
                                    standbyReady
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-orange-50 text-orange-600"
                                }`}
                            >
                                {standbyReady ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                <span>{standbyReady ? "全部就绪" : "位置未就绪"}</span>
                            </div>
                        </div>

                        {/* Device cards — grid fills remaining card height */}
                        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
                            {standbyDetails.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex min-h-0 flex-col overflow-hidden rounded-[12px] border transition-all ${
                                        item.status
                                            ? "border-emerald-100 bg-emerald-50/20"
                                            : "border-orange-100 bg-orange-50/10"
                                    }`}
                                >
                                    {/* Illustration area — flex-1, grows to fill card
                                        ↓ 设计师在此处替换为硬件插画 ↓ */}
                                    <div
                                        className={`flex min-h-0 flex-1 items-center justify-center border-b border-dashed ${
                                            item.status
                                                ? "border-emerald-100 bg-emerald-50/30"
                                                : "border-slate-100 bg-slate-50/60"
                                        }`}
                                    >
                                        <span className="text-[11px] font-medium text-slate-300">硬件插画</span>
                                    </div>

                                    {/* Info strip — fixed height at bottom */}
                                    <div className="flex shrink-0 items-center justify-between px-4 py-3">
                                        <span className="text-[15px] font-bold text-slate-700">{item.name}</span>
                                        <div
                                            className={`flex items-center gap-1.5 text-[12px] font-bold ${
                                                item.status ? "text-emerald-600" : "text-orange-500"
                                            }`}
                                        >
                                            {item.status ? (
                                                <CheckCircle2 size={13} />
                                            ) : (
                                                <Move size={13} className="animate-pulse" />
                                            )}
                                            <span>{item.status ? "已在待机位" : "偏离待机位"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column — same full height as left */}
                <aside
                    className={`flex shrink-0 flex-col gap-3 ${
                        isSwitching ? "w-fit" : "w-[210px]"
                    }`}
                >
                    {isSwitching ? (
                        <LegacyVerticalCTModeSwitchContent onCancel={() => setIsSwitching(false)} />
                    ) : (
                        <>
                            {/* Status card — flex-1, grows to fill height above buttons */}
                            <div
                                className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border bg-white shadow-sm ${
                                    canProceed ? "border-emerald-100" : "border-slate-100"
                                }`}
                            >
                                {/* Status — vertically centered */}
                                <div
                                    className={`flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 ${
                                        canProceed ? "bg-emerald-50/40" : ""
                                    }`}
                                >
                                    <div
                                        className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${
                                            canProceed
                                                ? "bg-emerald-100 text-emerald-500"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {canProceed ? <CheckCircle2 size={30} /> : <AlertCircle size={30} />}
                                    </div>
                                    <div className="text-[14px] font-black text-slate-700">
                                        {canProceed ? "校验已通过" : "校验未通过"}
                                    </div>
                                    {!canProceed && (
                                        <div className="text-center text-[11px] leading-relaxed text-slate-400">
                                            完成下列操作后可继续
                                        </div>
                                    )}
                                </div>

                                {/* Failed items — pinned to card bottom */}
                                {!canProceed && (
                                    <div className="shrink-0 border-t border-slate-100 px-4 py-3">
                                        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            待处理项目
                                        </div>
                                        <div className="flex items-start gap-2 text-[12px] font-medium text-slate-600">
                                            <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                                            <span>移动各部件至待机位</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons — fixed at bottom */}
                            <div className="shrink-0 space-y-2">
                                {!canProceed ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsSwitching(true)}
                                        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#10b981] text-white shadow-md shadow-emerald-100 transition-all hover:bg-[#059669] active:scale-95"
                                    >
                                        <RefreshCw size={18} />
                                        <span className="text-[15px] font-bold">一键复位</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#2A63BE] text-white shadow-md shadow-blue-100 transition-all active:scale-95"
                                    >
                                        <span className="text-[15px] font-bold">进入患者列表</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="h-9 w-full rounded-xl text-[13px] font-bold text-slate-400 transition-colors hover:bg-white/50"
                                >
                                    返回首页
                                </button>
                            </div>
                        </>
                    )}
                </aside>
            </main>

            {/* ── Footer ── */}
            <footer className="h-[80px] shrink-0 bg-[#88A3D2] px-[18px] pt-[8px]">
                <div className="grid h-[64px] w-full grid-cols-4 gap-[2px]">
                    <button
                        type="button"
                        className="flex h-full items-center justify-center gap-4 rounded-[12px] border border-[#5F86CC] bg-[linear-gradient(180deg,#164CA7_0%,#2A63BE_100%)] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                    >
                        <ArrowLeftRight size={34} strokeWidth={2.1} />
                        <span className="text-[20px] font-semibold tracking-[0.06em]">位置信息</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <Telescope size={32} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">扫描成像</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <View size={30} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">成像视图</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-full cursor-not-allowed items-center justify-center gap-3 rounded-[10px] bg-[#D7DBE5] text-white/50"
                    >
                        <Share2 size={30} />
                        <span className="text-[18px] font-medium tracking-[0.03em]">传输</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
