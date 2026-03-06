import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDown, ChevronRight, Info, User, X } from "lucide-react";
import { loadProtocolCasesFromDb, type RawProtocolCase, type RawRecon, type RawSequence } from "../lib/protocolDb";

type PanelKind = "protocol" | "sequence" | "recon";

const fieldLabel: Record<string, string> = {
    id: "ID",
    name: "名称",
    region: "区域",
    scanLocationLabel: "扫描部位",
    supportedPositions: "支持摆位",
    supportedModes: "支持模式",
    sequenceType: "序列类型",
    mode: "扫描模式",
    scanLength: "扫描长度",
    scanningDirection: "扫描方向",
    mA: "mA",
    kV: "kV",
    angle: "角度",
    rotationTime: "旋转时间",
    collimation: "准直",
    scoutFOV: "Scout FOV",
    dom: "DOM",
    pitch: "Pitch",
    scanIncrement: "扫描增量",
    cycleCount: "循环次数",
    sliceThickness: "层厚",
    interval: "间隔",
    kernel: "重建核",
    windowCenter: "窗位",
    windowWidth: "窗宽",
    fov: "FOV",
    matrix: "矩阵",
    centerX: "中心X",
    centerY: "中心Y",
    metalReduction: "金属伪影抑制",
};

const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "是" : "否";
    return String(value);
};

const titleClass =
    "text-[9px] font-black uppercase tracking-wider text-[#90A4AE]";
const valueClass =
    "h-[36px] mt-1 rounded-md border border-[#B0C4DE]/50 bg-white px-3 flex items-center text-[12px] font-bold text-[#37474F]";

function FieldGrid({ fields }: { fields: Array<{ label: string; value: string }> }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
                <div key={field.label} className="p-2 bg-[#F8FAFC] border border-[#EEF2F9] rounded-md">
                    <div className={titleClass}>{field.label}</div>
                    <div className={valueClass}>{field.value}</div>
                </div>
            ))}
        </div>
    );
}

