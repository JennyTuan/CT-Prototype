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
    ArrowRight,
} from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

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

    const currentPhysicalMode: ModeKey = modeMatched
        ? selectedMode
        : selectedMode === "horizontal"
            ? "vertical"
            : "horizontal";

    const selectedModeLabel = selectedMode === "horizontal" ? "水平模式" : "垂直模式";
    const physicalModeLabel = currentPhysicalMode === "horizontal" ? "水平模式" : "垂直模式";

    const failedItems = [
        configSupportsModeSwitch && !modeMatched && `切换机械至${selectedModeLabel}`,
        !standbyReady && "移动各部件至待机位",
    ].filter(Boolean) as string[];

    return (
        <div
            className="flex h-[768px] w-[1024px] select-none flex-col overflow-hidden bg-[#DCE0ED]"
            style={{ fontFamily: pingFang }}
        >
            {/* Header */}
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

            {/* Main */}
            <main className="flex flex-1 gap-4 overflow-hidden px-5 py-4">
                {/* Left: verification content */}
                <div className="flex flex-1 flex-col gap-3 min-w-0">

                    {/* Mode selector tab bar — only for config4 */}
                    {configSupportsModeSwitch && (
                        <div className="flex gap-1.5 rounded-[14px] bg-white/70 p-1.5 shadow-sm border border-white/80 shrink-0">
                            {(["horizontal", "vertical"] as ModeKey[]).map((mode) => {
                                const label = mode === "horizontal" ? "水平模式" : "垂直模式";
                                const active = selectedMode === mode;
                                return (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setSelectedMode(mode)}
                                        className={`flex-1 rounded-[10px] py-[10px] text-[15px] font-bold transition-all ${
                                            active
                                                ? "bg-[#2A63BE] text-white shadow-md"
                                                : "text-[#717A8D] hover:bg-white/60"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Check 1: Mode match — only for config4 */}
                    {configSupportsModeSwitch && (
                        <div
                            className={`rounded-[16px] border bg-white p-4 shadow-sm shrink-0 ${
                                modeMatched ? "border-emerald-100" : "border-orange-100"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-black tracking-widest text-slate-300">01</span>
                                    <span className="text-[15px] font-bold text-slate-700">扫描模式匹配</span>
                                </div>
                                <div
                                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-bold ${
                                        modeMatched
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-orange-50 text-orange-600"
                                    }`}
                                >
                                    {modeMatched ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                    <span>{modeMatched ? "已匹配" : "模式不匹配"}</span>
                                </div>
                            </div>

                            <div className="flex items-stretch gap-3">
                                <div className="flex-1 rounded-[10px] bg-blue-50 border border-blue-100 px-4 py-3 text-center">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">已选目标</div>
                                    <div className="text-[17px] font-black text-blue-700">{selectedModeLabel}</div>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight
                                        size={18}
                                        className={modeMatched ? "text-emerald-400" : "text-orange-300"}
                                    />
                                </div>
                                <div
                                    className={`flex-1 rounded-[10px] border px-4 py-3 text-center ${
                                        modeMatched
                                            ? "bg-emerald-50 border-emerald-100"
                                            : "bg-orange-50 border-orange-100"
                                    }`}
                                >
                                    <div
                                        className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                                            modeMatched ? "text-emerald-400" : "text-orange-400"
                                        }`}
                                    >
                                        当前物理位置
                                    </div>
                                    <div
                                        className={`text-[17px] font-black ${
                                            modeMatched ? "text-emerald-700" : "text-orange-600"
                                        }`}
                                    >
                                        {physicalModeLabel}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Check 2: Standby positions */}
                    <div
                        className={`flex-1 rounded-[16px] border bg-white p-4 shadow-sm flex flex-col ${
                            standbyReady ? "border-emerald-100" : "border-orange-100"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-black tracking-widest text-slate-300">
                                    {configSupportsModeSwitch ? "02" : "01"}
                                </span>
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

                        <div className="grid flex-1 grid-cols-3 gap-3">
                            {standbyDetails.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex flex-col items-center justify-center gap-3 rounded-[14px] border transition-all ${
                                        item.status
                                            ? "border-emerald-100 bg-emerald-50/30"
                                            : "border-orange-100 bg-orange-50/20"
                                    }`}
                                >
                                    <div className={item.status ? "text-emerald-500" : "text-orange-400"}>
                                        {item.status ? (
                                            <CheckCircle2 size={40} />
                                        ) : (
                                            <Move size={40} className="animate-pulse" />
                                        )}
                                    </div>
                                    <div className="text-[16px] font-bold text-slate-600">{item.name}</div>
                                    <div
                                        className={`text-[12px] font-bold ${
                                            item.status ? "text-emerald-600" : "text-orange-500"
                                        }`}
                                    >
                                        {item.status ? "已在待机位" : "偏离待机位"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Status & Action */}
                <aside className="flex w-[210px] shrink-0 flex-col gap-3">
                    {/* Status summary */}
                    <div
                        className={`rounded-[16px] border bg-white p-4 shadow-sm text-center ${
                            canProceed ? "border-emerald-100" : "border-slate-100"
                        }`}
                    >
                        <div
                            className={`mx-auto mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-full ${
                                canProceed ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"
                            }`}
                        >
                            {canProceed ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
                        </div>
                        <div className="text-[15px] font-black text-slate-700">
                            {canProceed ? "校验已通过" : "校验未通过"}
                        </div>
                        {!canProceed && (
                            <div className="mt-1.5 text-[12px] leading-relaxed text-slate-400">
                                完成下列操作后可继续
                            </div>
                        )}
                    </div>

                    {/* Failed items */}
                    {!canProceed && failedItems.length > 0 && (
                        <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                待处理项目
                            </div>
                            <div className="space-y-2">
                                {failedItems.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-2 text-[13px] font-medium text-slate-600"
                                    >
                                        <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons — push to bottom */}
                    <div className="mt-auto space-y-2">
                        {!canProceed ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setModeMatched(true);
                                    setStandbyReady(true);
                                }}
                                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#10b981] text-white shadow-lg shadow-emerald-100 transition-all hover:bg-[#059669] active:scale-95"
                            >
                                <RefreshCw size={20} />
                                <span className="text-[16px] font-bold">
                                    {configSupportsModeSwitch ? "一键模式切换" : "一键复位"}
                                </span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#2A63BE] text-white shadow-lg shadow-blue-100 transition-all active:scale-95"
                            >
                                <span className="text-[16px] font-bold">进入患者列表</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className="h-10 w-full rounded-xl text-[14px] font-bold text-slate-400 transition-colors hover:bg-white/50"
                        >
                            返回首页
                        </button>
                    </div>
                </aside>
            </main>

            {/* Footer */}
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
