import { useState, useEffect, useRef } from "react";
import {
    User,
    Settings,
    Sun,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUp,
    Monitor,
    UserCheck,
    FilePlus,
    Trash2,
    Clock,
    Circle,
    ArrowUpDown,
    AlertTriangle,
    Activity,
    TrendingUp,
    AlertCircle
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
}

const ScoutScanScreen = ({
    firstStepLabel = "打开激光灯获取定位",
    bottomPanelMode = "positioning",
}: ScoutScanScreenProps) => {
    const [startPos, setStartPos] = useState("472.95");
    const [endPos, setEndPos] = useState("595.17");
    const [breathingEditableParams, setBreathingEditableParams] = useState({
        minSpacing: "2.0",
        filterThreshold: "0.45",
        peakThreshold: "1.20",
        valleyThreshold: "0.35",
        gain: "1.5",
    });

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
    const [waveData, setWaveData] = useState<number[]>(new Array(500).fill(100));
    const [metrics, setMetrics] = useState({ bpm: "14.8", peakErr: "1.7", freqErr: "1.9" });
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (bottomPanelMode !== 'breathing') return;

        let t = 0;
        const update = () => {
            t += 0.05; // Slightly slower increment for smoother rolling
            // Create a realistic breathing-like wave
            const newVal = 100 + Math.sin(t) * 45 + Math.sin(t * 0.3) * 12 + (Math.random() - 0.5) * 2;
            setWaveData(prev => {
                const updated = [...prev.slice(1), newVal];
                return updated;
            });

            // Update metrics periodically (every few frames for stability)
            if (Math.random() > 0.95) {
                setWaveData(currentData => {
                    let peaks = 0;
                    for (let i = 2; i < currentData.length - 2; i++) {
                        if (currentData[i] > currentData[i - 1] && currentData[i] > currentData[i + 1] &&
                            currentData[i] > currentData[i - 2] && currentData[i] > currentData[i + 2] && currentData[i] > 125) {
                            peaks++;
                        }
                    }
                    const baseBpm = (peaks / currentData.length) * 1200;
                    const bpm = Math.max(14.2, Math.min(15.8, baseBpm + (Math.random() - 0.5) * 0.2));
                    setMetrics({
                        bpm: bpm.toFixed(1),
                        peakErr: (1.5 + Math.random() * 0.4).toFixed(1),
                        freqErr: (1.8 + Math.random() * 0.3).toFixed(1)
                    });
                    return currentData;
                });
            }

            timerRef.current = requestAnimationFrame(update);
        };

        timerRef.current = requestAnimationFrame(update);
        return () => {
            if (timerRef.current !== null) cancelAnimationFrame(timerRef.current);
        };
    }, [bottomPanelMode]);

    // Metrics are now handled in the update loop state

    // Initial data
    const [groups, setGroups] = useState<ProtocolGroup[]>(
        bottomPanelMode === 'breathing' ? [
            {
                id: 'g1',
                name: 'Head_FacialBoneVolume',
                sequences: [
                    { id: 's1', name: '呼吸采集', steps: ['呼吸训练', '呼吸平稳'] },
                    { id: 's2', name: '定位像' },
                    { id: 's3', name: '螺旋采集' }
                ]
            }
        ] : [
            {
                id: 'g1',
                name: 'Head_FacialBoneVolume',
                sequences: [
                    { id: 's1', name: 'Scout', steps: [firstStepLabel, '确认参数', '执行扫描'] }
                ]
            },
            {
                id: 'g2',
                name: 'Helical Scan',
                sequences: []
            }
        ]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAbortConfirm, setShowAbortConfirm] = useState(false);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
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
            .filter(g => g.sequences.length > 0 || !['g1', 'g2'].includes(g.id))
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
                        <div className="ml-auto flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                            <div className="text-[9px] font-bold italic">⊥ 0</div>
                            <div className="text-[9px] font-bold">∠ 0</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">13:52</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1 uppercase opacity-80">2月26日 周四</div>
                </div>

                <div className="flex items-center gap-5 pr-2">
                    <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><UserCheck size={32} strokeWidth={1.5} /></div>
                    <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70 relative">
                        <Monitor size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">9</span>
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Sun size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">5</span>
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Settings size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">10</span>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Area - Card Partitioning */}
            <main className="flex-1 flex overflow-hidden p-4 gap-4">

                {/* Left Sidebar Card */}
                <aside className="w-[264px] bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden shrink-0">
                    {/* Sidebar Toolbar - Card Header Style */}
                    <div className="h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center justify-between px-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[#546E7A] hover:bg-[#EEF2F9] rounded transition-all"><FilePlus size={18} /></button>
                            <button
                                onClick={handleDeleteClick}
                                className={`p-1.5 transition-all rounded ${selectedIds.length > 0 ? 'text-red-500 hover:bg-red-50' : 'text-[#546E7A]/40 cursor-not-allowed'}`}
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

                    {/* Protocol Tree Area - Collapsible */}
                    <div className={`overflow-y-auto p-2 flex flex-col gap-1 transition-all duration-300 ${isTreeCollapsed ? 'h-[48px] opacity-40 grayscale overflow-hidden' : 'flex-1'}`}>
                        {groups.map(group => (
                            <div key={group.id} className="flex flex-col">
                                <div className="flex items-center gap-2 px-2 py-2 text-[#37474F]">
                                    <ChevronDown size={14} className="opacity-70" />
                                    <div
                                        onClick={() => toggleSelection(group.id)}
                                        className={`w-4 h-4 rounded-sm border border-[#B0C4DE] cursor-pointer flex items-center justify-center transition-all ${selectedIds.includes(group.id) ? 'bg-[#4D94FF] border-[#4D94FF]' : 'bg-white'}`}
                                    >
                                        {selectedIds.includes(group.id) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className="text-[13px] font-bold truncate opacity-70">{group.name}</span>
                                </div>

                                <div className="flex flex-col">
                                    {group.sequences.map(seq => (
                                        <div key={seq.id}>
                                            {/* Active/Sequence Style */}
                                            <div className={`flex items-center gap-2 px-2 py-2 rounded-md ml-4 mb-1 transition-all ${seq.name === '呼吸采集' ? 'bg-[#7EAAFF] text-white shadow-sm' : 'text-[#37474F] hover:bg-gray-50'}`}>
                                                <ChevronDown size={14} className={seq.name === '呼吸采集' ? 'text-black' : 'text-[#37474F]'} />
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); toggleSelection(seq.id); }}
                                                    className={`w-4 h-4 rounded-sm border cursor-pointer flex items-center justify-center transition-all ${seq.name === '呼吸采集' ? 'border-white bg-white/20' : 'border-[#B0C4DE] bg-white'} ${selectedIds.includes(seq.id) ? (seq.name === '呼吸采集' ? 'bg-white' : 'bg-[#4D94FF] border-[#4D94FF]') : ''}`}
                                                >
                                                    {selectedIds.includes(seq.id) && <div className={`w-1.5 h-1.5 rounded-full ${seq.name === '呼吸采集' ? 'bg-[#7EAAFF]' : 'bg-white'}`}></div>}
                                                </div>
                                                <span className="text-[13px] font-bold">{seq.name}</span>
                                            </div>

                                            {/* Workflow Steps - Only for active/expanded sequences or specifically for breathing mode */}
                                            {(seq.steps && seq.steps.length > 0 && (seq.name === '呼吸采集' || selectedIds.includes(seq.id))) && (
                                                <div className="flex flex-col ml-10 mt-2 gap-4 relative pb-4">
                                                    <div className="absolute left-[7px] top-0 bottom-6 w-[1px] bg-[#B0C4DE]/30"></div>
                                                    {seq.steps.map((step, idx) => {
                                                        const isActive = (step.includes('训练') && breathingPhase === 'training') ||
                                                            (step.includes('平稳') && breathingPhase === 'stable');
                                                        return (
                                                            <div key={`${seq.id}-step-${idx}`} className={`flex items-center gap-3 z-10 group transition-all duration-300 ${isActive ? 'scale-105 origin-left' : 'opacity-30 grayscale'}`}>
                                                                {step.includes('训练') ? (
                                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isActive ? 'bg-[#7EAAFF] border-[#7EAAFF] shadow-md animate-pulse' : 'bg-white border-[#B0C4DE]'}`}>
                                                                        <Clock size={10} className={isActive ? 'text-white' : 'text-[#37474F]'} />
                                                                    </div>
                                                                ) : (
                                                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center translate-x-[1px] transition-all ${isActive ? 'bg-[#43A047] border-[#43A047] shadow-md' : 'bg-white border-[#66BB6A]'}`}>
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                    </div>
                                                                )}
                                                                <span className={`text-[13px] font-bold ${isActive ? 'text-[#37474F]' : 'text-[#37474F]/40'}`}>{step}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
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
                                            {breathingPhase === 'stable' ? '呼吸平稳' : `呼吸训练 (${trainingTimer}s)`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <MetricRow
                                    icon={<Circle size={14} fill="#4D94FF" className="text-[#4D94FF]" />}
                                    label="原始数据主频率"
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
                        <div className={`border-t border-[#EEF2F9] bg-[#F8FAFC] px-4 flex items-center gap-3 shrink-0 transition-all duration-300 ${isTreeCollapsed ? 'flex-1 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'h-[140px]'}`}>
                            <div className="flex flex-col items-center self-stretch justify-center py-4 shrink-0">
                                <Circle size={11} className="text-[#90A4AE] shrink-0" />
                                <div className="w-px flex-1 bg-[#C5D5E8] my-1" />
                                <button
                                    onClick={handleSwap}
                                    title="交换起始/结束位置"
                                    className="w-[20px] h-[20px] rounded-full bg-white border border-[#B0C4DE] flex items-center justify-center text-[#78A0BF] hover:text-[#4D94FF] hover:border-[#4D94FF] hover:bg-[#EEF6FF] transition-all active:scale-90 shadow-sm shrink-0"
                                >
                                    <ArrowUpDown size={10} />
                                </button>
                                <div className="w-px flex-1 bg-[#C5D5E8] my-1" />
                                <div className="w-3 h-3 rounded-full bg-[#66BB6A] border-2 border-white flex items-center justify-center p-[2px] shrink-0">
                                    <div className="w-full h-full bg-white rounded-full" />
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 min-w-0 self-stretch justify-between py-4">
                                <div className="flex items-center gap-2 h-[32px] min-w-0">
                                    <span className="text-[12px] font-bold text-[#90A4AE] w-[60px] shrink-0">起始位置 :</span>
                                    <input
                                        type="text"
                                        value={startPos}
                                        onChange={(e) => setStartPos(e.target.value)}
                                        className="flex-1 min-w-0 h-[32px] bg-white border border-[#B0C4DE] rounded px-2 text-[13px] font-bold text-[#90A4AE] outline-none focus:border-[#4D94FF]"
                                    />
                                </div>
                                <div className="flex items-center gap-2 h-[32px] min-w-0">
                                    <span className="text-[12px] font-bold text-[#66BB6A] w-[60px] shrink-0">结束位置 :</span>
                                    <input
                                        type="text"
                                        value={endPos}
                                        onChange={(e) => setEndPos(e.target.value)}
                                        className="flex-1 min-w-0 h-[32px] bg-white border border-[#B0C4DE] rounded px-2 text-[13px] font-bold text-[#66BB6A] outline-none focus:border-[#4D94FF]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Right Viewport Card - Redesigned for Breathing */}
                <section className="flex-1 bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden relative">
                    {bottomPanelMode === 'breathing' ? (
                        <div className="flex-1 flex flex-col p-4 gap-4 bg-[#EEF2F9]/50">
                            {/* Parameter Sliders */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 px-4 py-2">
                                <BreathSliderItem
                                    label="最小间距"
                                    value={breathingEditableParams.minSpacing}
                                    onChange={(v) => setBreathingEditableParams(p => ({ ...p, minSpacing: v }))}
                                    unit="S"
                                />
                                <BreathSliderItem
                                    label="滤波阈值"
                                    value={breathingEditableParams.filterThreshold}
                                    onChange={(v) => setBreathingEditableParams(p => ({ ...p, filterThreshold: v }))}
                                    dropdownOptions={["13"]}
                                />
                                <BreathSliderItem
                                    label="波峰阈值"
                                    value={breathingEditableParams.peakThreshold}
                                    onChange={(v) => setBreathingEditableParams(p => ({ ...p, peakThreshold: v }))}
                                    rawValue="450"
                                />
                                <BreathSliderItem
                                    label="波谷阈值"
                                    value={breathingEditableParams.valleyThreshold}
                                    onChange={(v) => setBreathingEditableParams(p => ({ ...p, valleyThreshold: v }))}
                                    rawValue="800"
                                />
                                <BreathSliderItem
                                    label="增益"
                                    value={breathingEditableParams.gain}
                                    onChange={(v) => setBreathingEditableParams(p => ({ ...p, gain: v }))}
                                    rawValue="0"
                                />
                            </div>

                            {/* Waveform Chart Area - Dynamic */}
                            <div className="flex-1 bg-white rounded-md border border-[#B0C4DE]/40 shadow-inner mt-2 p-4 relative overflow-hidden">
                                <div className="absolute inset-x-8 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
                                    {[1100, 1000, 800, 600, 400, 200, 0].map(val => (
                                        <div key={val} className="flex items-center gap-2">
                                            <span className="text-[10px] w-6 text-right font-mono">{val}</span>
                                            <div className="flex-1 h-[1px] bg-[#B0C4DE]"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-end px-14">
                                    <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path
                                            d={`M ${waveData.map((val, i) => `${(i / (waveData.length - 1)) * 800},${200 - val}`).join(' L ')}`}
                                            fill="none"
                                            stroke="#4D94FF"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        {/* Dynamic Peak/Valley markers with neighborhood check for density */}
                                        {waveData.map((val, i) => {
                                            // Only show markers for the visible window and check neighborhood to avoid noise
                                            if (i < 5 || i > waveData.length - 5) return null;
                                            const isPeak = val > waveData[i - 1] && val > waveData[i + 1] &&
                                                val > waveData[i - 2] && val > waveData[i + 2] && val > 125;
                                            const isValley = val < waveData[i - 1] && val < waveData[i + 1] &&
                                                val < waveData[i - 2] && val < waveData[i + 2] && val < 75;

                                            if (isPeak) return <circle key={i} cx={(i / (waveData.length - 1)) * 800} cy={200 - val} r="3.5" fill="#D32F2F" />;
                                            if (isValley) return <circle key={i} cx={(i / (waveData.length - 1)) * 800} cy={200 - val} r="3.5" fill="#FBC02D" />;
                                            return null;
                                        })}
                                    </svg>
                                </div>
                                {/* Scroll Indicator */}
                                <div className="absolute right-4 top-4 flex items-center gap-1.5 px-2 py-1 bg-[#E8F5E9] rounded border border-[#C8E6C9]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-[#2E7D32]">实时监测中</span>
                                </div>
                                <div className="absolute left-[70%] top-[40%] bg-white shadow-xl border border-[#B0C4DE]/50 p-2 rounded z-10 scale-90">
                                    <div className="text-[10px] font-bold text-[#546E7A]">实时数据</div>
                                    <div className="text-[10px] text-[#90A4AE]">采样值 : {waveData[waveData.length - 1].toFixed(1)}</div>
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
            <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8 z-10">
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
                                <div className="text-[11px] text-[#78909C] mt-0.5">已选 {selectedIds.length} 项，此操作不可恢复</div>
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

const BreathSliderItem = ({ label, value, unit, dropdownOptions, rawValue, onChange }: {
    label: string,
    value: string,
    unit?: string,
    dropdownOptions?: string[],
    rawValue?: string,
    onChange?: (v: string) => void
}) => {
    const trackRef = useRef<HTMLDivElement>(null);

    // Convert string value to number for slider position
    const numValue = parseFloat(value) || 0;
    // Assume ranges based on labels
    let min = 0;
    let max = 2; // Default max
    if (label === "增益") max = 5;
    else if (label === "最小间距") max = 10;
    else if (label === "波峰阈值" || label === "波谷阈值") {
        min = 0.5; // Assuming thresholds are factors, not raw values
        max = 1.5;
    }


    const percentage = Math.min(Math.max(((numValue - min) / (max - min)) * 100, 0), 100);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        if (!trackRef.current || dropdownOptions) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        const p = Math.min(Math.max(x / rect.width, 0), 1);
        const nextVal = (min + p * (max - min)).toFixed(2);
        onChange?.(nextVal);
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-[13px] font-bold text-[#37474F] w-[64px] shrink-0">{label}</span>
            <div className="flex-1 flex items-center gap-2">
                <div
                    ref={trackRef}
                    onClick={handleInteraction}
                    className="flex-1 h-3 bg-[#EEF2F9] rounded-full relative border border-[#B0C4DE]/30 cursor-pointer"
                >
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white border-2 border-[#4D94FF] rounded-full shadow-md transition-all duration-75 pointer-events-none"
                        style={{ left: `calc(${percentage}% - 9px)` }}
                    ></div>
                    <div
                        className="absolute left-0 top-0 bottom-0 bg-[#4D94FF] rounded-full transition-all duration-75"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                {dropdownOptions ? (
                    <div className="group relative">
                        <div className="w-[80px] h-[32px] bg-white border border-[#B0C4DE] rounded px-2 flex items-center justify-between text-[13px] text-[#546E7A] cursor-pointer hover:border-[#4D94FF]">
                            {dropdownOptions[0]} <ChevronDown size={14} />
                        </div>
                    </div>
                ) : (
                    <div className="w-[80px] h-[32px] bg-white border border-[#B0C4DE] rounded flex items-center justify-center gap-1 focus-within:border-[#4D94FF] transition-colors shadow-sm">
                        <input
                            type="text"
                            value={rawValue || value}
                            onChange={(e) => onChange?.(e.target.value)}
                            className="w-[40px] text-center text-[13px] font-bold text-[#546E7A] outline-none bg-transparent"
                        />
                        {unit && <span className="text-[13px] text-[#90A4AE] font-bold">{unit}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricRow = ({ icon, label, value, isMain }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    isMain?: boolean
}) => (
    <div className={`group flex flex-col gap-1 p-3 rounded-lg transition-all bg-white border border-[#B0C4DE]/30 shadow-sm ${isMain ? 'ring-2 ring-[#4D94FF]/20 border-[#4D94FF]/40' : ''}`}>
        <div className="flex items-center gap-2">
            <span className="text-[#4D94FF]">{icon}</span>
            <span className="text-[11px] font-bold text-[#90A4AE] tracking-wide uppercase">{label}</span>
        </div>
        <div className={`text-[17px] font-black ${isMain ? 'text-[#4D94FF]' : 'text-[#37474F]'} pl-5`}>
            {value}
        </div>
    </div>
);

export default ScoutScanScreen;
