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
} from "lucide-react";
import LegacyVerticalCTHeader from "./LegacyVerticalCTHeader";
import LegacyVerticalCTModeSwitchContent from "./LegacyVerticalCTModeSwitchContent";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

type ModeKey = "horizontal" | "vertical";
type ChairControl = "integrated" | "third-party";

type LegacyVerticalCTMechanicalVerificationScreenProps = {
    defaultSelectedMode?: ModeKey;
    chairControl?: ChairControl;
};

export default function LegacyVerticalCTMechanicalVerificationScreen({
    defaultSelectedMode = "horizontal",
    chairControl = "integrated",
}: LegacyVerticalCTMechanicalVerificationScreenProps = {}) {
    const configSupportsModeSwitch = true;
    const usesThirdPartyChair = chairControl === "third-party";

    const [modeMatched, setModeMatched] = useState(false);
    const [standbyReady, setStandbyReady] = useState(false);
    const [thirdPartyChairConfirmed, setThirdPartyChairConfirmed] = useState(!usesThirdPartyChair);
    const [isSwitching, setIsSwitching] = useState(false);
    const [colorPressed, setColorPressed] = useState(false);
    const selectedMode: ModeKey = defaultSelectedMode;

    const panelPhase: "mode-color" | "mode-enable" | "standby" = modeMatched
        ? "standby"
        : colorPressed
        ? "mode-enable"
        : "mode-color";

    const handleAdvance = () => {
        if (!modeMatched) {
            if (!colorPressed) {
                setColorPressed(true);
                return;
            }
            setModeMatched(true);
            setColorPressed(false);
            return;
        }
        if (!standbyReady) {
            setStandbyReady(true);
            setIsSwitching(false);
        }
    };

    const chairReady = usesThirdPartyChair ? thirdPartyChairConfirmed : standbyReady;
    const allStandbyReady = standbyReady && chairReady;

    const standbyDetails = useMemo(
        () => [
            { id: "bed", name: "扫描床", status: standbyReady, image: "/medical_table_transparent.png", readyLabel: "已在待机位", pendingLabel: "偏离待机位" },
            {
                id: "chair",
                name: usesThirdPartyChair ? "第三方座椅" : "座椅",
                status: chairReady,
                image: "/seat_transparent.png",
                readyLabel: usesThirdPartyChair ? "已人工确认" : "已在待机位",
                pendingLabel: usesThirdPartyChair ? "待人工确认" : "偏离待机位",
            },
            { id: "ring", name: "扫描环", status: true, image: "/ceiling_device_transparent.png", readyLabel: "已在待机位", pendingLabel: "偏离待机位" },
        ],
        [chairReady, standbyReady, usesThirdPartyChair]
    );

    const canProceed = configSupportsModeSwitch ? modeMatched && allStandbyReady : allStandbyReady;

    const currentPhysicalMode: ModeKey = modeMatched
        ? selectedMode
        : selectedMode === "horizontal" ? "vertical" : "horizontal";

    const selectedModeLabel = selectedMode === "horizontal" ? "水平模式" : "垂直模式";
    const physicalModeLabel = currentPhysicalMode === "horizontal" ? "水平模式" : "垂直模式";

    const failedItems = [
        configSupportsModeSwitch && !modeMatched && `切换机械至${selectedModeLabel}`,
        !standbyReady && (usesThirdPartyChair ? "移动本厂扫描床至待机位" : "移动各部件至待机位"),
        usesThirdPartyChair && !thirdPartyChairConfirmed && `人工确认第三方座椅已到达${selectedModeLabel}待机位`,
    ].filter(Boolean) as string[];

    const handlePrimaryAction = () => {
        if (!modeMatched || !standbyReady) {
            setIsSwitching(true);
            return;
        }
        setThirdPartyChairConfirmed(true);
    };

    return (
        <div
            className="flex h-[768px] w-[1024px] select-none flex-col overflow-hidden bg-[#DCE0ED]"
            style={{ fontFamily: pingFang }}
        >
            {/* ── Header ── */}
            <LegacyVerticalCTHeader mode={selectedMode} />

            {/* ── Main ── */}
            <main className="flex min-h-0 flex-1 gap-4 px-5 py-5">

                {/* Left column — fills full height */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">

                    {/* Check 01: Mode match — fixed height, dual-mode configurations */}
                    {configSupportsModeSwitch && (
                        <div
                            className={`shrink-0 rounded-[16px] border bg-white p-4 shadow-sm ${
                                modeMatched ? "border-emerald-100" : "border-orange-100"
                            }`}
                        >
                            <div className="mb-3 flex items-center justify-between">
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

                            <div className="flex items-stretch gap-0">
                                <div className="flex-1 rounded-l-[10px] border border-blue-100 bg-blue-50 px-4 py-3 text-center">
                                    <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                        已选模式
                                    </div>
                                    <div className="text-[17px] font-black text-blue-700">{selectedModeLabel}</div>
                                </div>

                                <div className="z-10 -mx-px flex items-center justify-center">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-[13px] font-black shadow-sm ${
                                            modeMatched
                                                ? "border-emerald-300 text-emerald-500"
                                                : "border-orange-300 text-orange-500"
                                        }`}
                                    >
                                        {modeMatched ? "=" : "≠"}
                                    </div>
                                </div>

                                <div
                                    className={`flex-1 rounded-r-[10px] border px-4 py-3 text-center ${
                                        modeMatched
                                            ? "border-emerald-100 bg-emerald-50"
                                            : "border-orange-100 bg-orange-50"
                                    }`}
                                >
                                    <div
                                        className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${
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

                    {/* Check 02: Standby — flex-1, fills remaining height */}
                    <div
                        className={`flex min-h-0 flex-1 flex-col rounded-[16px] border bg-white p-4 shadow-sm ${
                            allStandbyReady ? "border-emerald-100" : "border-orange-100"
                        }`}
                    >
                        <div className="mb-3 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-black tracking-widest text-slate-300">
                                    {configSupportsModeSwitch ? "02" : "01"}
                                </span>
                                <span className="text-[15px] font-bold text-slate-700">待机位状态</span>
                            </div>
                            <div
                                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-bold ${
                                    allStandbyReady
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-orange-50 text-orange-600"
                                }`}
                            >
                                {allStandbyReady ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                <span>{allStandbyReady ? "全部就绪" : usesThirdPartyChair && standbyReady ? "待人工确认" : "位置未就绪"}</span>
                            </div>
                        </div>

                        {/* Device cards — 3 cols, fill remaining card height */}
                        <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
                            {standbyDetails.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex min-h-0 flex-col overflow-hidden rounded-[12px] border transition-all ${
                                        item.status
                                            ? "border-emerald-100 bg-emerald-50/20"
                                            : "border-orange-100 bg-orange-50/10"
                                    }`}
                                >
                                    <div
                                        className={`flex min-h-0 flex-1 items-center justify-center border-b border-dashed p-3 ${
                                            item.status
                                                ? "border-emerald-100 bg-emerald-50/30"
                                                : "border-slate-100 bg-slate-50/60"
                                        }`}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="block h-full w-full object-contain"
                                        />
                                    </div>

                                    {/* Info strip — fixed at bottom */}
                                    <div className="flex shrink-0 items-center justify-between px-3 py-3">
                                        <span className="text-[14px] font-bold text-slate-700">{item.name}</span>
                                        <div
                                            className={`flex items-center gap-1 text-[11px] font-bold ${
                                                item.status ? "text-emerald-600" : "text-orange-500"
                                            }`}
                                        >
                                            {item.status ? (
                                                <CheckCircle2 size={12} />
                                            ) : (
                                                <Move size={12} className="animate-pulse" />
                                            )}
                                            <span>{item.status ? item.readyLabel : item.pendingLabel}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <aside
                    className={`flex shrink-0 flex-col gap-3 ${
                        isSwitching ? "w-fit" : "w-[210px]"
                    }`}
                >
                    {isSwitching ? (
                        <LegacyVerticalCTModeSwitchContent
                            phase={panelPhase}
                            targetMode={selectedMode}
                            onAdvance={handleAdvance}
                            onCancel={() => setIsSwitching(false)}
                        />
                    ) : (
                        <>
                            {/* Status card — flex-1, no orphaned gap */}
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
                                {!canProceed && failedItems.length > 0 && (
                                    <div className="shrink-0 border-t border-slate-100 px-4 py-3">
                                        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            待处理项目
                                        </div>
                                        <div className="space-y-2">
                                            {failedItems.map((item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-start gap-2 text-[12px] font-medium text-slate-600"
                                                >
                                                    <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons — fixed at bottom */}
                            <div className="shrink-0 space-y-2">
                                {!canProceed ? (
                                    <button
                                        type="button"
                                        onClick={handlePrimaryAction}
                                        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#10b981] text-white shadow-md shadow-emerald-100 transition-all hover:bg-[#059669] active:scale-95"
                                    >
                                        <RefreshCw size={18} />
                                        <span className="text-[15px] font-bold">
                                            {!modeMatched
                                                ? "一键模式切换"
                                                : !standbyReady
                                                ? "一键就位"
                                                : "确认第三方座椅待机位"}
                                        </span>
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
