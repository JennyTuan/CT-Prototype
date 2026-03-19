import { useState, useEffect, useRef } from "react";
import {
    User,
    Settings,
    Sun,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUp,
    FilePlus,
    Trash2,
    Circle,
    ArrowUpDown,
    AlertTriangle,
    Activity,
    TrendingUp,
    AlertCircle,
    Check,
    CheckCircle,
    Flame,
    Network,
    Siren
} from "lucide-react";

interface Sequence {
    id: string;
    name: string;
    steps?: string[];
}

interface ProtocolGroup {
    id: string;
    name: string;
    sequences: Sequence[];
}

interface ScoutScanScreenProps {
    firstStepLabel?: string;
    bottomPanelMode?: "positioning" | "breathing";
    viewportBgClassName?: string;
    breathingWorkflowVariant?: "training" | "acquisition";
}

const ScoutScanScreen = ({
    firstStepLabel = "激光灯定位",
    bottomPanelMode = "positioning",
    viewportBgClassName = "bg-[#1A222B]",
    breathingWorkflowVariant = "training",
}: ScoutScanScreenProps) => {
    const [startPos, setStartPos] = useState("472.95");
    const [endPos, setEndPos] = useState("595.17");
    const isBreathingSignalEnabled = true;

    const [breathingPhase, setBreathingPhase] = useState<"training" | "stable">("training");
    const [trainingTimer, setTrainingTimer] = useState(30);

    useEffect(() => {
        if (bottomPanelMode !== 'breathing' || breathingPhase !== 'training' || trainingTimer <= 0) return;

        const interval = setInterval(() => {
            setTrainingTimer(prev => {
                const next = prev - 1;
                if (next === 0) {
                    // Defer state update to avoid cascading render lint error
                    setTimeout(() => setBreathingPhase('stable'), 0);
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [bottomPanelMode, breathingPhase, trainingTimer]);

    const handleSwap = () => {
        setStartPos(endPos);
        setEndPos(startPos);
    };

    // Waveform simulation state (increased buffer for longer period)
    const [rawWaveData, setRawWaveData] = useState<number[]>(new Array(500).fill(100));
    const [filteredWaveData, setFilteredWaveData] = useState<number[]>(new Array(500).fill(100));
    const [metrics, setMetrics] = useState({ bpm: "14.8", peakErr: "1.7", freqErr: "1.9" });
    const timerRef = useRef<number | null>(null);
    const tRef = useRef(0); // Persistent time counter to prevent resets on re-render

    useEffect(() => {
        if (bottomPanelMode !== 'breathing' || !isBreathingSignalEnabled) return;

        const update = () => {
            tRef.current += 0.05; // Standard speed for ~15 bpm breaths
            const t = tRef.current;

            // Simulate a more realistic respiratory signal
            const cycle = Math.sin(t);
            const filteredVal = 500 + cycle * 200 + Math.sin(t * 0.3) * 30 + (Math.random() - 0.5) * 5;

            // Raw signal: very sharp high frequency spikes aligned with the cycle
            const pulse = Math.pow(Math.max(0, Math.sin(t * 1.0 + 0.1)), 24) * 400;
            const rawVal = 480 + cycle * 80 + pulse + (Math.random() - 0.5) * 15;

            setRawWaveData(prev => [...prev.slice(1), rawVal]);
            setFilteredWaveData(prev => [...prev.slice(1), filteredVal]);

            // Update metrics periodically using stable logic
            if (Math.random() > 0.98) {
                setFilteredWaveData(currentData => {
                    let peaks = 0;
                    for (let i = 4; i < currentData.length - 4; i++) {
                        if (currentData[i] > currentData[i - 1] && currentData[i] > currentData[i + 1] &&
                            currentData[i] > currentData[i - 2] && currentData[i] > currentData[i + 2] &&
                            currentData[i] > 650) {
                            peaks++;
                        }
                    }
                    const baseBpm = (peaks / 500) * 1200;
                    const bpm = Math.max(14.2, Math.min(15.8, baseBpm + (Math.random() - 0.5) * 0.2));
                    setMetrics(m => ({
                        ...m,
                        bpm: bpm.toFixed(1),
                        peakErr: (1.2 + Math.random() * 0.6).toFixed(1),
                        freqErr: (1.5 + Math.random() * 0.5).toFixed(1)
                    }));
                    return currentData;
                });
            }

            timerRef.current = requestAnimationFrame(update);
        };

        timerRef.current = requestAnimationFrame(update);
        return () => {
            if (timerRef.current !== null) cancelAnimationFrame(timerRef.current);
        };
    }, [bottomPanelMode, isBreathingSignalEnabled]); // Removed wave states from dependencies to stop re-running/resetting

    useEffect(() => {
        if (bottomPanelMode !== "breathing") return;

        setRawWaveData(new Array(500).fill(100));
        setFilteredWaveData(new Array(500).fill(100));
        setMetrics({ bpm: "14.8", peakErr: "1.7", freqErr: "1.9" });
        tRef.current = 0;
    }, [bottomPanelMode]);

    // Metrics are now handled in the update loop state

    // Initial data
    // Initial data
    const [groups, setGroups] = useState<ProtocolGroup[]>([
        {
            id: 'g1',
            name: 'Head_FacialBoneVolume',
            sequences: [
                { id: 's1', name: 'Scout', steps: [firstStepLabel, "参数确认", "执行扫描"] },
                { id: 's2', name: 'Helical Scan', steps: ["呼吸训练", '参数确认', '执行扫描'] }
            ]
        }
    ]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAbortConfirm, setShowAbortConfirm] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<"start" | "end" | null>(null);
    const [activeStepIdx, setActiveStepIdx] = useState(0); // Add state for active step tracking
    const [expandedSeqId, setExpandedSeqId] = useState<string | null>(
        bottomPanelMode === "breathing" && breathingWorkflowVariant === "training" ? "s2" : "s1"
    );

    useEffect(() => {
        if (bottomPanelMode !== "breathing") return;

        const timer = setTimeout(() => {
            setGroups([
                {
                    id: "g1",
                    name: "Head_FacialBoneVolume",
                    sequences: [
                        { id: "s1", name: "Scout", steps: [firstStepLabel, "参数确认", "执行扫描"] },
                        { id: "s2", name: "Helical Scan", steps: ["呼吸训练", '参数确认', '执行扫描'] },
                    ],
                },
            ]);
            setExpandedSeqId(breathingWorkflowVariant === "training" ? "s2" : "s1");
            setActiveStepIdx(0);
        }, 0);

        return () => clearTimeout(timer);
    }, [bottomPanelMode, breathingWorkflowVariant, firstStepLabel]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);

            // 1. Handle Group Selection (Find by id)
            const group = groups.find(item => item.id === id);
            if (group) {
                const childIds = group.sequences.map(seq => seq.id);
                const allRelatedIds = [group.id, ...childIds];

                // If anything in this group is NOT selected, select all. Otherwise, deselect all.
                const shouldSelectAll = !allRelatedIds.every(itemId => next.has(itemId));

                allRelatedIds.forEach(itemId => {
                    if (shouldSelectAll) next.add(itemId);
                    else next.delete(itemId);
                });
                return Array.from(next);
            }

            // 2. Handle Sequence Selection
            const parentGroup = groups.find(g => g.sequences.some(seq => seq.id === id));
            if (parentGroup) {
                if (next.has(id)) next.delete(id);
                else next.add(id);

                // Sync parent group status
                const sequenceIds = parentGroup.sequences.map(seq => seq.id);
                const allSequencesSelected = sequenceIds.every(seqId => next.has(seqId));

                if (allSequencesSelected) next.add(parentGroup.id);
                else next.delete(parentGroup.id);
            }

            return Array.from(next);
        });
    };

    const handleDeleteClick = () => {
        if (selectedIds.length === 0) return;
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setGroups(prev => prev
            .filter(g => !selectedIds.includes(g.id))
            .map(g => ({
                ...g,
                sequences: g.sequences.filter(s => !selectedIds.includes(s.id))
            }))
            .filter(g => g.sequences.length > 0)
        );
        setSelectedIds([]);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl relative text-[#37474F] font-sans select-none">

            {/* 1. Header (System Info) - Refined Parity */}
            <header className="flex items-center justify-between px-4 h-[80px] bg-[#E8EAF1] border-b border-[#B0C4DE] shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-sm min-w-[210px]">
                        <div className="w-10 h-10 rounded-sm bg-[#4A6982] flex items-center justify-center text-white opacity-90">
                            <User size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] font-bold text-[#37474F]">Roky Zhang</span>
                            <span className="text-[12px] text-[#546E7A] font-medium leading-none mt-0.5">ID: 67890</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                        <div className="text-[9px] font-bold italic">? 0</div>
                        <div className="text-[9px] font-bold">? 0</div>
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                            <Flame size={14} />
                            <span>0%</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">13:52</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1 uppercase opacity-80">2?26? ??</div>
                </div>

                <div className="flex items-center gap-5 pr-2">
                    <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><Siren size={30} strokeWidth={1.8} /></div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Network size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">5</span>
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Sun size={24} />
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Settings size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">10</span>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Area - Card Partitioning */}
            <main className="flex-1 flex overflow-hidden p-2 gap-1">

                {/* Left Sidebar Card */}
                <aside className="w-[240px] bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden shrink-0">
                    {/* Sidebar Toolbar - Card Header Style */}
                    <div className="h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center justify-between px-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[#546E7A] hover:bg-[#EEF2F9] rounded transition-all"><FilePlus size={18} /></button>
                            <button
                                disabled={selectedIds.length === 0}
                                onClick={handleDeleteClick}
                                className={`p-1.5 transition-all rounded relative ${selectedIds.length > 0 ? 'text-red-500 hover:bg-red-50' : 'text-[#546E7A]/40 cursor-not-allowed'}`}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                            className="p-1.5 text-[#4D94FF] hover:bg-[#EEF2F9] rounded transition-all"
                        >
                            {isTreeCollapsed ? <ChevronDown size={20} /> : <ChevronsUp size={20} />}
                        </button>
                    </div>

                    {/* Protocol Tree Area - Match ScanConfirm implementation */}
                    <div className={`overflow-y-auto p-2 flex flex-col gap-0 transition-all duration-300 ${isTreeCollapsed ? 'h-[48px] opacity-40 grayscale overflow-hidden' : 'h-[240px]'}`}>
                        {groups.map(group => (
                            <div key={group.id} className="flex flex-col">
                                <div
                                    onClick={() => toggleSelection(group.id)}
                                    className="flex items-center gap-2 px-2 py-1.5 text-[#37474F] cursor-pointer hover:bg-[#EEF2F9] rounded-md transition-all"
                                >
                                    <ChevronDown size={14} className="opacity-40" />
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(group.id);
                                        }}
                                        className={`w-3.5 h-3.5 rounded border-2 cursor-pointer flex items-center justify-center shrink-0 transition-all ${group.sequences.every(s => selectedIds.includes(s.id))
                                            ? 'bg-[#4D94FF] border-[#4D94FF]'
                                            : 'bg-white border-[#B0C4DE]'
                                            }`}
                                    >
                                        {group.sequences.every(s => selectedIds.includes(s.id)) && <Check size={9} className="text-white stroke-[3]" />}
                                    </div>
                                    <span className={`text-[13px] font-bold truncate transition-all ${group.sequences.every(s => selectedIds.includes(s.id)) ? 'text-[#4D94FF]' : 'text-[#37474F]'}`}>{group.name}</span>
                                </div>

                                <div className="flex flex-col">
                                    {group.sequences.map(seq => (
                                        <div key={seq.id}>
                                            {(() => {
                                                const isActiveSequence = bottomPanelMode === 'breathing'
                                                    ? seq.name === '呼吸采集'
                                                    : seq.name === 'Scout';
                                                const isExpanded = expandedSeqId === seq.id;
                                                const isBreathingScoutSequence = bottomPanelMode === 'breathing' && seq.name === 'Scout';
                                                const isBreathingHelicalSequence = bottomPanelMode === 'breathing' && seq.name === 'Helical Scan';
                                                const resolvedActiveSequence = bottomPanelMode === 'breathing'
                                                    ? (breathingWorkflowVariant === 'training' ? isBreathingHelicalSequence : isBreathingScoutSequence)
                                                    : seq.name === 'Scout';
                                                const isCompletedSequence = bottomPanelMode === 'breathing'
                                                    && breathingWorkflowVariant === 'training'
                                                    && seq.name === 'Scout';
                                                const isUnifiedActiveSequence = bottomPanelMode === 'breathing' ? resolvedActiveSequence : seq.name === 'Scout' || isActiveSequence;
                                                const shouldShowSteps = !!seq.steps?.length && isExpanded;

                                                return (
                                                    <>
                                                        {/* Sequence Row - Simplified to matched refined WT32 aesthetic */}
                                                        <div
                                                            onClick={() => setExpandedSeqId(isExpanded ? null : seq.id)}
                                                            className={`flex items-center gap-2 px-3 rounded-lg mb-1 transition-all relative cursor-pointer border ${seq.name === 'Scout' || seq.name === 'Helical Scan' ? 'h-[28px]' : 'py-2.5'} ${isUnifiedActiveSequence
                                                                ? 'bg-[#4D94FF] border-[#4D94FF] text-white shadow-md'
                                                                : isCompletedSequence
                                                                    ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                                                                    : (selectedIds.includes(seq.id) ? 'bg-[#E3F2FD] border-[#4D94FF]/30 text-[#4D94FF]' : 'bg-transparent border-transparent text-[#546E7A] hover:bg-[#EEF2F9]')
                                                                }`}
                                                        >
                                                            {isExpanded ? <ChevronDown size={14} className={selectedIds.includes(seq.id) ? 'text-[#4D94FF]/60' : isUnifiedActiveSequence ? "text-white/70" : isCompletedSequence ? "text-[#2E7D32]/70" : "text-gray-400"} /> : <ChevronRight size={14} className={selectedIds.includes(seq.id) ? 'text-[#4D94FF]/60' : isUnifiedActiveSequence ? "text-white/70" : isCompletedSequence ? "text-[#2E7D32]/70" : "text-gray-400"} />}
                                                            <div
                                                                onClick={(e) => { e.stopPropagation(); toggleSelection(seq.id); }}
                                                                className={`w-3.5 h-3.5 rounded border-2 cursor-pointer flex items-center justify-center shrink-0 transition-all ${isCompletedSequence
                                                                    ? 'bg-[#66BB6A] border-[#66BB6A]'
                                                                    : selectedIds.includes(seq.id)
                                                                    ? (isUnifiedActiveSequence ? 'bg-white border-white/30' : 'bg-[#4D94FF] border-[#4D94FF]')
                                                                    : (isUnifiedActiveSequence ? 'bg-white/20 border-white/30' : 'bg-white border-[#B0C4DE]')
                                                                    }`}
                                                            >
                                                                {(selectedIds.includes(seq.id) || isCompletedSequence) && (
                                                                    <Check size={9} className={`${isUnifiedActiveSequence ? 'text-[#4D94FF]' : 'text-white'} stroke-[3]`} />
                                                                )}
                                                            </div>
                                                            <span className="text-[13px] font-bold">{seq.name}</span>


                                                        </div>

                                                        {/* Workflow Steps - Prominent icons & connecting line */}
                                                        {shouldShowSteps && (
                                                            <div className="flex flex-col ml-12 mt-2 gap-4 relative pb-4">
                                                                <div className="absolute left-[7px] top-2 bottom-6 w-[1px] bg-[#B0C4DE]"></div>
                                                                {seq.steps?.map((step, idx) => {
                                                                    const isCompleted = isCompletedSequence || (isUnifiedActiveSequence && idx < activeStepIdx);

                                                                    const isActive = !isCompletedSequence && isUnifiedActiveSequence && idx === activeStepIdx;

                                                                    return (
                                                                        <div
                                                                            key={`${seq.id}-step-${idx}`}
                                                                            onClick={() => isUnifiedActiveSequence && setActiveStepIdx(idx)}
                                                                            className="flex items-center gap-3 z-10"
                                                                        >
                                                                            {isCompleted ? (
                                                                                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                                                                    <CheckCircle size={16} className="text-[#66BB6A]" />
                                                                                </div>
                                                                            ) : isActive ? (
                                                                                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#4D94FF] translate-x-[1px] shadow-[0_0_8px_rgba(77,148,255,0.3)]"></div>
                                                                            ) : (
                                                                                <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#B0C4DE] translate-x-[1px]"></div>
                                                                            )}
                                                                            <span className={`text-[12px] font-bold ${isActive ? 'text-[#37474F]' : 'text-[#37474F]/60'}`}>
                                                                                {step}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Controls / Params - Sidebar Detection Section */}
                    {bottomPanelMode === "breathing" ? (
                        <div className="border-t border-[#EEF2F9] bg-[#F8FAFC] p-4 flex-1 flex flex-col gap-5 overflow-y-auto">
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-[16px] font-black text-[#37474F] tracking-wide">呼吸检测</div>
                                <div className="flex items-center gap-2">
                                    <div
                                        onClick={() => {
                                            if (breathingPhase === 'stable') {
                                                setBreathingPhase('training');
                                                setTrainingTimer(30);
                                            } else {
                                                setBreathingPhase('stable');
                                            }
                                        }}
                                        className={`h-6 px-2 rounded-sm border cursor-pointer flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${breathingPhase === 'stable'
                                            ? 'bg-[#E8F5E9] border-[#A5D6A7]'
                                            : 'bg-orange-50 border-orange-200'
                                            }`}
                                        title="点击模拟状态切换"
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${breathingPhase === 'stable' ? 'bg-[#43A047]' : 'bg-orange-400 animate-pulse'
                                            }`} />
                                        <span className={`text-[11px] font-bold ${breathingPhase === 'stable' ? 'text-[#2E7D32]' : 'text-orange-700'
                                            }`}>
                                            {breathingPhase === 'stable' ? '呼吸采集(已就绪)' : '呼吸采集(训练中)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <MetricRow
                                    icon={<Circle size={14} fill="#4D94FF" className="text-[#4D94FF]" />}
                                    label="原始主频"
                                    value="15"
                                />
                                <MetricRow
                                    icon={<Activity size={14} />}
                                    label="呼吸频率"
                                    value={`${metrics.bpm} BPM`}
                                    isMain
                                />
                                <MetricRow
                                    icon={<TrendingUp size={14} />}
                                    label="峰值误差"
                                    value={`${metrics.peakErr}%`}
                                />
                                <MetricRow
                                    icon={<AlertCircle size={14} />}
                                    label="频率误差"
                                    value={`${metrics.freqErr}%`}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={`mt-auto border-t border-[#EEF2F9] bg-[#F8FAFC] px-4 py-3 shrink-0 transition-all duration-300 ${isTreeCollapsed ? 'flex-1 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'h-[168px]'}`}>
                            <div className="mb-3 text-[12px] font-bold text-[#546E7A]">请打开激光灯获取定位</div>
                            <div className="flex items-stretch gap-3 h-[calc(100%-28px)]">
                                <div className="flex flex-col items-center self-stretch justify-center py-2 shrink-0">
                                    <button
                                        onClick={() => setSelectedPosition('start')}
                                        className={`w-3 h-3 rounded-full border-2 flex items-center justify-center p-[2px] shrink-0 transition-all ${selectedPosition === 'start' ? 'bg-[#4D94FF] border-white shadow-sm' : 'bg-white border-[#B0C4DE]'}`}
                                    >
                                        {selectedPosition === 'start' && <div className="w-full h-full bg-white rounded-full" />}
                                    </button>
                                    <div className="w-px flex-1 bg-[#C5D5E8] my-1" />
                                    <button
                                        onClick={handleSwap}
                                        title="交换起始/结束位置"
                                        className="w-[20px] h-[20px] rounded-full bg-white border border-[#B0C4DE] flex items-center justify-center text-[#78A0BF] hover:text-[#4D94FF] hover:border-[#4D94FF] hover:bg-[#EEF6FF] transition-all active:scale-90 shadow-sm shrink-0"
                                    >
                                        <ArrowUpDown size={10} />
                                    </button>
                                    <div className="w-px flex-1 bg-[#C5D5E8] my-1" />
                                    <button
                                        onClick={() => setSelectedPosition('end')}
                                        className={`w-3 h-3 rounded-full border-2 flex items-center justify-center p-[2px] shrink-0 transition-all ${selectedPosition === 'end' ? 'bg-[#66BB6A] border-white shadow-sm' : 'bg-white border-[#B0C4DE]'}`}
                                    >
                                        {selectedPosition === 'end' && <div className="w-full h-full bg-white rounded-full" />}
                                    </button>
                                </div>

                                <div className="flex flex-col flex-1 min-w-0 self-stretch justify-between py-4">
                                    <div
                                        onClick={() => setSelectedPosition('start')}
                                        className="flex items-center gap-2 h-[32px] min-w-0 cursor-pointer"
                                    >
                                        <span className={`text-[12px] font-bold w-[60px] shrink-0 transition-colors ${selectedPosition === 'start' ? 'text-[#4D94FF]' : 'text-[#90A4AE]'}`}>起始位置 :</span>
                                        <input
                                            type="text"
                                            value={startPos}
                                            onChange={(e) => {
                                                setSelectedPosition('start');
                                                setStartPos(e.target.value);
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPosition('start');
                                            }}
                                            className={`flex-1 min-w-0 h-[32px] bg-white border rounded px-2 text-[13px] font-bold outline-none transition-colors ${selectedPosition === 'start' ? 'border-[#4D94FF] text-[#4D94FF]' : 'border-[#B0C4DE] text-[#90A4AE]'} focus:border-[#4D94FF]`}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setSelectedPosition('end')}
                                        className="flex items-center gap-2 h-[32px] min-w-0 cursor-pointer"
                                    >
                                        <span className={`text-[12px] font-bold w-[60px] shrink-0 transition-colors ${selectedPosition === 'end' ? 'text-[#66BB6A]' : 'text-[#90A4AE]'}`}>结束位置 :</span>
                                        <input
                                            type="text"
                                            value={endPos}
                                            onChange={(e) => {
                                                setSelectedPosition('end');
                                                setEndPos(e.target.value);
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPosition('end');
                                            }}
                                            className={`flex-1 min-w-0 h-[32px] bg-white border rounded px-2 text-[13px] font-bold outline-none transition-colors ${selectedPosition === 'end' ? 'border-[#66BB6A] text-[#66BB6A]' : 'border-[#B0C4DE] text-[#90A4AE]'} focus:border-[#4D94FF]`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Right Viewport Card - Redesigned for Breathing */}
                <section className={`flex-1 ${viewportBgClassName} rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden relative`}>
                    {bottomPanelMode === 'breathing' ? (
                        <div className="flex-1 flex flex-col p-4 gap-4 bg-[#EEF2F9]/50">
                            <div className="min-h-0 flex-1 rounded-md border border-[#D7E3F0] bg-white p-3 flex flex-col gap-3 shadow-sm">
                                <div className="flex items-center justify-between shrink-0">
                                    <div>
                                        <div className="text-[14px] font-black text-[#37474F]">图像浏览区</div>
                                        <div className="mt-0.5 text-[11px] text-[#78909C]">训练参考图像与当前定位预览</div>
                                    </div>
                                    <div className="rounded-full border border-[#C8D8EA] bg-[#F8FBFF] px-2.5 py-1 text-[10px] font-bold text-[#607D8B]">
                                        SER 01 / IMG 128
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1 rounded-md border border-[#B0C4DE]/50 bg-[#0F1720] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,144,156,0.24),_rgba(15,23,32,0.96)_70%)]"></div>
                                    <div className="absolute inset-6 rounded-[50%] border border-dashed border-[#8FA7BA]/30"></div>
                                    <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-[#9FB3C8]/30"></div>
                                    <div className="absolute top-1/2 left-6 right-6 h-px -translate-y-1/2 bg-[#9FB3C8]/30"></div>
                                    <div className="absolute inset-x-[18%] top-[22%] h-[54%] rounded-[45%] border border-[#D7E7F5]/35 bg-[linear-gradient(180deg,rgba(220,235,245,0.16),rgba(95,115,130,0.08))] blur-[1px]"></div>
                                    <div className="absolute left-[28%] top-[30%] h-[36%] w-[16%] rounded-full border border-[#E8F1F8]/30"></div>
                                    <div className="absolute right-[28%] top-[30%] h-[36%] w-[16%] rounded-full border border-[#E8F1F8]/30"></div>
                                    <div className="absolute inset-x-[24%] top-[18%] h-[3px] rounded-full bg-[#7EAAFF]/80 shadow-[0_0_18px_rgba(126,170,255,0.8)]"></div>
                                    <div className="absolute inset-x-[24%] bottom-[18%] h-[3px] rounded-full bg-[#66BB6A]/75 shadow-[0_0_16px_rgba(102,187,106,0.7)]"></div>
                                    <div className="absolute left-3 top-3 rounded border border-white/10 bg-black/35 px-2 py-1 text-[10px] font-bold text-[#DCE6F2]">
                                        AP Preview
                                    </div>
                                    <div className="absolute right-3 top-3 rounded border border-[#C8E6C9]/30 bg-[#E8F5E9]/10 px-2 py-1 text-[10px] font-bold text-[#C8E6C9]">
                                        Ready
                                    </div>
                                </div>

                                <div className="shrink-0 flex gap-2 overflow-hidden">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className={`flex-1 rounded-md border p-1.5 ${item === 2 ? "border-[#7EAAFF] bg-[#EEF4FF]" : "border-[#D7E3F0] bg-[#F8FAFD]"}`}
                                        >
                                            <div className="h-14 rounded bg-[linear-gradient(180deg,#2B3642,#111821)] relative overflow-hidden">
                                                <div className="absolute inset-x-[30%] top-2 bottom-2 rounded-full border border-white/20"></div>
                                                <div className="absolute inset-x-[24%] top-1/2 h-px -translate-y-1/2 bg-white/20"></div>
                                            </div>
                                            <div className="mt-1.5 text-center text-[10px] font-bold text-[#607D8B]">IMG {124 + item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[210px] shrink-0 bg-white rounded-md border border-[#B0C4DE]/40 shadow-inner p-3 relative overflow-hidden">
                                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded border border-[#C8E6C9] bg-[#E8F5E9] px-2 py-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-[#2E7D32]">实时波形</span>
                                </div>

                                <div className="absolute inset-x-8 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
                                    {[1100, 1000, 800, 600, 400, 200, 0].map(val => (
                                        <div key={val} className="flex items-center gap-2">
                                            <span className="text-[10px] w-6 text-right font-mono text-[#90A4AE]">{val}</span>
                                            <div className="flex-1 h-[1px] bg-[#B0C4DE]"></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute inset-x-0 inset-y-6 flex flex-col justify-end px-14">
                                    <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path
                                            d={`M ${rawWaveData.map((val, i) => `${(i / (rawWaveData.length - 1)) * 800},${200 - (val / 1100) * 200}`).join(' L ')}`}
                                            fill="none"
                                            stroke="#B0BEC5"
                                            strokeWidth="1.2"
                                            className="opacity-40"
                                        />
                                        <path
                                            d={`M ${filteredWaveData.map((val, i) => `${(i / (filteredWaveData.length - 1)) * 800},${200 - (val / 1100) * 200}`).join(' L ')}`}
                                            fill="none"
                                            stroke="#4D94FF"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        {filteredWaveData.map((val, i) => {
                                            if (i < 10 || i > filteredWaveData.length - 10) return null;

                                            const isLocalMax = val > filteredWaveData[i - 1] && val > filteredWaveData[i + 1] &&
                                                val > filteredWaveData[i - 2] && val > filteredWaveData[i + 2] &&
                                                val > filteredWaveData[i - 3] && val > filteredWaveData[i + 3];
                                            const isLocalMin = val < filteredWaveData[i - 1] && val < filteredWaveData[i + 1] &&
                                                val < filteredWaveData[i - 2] && val < filteredWaveData[i + 2] &&
                                                val < filteredWaveData[i - 3] && val < filteredWaveData[i + 3];

                                            if (isLocalMax && val >= 650) {
                                                return (
                                                    <circle
                                                        key={`pk-${i}`}
                                                        cx={(i / (filteredWaveData.length - 1)) * 800}
                                                        cy={200 - (val / 1100) * 200}
                                                        r="4"
                                                        fill="#FF1744"
                                                        stroke="#FFF"
                                                        strokeWidth="1.5"
                                                    />
                                                );
                                            }

                                            if (isLocalMin && val <= 380) {
                                                return (
                                                    <circle
                                                        key={`vl-${i}`}
                                                        cx={(i / (filteredWaveData.length - 1)) * 800}
                                                        cy={200 - (val / 1100) * 200}
                                                        r="3.5"
                                                        fill="#FFD600"
                                                        stroke="#FFF"
                                                        strokeWidth="1"
                                                    />
                                                );
                                            }

                                            return null;
                                        })}
                                    </svg>
                                </div>

                                <div className="absolute right-4 top-4 rounded border border-[#B0C4DE]/50 bg-white p-2 shadow-xl z-10 scale-90">
                                    <div className="text-[10px] font-bold text-[#546E7A]">实时数据</div>
                                    <div className="text-[10px] text-[#90A4AE]">采样值 : {filteredWaveData[filteredWaveData.length - 1].toFixed(1)}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full opacity-10 bg-gradient-to-br from-blue-900/40 to-transparent flex items-center justify-center text-[#546E7A] uppercase font-thin text-[52px] tracking-[16px]">
                                Viewport
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* 3. Footer (Nav Buttons) */}
            <footer className="h-[80px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8 z-10">
                <div className="flex-1">
                    <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-solid shadow-sm transition-all uppercase text-[13px] active:scale-95">
                        <ChevronLeft size={20} /> 上一步
                    </button>
                </div>

                {bottomPanelMode === 'breathing' ? (
                    <div className="flex-1 flex justify-center items-center gap-2">
                        {/* Deleted Steady Breathing indicator from here */}
                    </div>
                ) : (
                    <div className="flex-1 flex justify-center">
                        <button
                            onClick={() => setShowAbortConfirm(true)}
                            className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#F57C00] font-bold rounded-md border-2 border-[#F57C00] hover:bg-orange-50 transition-all uppercase text-[13px] shadow-sm active:scale-95">
                            <AlertTriangle size={20} /> 中止检查
                        </button>
                    </div>
                )}

                <div className="flex-1 flex justify-end">
                    <button
                        disabled={bottomPanelMode === 'breathing' && breathingPhase !== 'stable'}
                        className={`flex items-center gap-2 px-10 h-[52px] font-bold rounded-md shadow-lg transition-all uppercase text-[13px] active:scale-95 ${(bottomPanelMode === 'breathing' && breathingPhase !== 'stable')
                            ? 'bg-gray-300 text-white cursor-not-allowed shadow-none active:scale-100'
                            : (bottomPanelMode === 'breathing' ? 'bg-[#7EAAFF] text-white hover:bg-[#6FA0FF]' : 'bg-[#4D94FF] text-white hover:bg-blue-600')
                            }`}
                    >
                        {bottomPanelMode === 'breathing' ? '定位像' : '下一步'} <ChevronRight size={20} />
                    </button>
                </div>
            </footer>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border border-[#B0C4DE] w-[340px] overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 bg-[#FFF8E1] border-b border-[#FFE082]">
                            <div className="w-9 h-9 rounded-full bg-[#F57C00]/10 flex items-center justify-center shrink-0">
                                <Trash2 size={16} className="text-[#F57C00]" />
                            </div>
                            <div>
                                <div className="text-[14px] font-black text-[#37474F]">确认删除</div>
                                <div className="text-[11px] text-[#78909C] mt-0.5">已选择 {selectedIds.length} 项，此操作不可恢复</div>
                            </div>
                        </div>
                        <div className="flex gap-2 px-5 py-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 h-[40px] bg-white border-2 border-[#B0C4DE] text-[#546E7A] font-bold rounded-lg text-[13px] hover:bg-gray-50 transition-all active:scale-95"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 h-[40px] bg-[#D32F2F] text-white font-bold rounded-lg text-[13px] hover:bg-red-700 shadow-md transition-all active:scale-95"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Abort Confirmation Dialog */}
            {showAbortConfirm && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl border border-[#FFE082] w-[360px] overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 bg-[#FFF8E1] border-b border-[#FFE082]">
                            <div className="w-10 h-10 rounded-full bg-[#F57C00]/15 flex items-center justify-center shrink-0">
                                <AlertTriangle size={20} className="text-[#F57C00]" />
                            </div>
                            <div>
                                <div className="text-[15px] font-black text-[#37474F]">中止检查</div>
                                <div className="text-[12px] text-[#78909C] mt-0.5">确认中止当前检查流程？</div>
                            </div>
                        </div>
                        <div className="px-5 py-3">
                            <p className="text-[13px] text-[#546E7A] leading-relaxed">
                                中止后，<span className="font-bold text-[#37474F]">当前扫描参数将清空</span>，需要重新进入流程。
                            </p>
                        </div>
                        <div className="flex gap-2 px-5 pb-5">
                            <button
                                onClick={() => setShowAbortConfirm(false)}
                                className="flex-1 h-[40px] bg-white border-2 border-[#B0C4DE] text-[#546E7A] font-bold rounded-lg text-[13px] hover:bg-gray-50 transition-all active:scale-95"
                            >
                                继续检查
                            </button>
                            <button
                                onClick={() => setShowAbortConfirm(false)}
                                className="flex-1 h-[40px] bg-[#F57C00] text-white font-bold rounded-lg text-[13px] hover:bg-orange-600 shadow-md transition-all active:scale-95"
                            >
                                确认中止
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MetricRow = ({ icon, label, value, isMain }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    isMain?: boolean
}) => {
    const parts = String(value).split(' ');
    const numValue = parts[0];
    const unit = parts.slice(1).join(' ');

    return (
        <div className={`group flex flex-col gap-1.5 p-3 rounded-lg border transition-all ${isMain
            ? 'bg-white border-[#4D94FF] shadow-md ring-1 ring-[#4D94FF]/10'
            : 'bg-white border-[#B0C4DE]/40 shadow-sm'
            }`}>
            <div className="flex items-center gap-1.5 min-w-0">
                <span className={`shrink-0 ${isMain ? 'text-[#4D94FF]' : 'text-[#90A4AE]'}`}>
                    {icon}
                </span>
                <span className={`text-[11px] font-bold ${isMain ? 'text-[#4D94FF]' : 'text-[#90A4AE]'} uppercase truncate`}>
                    {label}
                </span>
            </div>
            <div className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden">
                <span className={`text-[18px] font-black ${isMain ? 'text-[#4D94FF]' : 'text-[#37474F]'} leading-tight`}>
                    {numValue}
                </span>
                {unit && (
                    <span className={`text-[10px] font-bold ${isMain ? 'text-[#4D94FF]/80' : 'text-[#90A4AE]'} uppercase`}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ScoutScanScreen;

