import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Save, ChevronRight, Check } from "lucide-react";
import { LegacyPatientAvatar, LegacyToolbarIcon } from "./legacyVerticalCtVisuals";

const pingFang = '"PingFang SC", "Microsoft YaHei", sans-serif';

// ── 硬件配置定义 ──────────────────────────────────────────
type ConfigId = 1 | 2 | 3 | 4;

const CONFIGS: {
    id: ConfigId;
    hardware: string;
    modeH: boolean;
    modeV: boolean;
    note: string;
}[] = [
    { id: 1, hardware: "CT主机", modeH: false, modeV: true, note: "第三方座椅，软件不控制座椅运动" },
    { id: 2, hardware: "CT主机 + 扫描床", modeH: true, modeV: false, note: "仅卧姿扫描" },
    { id: 3, hardware: "CT主机 + 座椅", modeH: false, modeV: true, note: "仅坐姿扫描" },
    { id: 4, hardware: "CT主机 + 扫描床 + 座椅", modeH: true, modeV: true, note: "双模式，支持水平/垂直切换" },
];

// ── 参数默认值 ────────────────────────────────────────────
type Params = {
    ringTravelMin: string;
    ringTravelMax: string;
    ringStandbyPos: string;
    bedTravelMax: string;
    bedStandbyPos: string;
    chairAngleDefault: string;
    chairAngleMin: string;
    chairAngleMax: string;
    chairHeightDefault: string;
};

const DEFAULT_PARAMS: Params = {
    ringTravelMin: "0.0",
    ringTravelMax: "1200.0",
    ringStandbyPos: "0.0",
    bedTravelMax: "2000.0",
    bedStandbyPos: "0.0",
    chairAngleDefault: "90.0",
    chairAngleMin: "0.0",
    chairAngleMax: "110.0",
    chairHeightDefault: "500.0",
};

type IntegrationParams = {
    columnTiltStandby: string;
    columnTiltScan: string;
    ringTiltStandby: string;
    ringTiltScan: string;
    horizontalTravelScan: string;
    bedHeight: string;
    bedBoardAngle: string;
    chairPresetStandby: string;
    chairPresetScan: string;
};

const DEFAULT_INTEGRATION_PARAMS: IntegrationParams = {
    columnTiltStandby: "0",
    columnTiltScan: "0",
    ringTiltStandby: "0",
    ringTiltScan: "90",
    horizontalTravelScan: "1200",
    bedHeight: "800",
    bedBoardAngle: "0",
    chairPresetStandby: "预设位置0",
    chairPresetScan: "预设位置1",
};