export default function WT32ProtocolDetailScreen() {
    const protocolCases = useLiveQuery(
        () => loadProtocolCasesFromDb(),
        [],
        [] as RawProtocolCase[]
    );

    const [selectedProtocolId, setSelectedProtocolId] = useState("");
    const [selectedSequenceId, setSelectedSequenceId] = useState("");
    const [selectedReconId, setSelectedReconId] = useState("");
    const [expandedProtocolIds, setExpandedProtocolIds] = useState<string[]>([]);
    const [expandedSequenceKeys, setExpandedSequenceKeys] = useState<string[]>([]);

    const resolvedProtocol = useMemo(() => {
        if (protocolCases.length === 0) return undefined;
        return protocolCases.find((p) => p.protocol.id === selectedProtocolId) ?? protocolCases[0];
    }, [protocolCases, selectedProtocolId]);

    const resolvedSequence: RawSequence | undefined = useMemo(() => {
        if (!resolvedProtocol) return undefined;
        return resolvedProtocol.sequences.find((s) => s.id === selectedSequenceId)
            ?? (selectedSequenceId ? undefined : resolvedProtocol.sequences[0]);
    }, [resolvedProtocol, selectedSequenceId]);

    const resolvedRecon: RawRecon | undefined = useMemo(() => {
        if (!resolvedSequence) return undefined;
        return resolvedSequence.reconstructionParams.find((r) => r.id === selectedReconId);
    }, [resolvedSequence, selectedReconId]);

    const panelKind: PanelKind = resolvedRecon ? "recon" : resolvedSequence ? "sequence" : "protocol";

    const protocolFields = resolvedProtocol
        ? [
            { label: "协议ID", value: resolvedProtocol.protocol.id },
            { label: "协议名称", value: resolvedProtocol.protocol.name },
            { label: "区域", value: resolvedProtocol.protocol.region },
            { label: "扫描部位", value: resolvedProtocol.protocol.scanLocationLabel },
            { label: "支持摆位", value: formatValue(resolvedProtocol.protocol.supportedPositions) },
            { label: "支持模式", value: formatValue(resolvedProtocol.protocol.supportedModes) },
        ]
        : [];

    const sequenceFields = resolvedSequence
        ? [
            { label: "序列ID", value: resolvedSequence.id },
            { label: "序列名称", value: resolvedSequence.name },
            { label: "序列类型", value: resolvedSequence.sequenceType },
            { label: "扫描模式", value: resolvedSequence.mode },
            ...Object.entries(resolvedSequence.scanParams).map(([k, v]) => ({
                label: fieldLabel[k] || k,
                value: formatValue(v),
            })),
        ]
        : [];

    const reconFields = resolvedRecon
        ? [
            { label: "重建ID", value: resolvedRecon.id },
            { label: "重建名称", value: resolvedRecon.name },
            ...Object.entries(resolvedRecon.params).map(([k, v]) => ({
                label: fieldLabel[k] || k,
                value: formatValue(v),
            })),
        ]
        : [];

    const panelTitle =
        panelKind === "protocol"
            ? "协议基本信息"
            : panelKind === "sequence"
                ? `序列参数：${resolvedSequence?.name || ""}`
                : `重建参数：${resolvedRecon?.name || ""}`;

    const panelSubtitle =
        panelKind === "protocol"
            ? "Protocol profile and defaults"
            : panelKind === "sequence"
                ? "Acquisition and scan settings"
                : "Reconstruction settings";

    return (
        <div className="w-[1024px] h-[768px] bg-[#EEF2F9] text-[#37474F] flex flex-col overflow-hidden select-none font-sans border border-[#B0C4DE] rounded-md">
            <header className="h-[80px] px-6 flex items-center justify-between border-b border-[#B0C4DE] bg-[#E8EAF1] shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-[#4D94FF] text-white flex items-center justify-center">
                        <User size={18} />
                    </div>
                    <div>
                        <div className="text-[16px] font-black">协议详情</div>
                        <div className="text-[11px] font-bold text-[#546E7A]">层级结构查看与参数核对</div>
                    </div>
                </div>
                <button className="text-[#90A4AE] hover:text-[#546E7A] transition-colors">
                    <X size={22} />
                </button>
            </header>

            <main className="flex-1 flex overflow-hidden p-2 gap-[12px]">
                <aside className="w-[300px] bg-white rounded-md border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden shrink-0">
                    <div className="h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] px-3 flex items-center justify-between">
                        <span className="text-[11px] font-black tracking-wider uppercase text-[#37474F]">协议结构</span>
                        <span className="text-[10px] font-bold text-[#90A4AE]">{protocolCases.length} 项</span>
                    </div>

                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                        {protocolCases.length === 0 && (
                            <div className="p-3 text-[12px] font-bold text-[#90A4AE] bg-[#F8FAFC] border border-[#EEF2F9] rounded-md">
                                暂无协议数据
                            </div>
                        )}

                        {protocolCases.map((protocolCase) => {
                            const protocolId = protocolCase.protocol.id;
                            const protocolExpanded = expandedProtocolIds.includes(protocolId);
                            const protocolActive = resolvedProtocol?.protocol.id === protocolId && panelKind === "protocol";

                            return (
                                <div key={protocolId} className="rounded-md border border-[#EEF2F9] p-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedProtocolId(protocolId);
                                            setSelectedSequenceId("");
                                            setSelectedReconId("");
                                        }}
                                        className={`w-full h-[34px] rounded-md px-2 flex items-center justify-between text-[12px] font-black transition-all ${
                                            protocolActive ? "bg-[#4D94FF] text-white" : "text-[#546E7A] hover:bg-[#EEF2F9]"
                                        }`}
                                    >
                                        <span className="truncate">{protocolCase.protocol.name}</span>
                                        <span
                                            className="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-white/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedProtocolIds((prev) =>
                                                    prev.includes(protocolId) ? prev.filter((id) => id !== protocolId) : [...prev, protocolId]
                                                );
                                            }}
                                        >
                                            {protocolExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </span>
                                    </button>

                                    {protocolExpanded && (
                                        <div className="mt-2 ml-2 border-l border-[#EEF2F9] pl-2 space-y-1">
                                            {protocolCase.sequences.map((sequence) => {
                                                const seqKey = `${protocolId}-${sequence.id}`;
                                                const seqExpanded = expandedSequenceKeys.includes(seqKey);
                                                const seqActive = resolvedSequence?.id === sequence.id && panelKind === "sequence";

                                                return (
                                                    <div key={seqKey}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedProtocolId(protocolId);
                                                                setSelectedSequenceId(sequence.id);
                                                                setSelectedReconId("");
                                                            }}
                                                            className={`w-full h-[30px] rounded-md px-2 flex items-center justify-between text-[11px] font-bold transition-all ${
                                                                seqActive
                                                                    ? "bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]"
                                                                    : "text-[#546E7A] hover:bg-[#EEF2F9]"
                                                            }`}
                                                        >
                                                            <span className="truncate">{sequence.name}</span>
                                                            {sequence.reconstructionParams.length > 0 && (
                                                                <span
                                                                    className="w-5 h-5 inline-flex items-center justify-center rounded hover:bg-[#E3F2FD]"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedSequenceKeys((prev) =>
                                                                            prev.includes(seqKey)
                                                                                ? prev.filter((k) => k !== seqKey)
                                                                                : [...prev, seqKey]
                                                                        );
                                                                    }}
                                                                >
                                                                    {seqExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                                </span>
                                                            )}
                                                        </button>

                                                        {seqExpanded && sequence.reconstructionParams.length > 0 && (
                                                            <div className="ml-2 mt-1 border-l border-[#EEF2F9] pl-2 space-y-1">
                                                                {sequence.reconstructionParams.map((recon) => {
                                                                    const reconActive = resolvedRecon?.id === recon.id;
                                                                    return (
                                                                        <button
                                                                            key={`${seqKey}-${recon.id}`}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedProtocolId(protocolId);
                                                                                setSelectedSequenceId(sequence.id);
                                                                                setSelectedReconId(recon.id);
                                                                            }}
                                                                            className={`w-full h-[28px] px-2 rounded-md text-left text-[11px] font-bold transition-all ${
                                                                                reconActive
                                                                                    ? "bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]"
                                                                                    : "text-[#546E7A] hover:bg-[#EEF2F9]"
                                                                            }`}
                                                                        >
                                                                            {recon.name}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <section className="flex-1 bg-white rounded-md border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[52px] bg-[#F8FAFC] border-b border-[#EEF2F9] px-4 flex items-center justify-between">
                        <div>
                            <div className="text-[13px] font-black text-[#37474F]">{panelTitle}</div>
                            <div className="text-[10px] font-bold text-[#90A4AE]">{panelSubtitle}</div>
                        </div>
                        <Info size={16} className="text-[#4D94FF]" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {panelKind === "protocol" && <FieldGrid fields={protocolFields} />}
                        {panelKind === "sequence" && <FieldGrid fields={sequenceFields} />}
                        {panelKind === "recon" && <FieldGrid fields={reconFields} />}
                    </div>
                </section>
            </main>

            <footer className="h-[80px] border-t border-[#B0C4DE] px-8 flex items-center justify-end gap-5 shrink-0 bg-[#E8EAF1]">
                <button className="h-[52px] px-10 rounded-md bg-white border-2 border-[#4D94FF] font-bold text-[13px] text-[#4D94FF] hover:bg-blue-50 transition-all shadow-sm active:scale-95">
                    取消
                </button>
                <button className="h-[52px] px-10 rounded-md bg-[#4D94FF] font-bold text-[13px] text-white shadow-lg hover:bg-blue-600 transition-all uppercase active:scale-95">
                    保存
                </button>
            </footer>
        </div>
    );
}