// ── 小组件 ────────────────────────────────────────────────
function ParamRow({
    label,
    value,
    unit,
    onChange,
}: {
    label: string;
    value: string;
    unit?: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-[120px] shrink-0 text-[12px] font-semibold text-[#6c7f97]">{label}</span>
            <div className="flex flex-1 items-center gap-1.5">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-[30px] flex-1 rounded-[6px] border border-[#ccd8e8] bg-[#eef2f7] px-[10px] text-[13px] text-[#4d6890] outline-none focus:border-[#7aaad4]"
                />
                {unit && (
                    <span className="w-8 shrink-0 text-[12px] font-semibold text-[#9aadbe]">{unit}</span>
                )}
            </div>
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-2 mt-4 flex items-center gap-2 first:mt-0">
            <div className="h-px flex-1 bg-[#dde5ef]" />
            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-[#9fb3c8]">
                {children}
            </span>
            <div className="h-px flex-1 bg-[#dde5ef]" />
        </div>
    );
}

// ── 主界面 ────────────────────────────────────────────────
export default function LegacyVerticalCTServiceConfigScreen() {
    const [selectedConfig, setSelectedConfig] = useState<ConfigId>(4);
    const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
    const [integrationParams, setIntegrationParams] = useState<IntegrationParams>(DEFAULT_INTEGRATION_PARAMS);
    const [saved, setSaved] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = window.setInterval(() => setTime(new Date()), 60000);
        return () => window.clearInterval(t);
    }, []);

    const cfg = CONFIGS.find((c) => c.id === selectedConfig)!;

    function setParam(key: keyof Params, value: string) {
        setParams((p) => ({ ...p, [key]: value }));
        setSaved(false);
    }

    function handleReset() {
        setParams(DEFAULT_PARAMS);
        setIntegrationParams(DEFAULT_INTEGRATION_PARAMS);
        setSaved(false);
    }

    function handleSave() {
        setSaved(true);
    }

    function setIntegrationParam(key: keyof IntegrationParams, value: string) {
        setIntegrationParams((p) => ({ ...p, [key]: value }));
        setSaved(false);
    }

    return (
        <div
            className="flex h-[768px] w-[1024px] select-none flex-col overflow-hidden bg-[#DCE0ED]"
            style={{ fontFamily: pingFang }}
        >
            {/* ── Header（沿用模式确认界面风格）── */}
            <header className="relative h-[80px] shrink-0">
                <div className="absolute inset-0 bg-[#C1C5D5] opacity-50" />
                <div className="relative z-10 flex h-full items-center px-5">
                    {/* 左：用户标识（服务模式显示工程师账号） */}
                    <div className="relative h-[52px] w-[115px] rounded-[5px] border border-[#95B0E2] bg-[#D2D7E6]">
                        <LegacyPatientAvatar alt="工程师" />
                        <div className="absolute left-[44px] top-[10px] w-16 text-[12px] font-bold leading-tight text-slate-600">
                            <div>admin</div>
                            <div className="font-mono text-[10px] opacity-60">服务工程师</div>
                        </div>
                    </div>

                    {/* 中：时间 */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-center text-[#717579]">
                        <div className="text-[32px] font-black leading-none">
                            {time.getHours().toString().padStart(2, "0")}:
                            {time.getMinutes().toString().padStart(2, "0")}
                        </div>
                        <div className="mt-[9px] text-[15px] font-black leading-none">
                            {time.getMonth() + 1}月{time.getDate()}日
                        </div>
                    </div>

                    {/* 右：工具栏图标 */}
                    <LegacyToolbarIcon kind="emergency" alt="急停" left={756} />
                    <LegacyToolbarIcon kind="laser" alt="激光" left={820} />
                    <LegacyToolbarIcon kind="machine" alt="机器状态" left={884} />
                    <LegacyToolbarIcon kind="system" alt="系统管理" left={948} />
                </div>
            </header>

            {/* ── Main ── */}
            <main className="flex min-h-0 flex-1 gap-4 px-5 py-4">

                {/* Left: 硬件配置选择 */}
                <div className="flex w-[300px] shrink-0 flex-col gap-2">
                    <div className="mb-1 px-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        硬件配置
                    </div>

                    {CONFIGS.map((c) => {
                        const active = selectedConfig === c.id;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => { setSelectedConfig(c.id); setSaved(false); }}
                                className={`flex items-start gap-3 rounded-[14px] border p-3 text-left transition-all ${
                                    active
                                        ? "border-[#2A63BE]/30 bg-white shadow-md"
                                        : "border-transparent bg-white/50 hover:bg-white/70"
                                }`}
                            >
                                {/* Config number badge */}
                                <div
                                    className={`mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-black ${
                                        active
                                            ? "bg-[#2A63BE] text-white"
                                            : "bg-slate-200 text-slate-500"
                                    }`}
                                >
                                    {c.id}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className={`text-[13px] font-bold leading-snug ${active ? "text-[#2A63BE]" : "text-slate-600"}`}>
                                        {c.hardware}
                                    </div>
                                    <div className="mt-1 flex gap-1">
                                        {c.modeH && (
                                            <span className="rounded-[4px] bg-blue-50 px-1.5 py-[1px] text-[10px] font-bold text-blue-500">
                                                水平
                                            </span>
                                        )}
                                        {c.modeV && (
                                            <span className="rounded-[4px] bg-indigo-50 px-1.5 py-[1px] text-[10px] font-bold text-indigo-500">
                                                垂直
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 text-[11px] leading-snug text-slate-400">{c.note}</div>
                                </div>

                                <ChevronRight
                                    size={14}
                                    className={`mt-[4px] shrink-0 ${active ? "text-[#2A63BE]" : "text-slate-300"}`}
                                />
                            </button>
                        );
                    })}

                    {/* 重启提示 */}
                    <div className="mt-auto rounded-[12px] border border-amber-100 bg-amber-50/70 px-3 py-2.5 text-[11px] leading-relaxed text-amber-700">
                        配置项写入配置文件后，重启控制台软件方可生效。
                    </div>
                </div>

                {/* Right: 参数配置 */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">

                    {/* 当前配置说明条 */}
                    <div className="flex shrink-0 items-center gap-3 rounded-[14px] border border-white/80 bg-white/60 px-4 py-[10px] shadow-sm">
                        <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2A63BE] text-[12px] font-black text-white"
                        >
                            {cfg.id}
                        </div>
                        <div className="flex-1">
                            <span className="text-[13px] font-bold text-slate-700">{cfg.hardware}</span>
                            <span className="ml-2 text-[11px] text-slate-400">{cfg.note}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                        >
                            <RotateCcw size={12} />
                            恢复默认
                        </button>
                    </div>

                    {/* 参数表单 */}
                    <div className="min-h-0 flex-1 overflow-y-auto rounded-[16px] border border-slate-100 bg-white px-5 py-4 shadow-sm">

                        {/* 扫描环 — 所有配置均有 */}
                        <SectionLabel>扫描环</SectionLabel>
                        <div className="flex flex-col gap-2.5">
                            <ParamRow
                                label="行程范围（最小）"
                                value={params.ringTravelMin}
                                unit="mm"
                                onChange={(v) => setParam("ringTravelMin", v)}
                            />
                            <ParamRow
                                label="行程范围（最大）"
                                value={params.ringTravelMax}
                                unit="mm"
                                onChange={(v) => setParam("ringTravelMax", v)}
                            />
                            <ParamRow
                                label="待机位默认位置"
                                value={params.ringStandbyPos}
                                unit="mm"
                                onChange={(v) => setParam("ringStandbyPos", v)}
                            />
                        </div>

                        {/* 扫描床 — 配置2 / 配置4 */}
                        {(cfg.id === 2 || cfg.id === 4) && (
                            <>
                                <SectionLabel>扫描床</SectionLabel>
                                <div className="flex flex-col gap-2.5">
                                    <ParamRow
                                        label="最大行程"
                                        value={params.bedTravelMax}
                                        unit="mm"
                                        onChange={(v) => setParam("bedTravelMax", v)}
                                    />
                                    <ParamRow
                                        label="待机位默认位置"
                                        value={params.bedStandbyPos}
                                        unit="mm"
                                        onChange={(v) => setParam("bedStandbyPos", v)}
                                    />
                                </div>
                            </>
                        )}

                        {/* 座椅 — 配置3 / 配置4（配置1第三方座椅不配置） */}
                        {(cfg.id === 3 || cfg.id === 4) && (
                            <>
                                <SectionLabel>座椅</SectionLabel>
                                <div className="flex flex-col gap-2.5">
                                    <ParamRow
                                        label="靠背默认角度"
                                        value={params.chairAngleDefault}
                                        unit="°"
                                        onChange={(v) => setParam("chairAngleDefault", v)}
                                    />
                                    <ParamRow
                                        label="靠背角度（最小）"
                                        value={params.chairAngleMin}
                                        unit="°"
                                        onChange={(v) => setParam("chairAngleMin", v)}
                                    />
                                    <ParamRow
                                        label="靠背角度（最大）"
                                        value={params.chairAngleMax}
                                        unit="°"
                                        onChange={(v) => setParam("chairAngleMax", v)}
                                    />
                                    <ParamRow
                                        label="座椅默认高度"
                                        value={params.chairHeightDefault}
                                        unit="mm"
                                        onChange={(v) => setParam("chairHeightDefault", v)}
                                    />
                                </div>
                            </>
                        )}

                        {/* 配置1 提示 */}
                        {cfg.id === 1 && (
                            <div className="mt-4 rounded-[10px] border border-slate-100 bg-slate-50 px-4 py-3 text-[12px] leading-relaxed text-slate-400">
                                配置1 使用第三方座椅，软件不直接控制座椅运动，座椅参数由第三方系统管理，此处无需配置。
                            </div>
                        )}
                    </div>

                    {/* 新增：联调参数补充区（位于原界面下方，不破坏初版布局） */}
                    <div className="shrink-0 rounded-[14px] border border-[#dbe5f2] bg-white/70 px-5 py-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-[12px] font-black uppercase tracking-widest text-slate-400">联调参数补充</div>
                            <div className="text-[11px] text-slate-400">依据《坐姿治疗系统联调说明》补充</div>
                        </div>

                        <SectionLabel>CT姿态 / 扫描环</SectionLabel>
                        <div className="grid grid-cols-2 gap-2.5">
                            <ParamRow
                                label="立柱倾角（待机）"
                                value={integrationParams.columnTiltStandby}
                                unit="°"
                                onChange={(v) => setIntegrationParam("columnTiltStandby", v)}
                            />
                            <ParamRow
                                label="立柱倾角（扫描）"
                                value={integrationParams.columnTiltScan}
                                unit="°"
                                onChange={(v) => setIntegrationParam("columnTiltScan", v)}
                            />
                            <ParamRow
                                label="扫描环倾角（待机）"
                                value={integrationParams.ringTiltStandby}
                                unit="°"
                                onChange={(v) => setIntegrationParam("ringTiltStandby", v)}
                            />
                            <ParamRow
                                label="扫描环倾角（扫描）"
                                value={integrationParams.ringTiltScan}
                                unit="°"
                                onChange={(v) => setIntegrationParam("ringTiltScan", v)}
                            />
                            <ParamRow
                                label="水平行程（扫描）"
                                value={integrationParams.horizontalTravelScan}
                                unit="mm"
                                onChange={(v) => setIntegrationParam("horizontalTravelScan", v)}
                            />
                        </div>

                        {(cfg.id === 2 || cfg.id === 4) && (
                            <>
                                <SectionLabel>扫描床补充</SectionLabel>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <ParamRow
                                        label="床高度"
                                        value={integrationParams.bedHeight}
                                        unit="mm"
                                        onChange={(v) => setIntegrationParam("bedHeight", v)}
                                    />
                                    <ParamRow
                                        label="床板角度"
                                        value={integrationParams.bedBoardAngle}
                                        unit="°"
                                        onChange={(v) => setIntegrationParam("bedBoardAngle", v)}
                                    />
                                </div>
                            </>
                        )}

                        {(cfg.id === 3 || cfg.id === 4) && (
                            <>
                                <SectionLabel>座椅预设位补充</SectionLabel>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <ParamRow
                                        label="座椅待机预设"
                                        value={integrationParams.chairPresetStandby}
                                        onChange={(v) => setIntegrationParam("chairPresetStandby", v)}
                                    />
                                    <ParamRow
                                        label="座椅扫描预设"
                                        value={integrationParams.chairPresetScan}
                                        onChange={(v) => setIntegrationParam("chairPresetScan", v)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Footer（仿旧版截图样式）── */}
            <footer className="flex h-[64px] shrink-0 items-center border-t border-[#b8c3d8] bg-[#C8D0E2] px-5">
                {/* 左：返回 + 页面标题 */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="flex h-[38px] items-center gap-2 rounded-[6px] border border-[#b0bdd0] bg-white px-4 text-[13px] font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                    >
                        <ArrowLeft size={15} strokeWidth={2.2} />
                        返回
                    </button>
                    <div className="h-5 w-px bg-[#b0bdd0]" />
                    <span className="text-[14px] font-bold text-slate-600">服务模式 · 系统配置</span>
                </div>

                {/* 右：保存按钮 */}
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={handleSave}
                        className={`flex h-[38px] items-center gap-2 rounded-[6px] px-5 text-[13px] font-bold shadow-sm transition-all active:scale-95 ${
                            saved
                                ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
                                : "bg-[#2A63BE] text-white hover:bg-[#1e52a8]"
                        }`}
                    >
                        {saved ? (
                            <>
                                <Check size={15} />
                                已写入配置文件
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                写入配置文件
                            </>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}
