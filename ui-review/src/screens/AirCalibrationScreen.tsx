import { useState, useEffect } from 'react';
import {
    User,
    Settings,
    Search,
    Thermometer,
    Wind,
    CheckCircle2,
    TestTube,
    Battery,
    Disc,
    BarChart3,
    MousePointer2,
    Menu,
    ChevronDown,
    Plus,
    LayoutGrid,
    Lightbulb,
    Square,
    AlertTriangle,
    Clock,
    Target,
    Zap,
    Layers,
    Check,
    RotateCcw,
    Play,
    Cpu
} from 'lucide-react';

const AirCalibrationScreen = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibrationProgress, setCalibrationProgress] = useState(0);
    const [showAbortConfirm, setShowAbortConfirm] = useState(false);

    // Parameter Selections (Multi-select states)
    const [rotationSpeeds, setRotationSpeeds] = useState<string[]>(['1']);
    const [voltages, setVoltages] = useState<string[]>(['100', '140']);
    const [focuses, setFocuses] = useState<string[]>(['small']);
    const [collimators, setCollimators] = useState<string[]>(['32*0.6']);

    const toggleSelection = (val: string, current: string[], setter: (v: string[]) => void) => {
        if (current.includes(val)) {
            if (current.length > 1) {
                setter(current.filter(i => i !== val));
            }
        } else {
            setter([...current, val]);
        }
    };

    const totalCombinations = rotationSpeeds.length * focuses.length * voltages.length * collimators.length;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isCalibrating && !showAbortConfirm) {
            interval = setInterval(() => {
                setCalibrationProgress(prev => {
                    if (prev >= 100) {
                        setIsCalibrating(false);
                        return 100;
                    }
                    return prev + 0.5;
                });
            }, 100);
        }
        return () => clearInterval(interval!);
    }, [isCalibrating, showAbortConfirm]);

    const handleStartCalibration = () => {
        setCalibrationProgress(0);
        setIsCalibrating(true);
    };

    const handleAbort = () => {
        setShowAbortConfirm(true);
    };

    const confirmAbort = () => {
        setIsCalibrating(false);
        setShowAbortConfirm(false);
        setCalibrationProgress(0);
    };

    const sidebarItems = [
        { icon: <Thermometer size={18} />, label: "球管预热" },
        { icon: <Wind size={18} />, label: "空气校正", active: true },
        { icon: <CheckCircle2 size={18} />, label: "日常QA" },
        { icon: <TestTube size={18} />, label: "硬件测试" },
        { icon: <Battery size={18} />, label: "电池管理" },
        { icon: <Disc size={18} />, label: "磁盘管理" },
        { icon: <BarChart3 size={18} />, label: "性能评估" },
        { icon: <MousePointer2 size={18} />, label: "手动扫描" },
    ];

    const OptionButton = ({ label, unit, active, onClick }: { label: string, unit?: string, active: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`relative px-4 h-[38px] rounded-xl border transition-all duration-200 flex items-center gap-2 font-medium text-[13px] select-none ${
                active
                    ? 'bg-[#4D94FF] text-white border-[#4D94FF] shadow-[0_4px_12px_rgba(77,148,255,0.25)] hover:bg-[#3B82F6] scale-[1.01]'
                    : 'bg-white text-[#334155] border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-[#F8FAFC] hover:shadow-2xs active:scale-[0.98]'
            }`}
        >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}>
                {active ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />}
            </div>
            <span className="font-bold tracking-tight">{label}</span>
            {unit && <span className={`text-[11px] font-semibold ${active ? 'text-blue-50' : 'text-slate-400'}`}>{unit}</span>}
        </button>
    );

    return (
        <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl relative">

                {/* 1. Header */}
                <header className="flex items-center justify-between px-4 h-[80px] bg-[#E8EAF1] border-b border-[#B0C4DE] shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-sm min-w-[210px]">
                            <div className="w-10 h-10 rounded-sm bg-[#4A6982] flex items-center justify-center text-white opacity-90">
                                <User size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-[#263238]">暂无选中患者</span>
                                <span className="text-[12px] text-[#546E7A] font-medium leading-none mt-0.5">ID: —</span>
                            </div>
                            <div className="ml-auto flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                                <div className="text-[9px] font-bold italic">⊥ 60 mm</div>
                                <div className="text-[9px] font-bold">∠ 3.0°</div>
                                <div className="text-[9px] font-bold">🌡️ 60%</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">15:27</div>
                        <div className="text-[12px] text-[#546E7A] font-medium mt-1">3月2日 周一</div>
                    </div>

                    <div className="flex items-center gap-6 pr-2">
                        <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><Plus size={32} strokeWidth={1.5} /></div>
                        <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><LayoutGrid size={24} /></div>
                        <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Lightbulb size={24} /></div>
                        <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                            <Settings size={24} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">100</span>
                        </div>
                    </div>
                </header>

                {/* 2. Content Area */}
                <main className="flex-1 overflow-hidden p-4 flex gap-4 bg-[#EEF2F9]">
                    {/* Sidebar Card */}
                    <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[220px]'} bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col p-4 shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}>
                        <div className="flex items-center justify-between mb-6 h-10">
                            {!isCollapsed && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="text-[14px] font-black text-[#37474F] uppercase tracking-wider">服务模式</div>
                                    <div className="text-[10px] text-[#90A4AE] font-bold mt-0.5">硬件 / 空气校正</div>
                                </div>
                            )}
                            <div
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`w-9 h-9 rounded-md bg-white border border-[#B0C4DE] flex items-center justify-center text-[#546E7A] hover:bg-gray-50 cursor-pointer transition-all active:scale-95 shadow-sm ${isCollapsed ? 'mx-auto' : ''}`}
                            >
                                <Menu size={18} />
                            </div>
                        </div>

                        {!isCollapsed && (
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="关键字搜索..."
                                    className="w-full h-[36px] pl-10 pr-4 bg-white border border-[#B0C4DE] rounded-md text-[13px] focus:outline-none focus:border-[#4D94FF] focus:ring-1 focus:ring-[#4D94FF]/20"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={16} />
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-[#4D94FF] text-white rounded-md mb-4 shadow-sm`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white/20 rounded-md">
                                        <LayoutGrid size={20} />
                                    </div>
                                    {!isCollapsed && <span className="font-bold text-[14px]">硬件</span>}
                                </div>
                                {!isCollapsed && <ChevronDown size={18} className="opacity-60" />}
                            </div>

                            {sidebarItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-md cursor-pointer transition-all ${item.active ? 'bg-[#E3F2FD] text-[#1E88E5] border-l-4 border-[#1E88E5]' : 'text-[#546E7A] hover:bg-gray-50'}`}
                                >
                                    <div className={`${item.active ? 'text-[#1E88E5]' : 'text-[#90A4AE]'}`}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && <span className={`text-[13px] ${item.active ? 'font-bold' : 'font-medium'} whitespace-nowrap`}>{item.label}</span>}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Card */}
                    <section className="flex-1 bg-white border border-[#CBD5E1] rounded-xl shadow-xs p-6 flex flex-col relative overflow-hidden h-full">
                        <div className="flex-1 min-h-0 flex flex-col justify-between">
                            <div>
                                {/* Header Title Bar */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4D94FF] text-white flex items-center justify-center shadow-sm shrink-0">
                                            <Wind className="w-5 h-5 stroke-[2.2]" />
                                        </div>
                                        <div>
                                            <h2 className="text-[18px] font-black text-[#1E293B] tracking-tight">空气校正参数</h2>
                                            <p className="text-[12px] text-[#64748B]">请选择本次空气校正的参数组合。</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-[#E3F2FD] border border-[#BBDEFB] rounded-full text-[11px] font-bold text-[#1E88E5] flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#4D94FF] animate-pulse" />
                                        <span>{totalCombinations} 个组合待执行</span>
                                    </div>
                                </div>

                                {/* Parameter Cards Grid */}
                                <div className="grid grid-cols-2 gap-3.5 mt-4">
                                    {/* 1. Rotation Speed */}
                                    <div className="bg-[#F8FAFC]/90 border border-[#E2E8F0] rounded-xl p-3.5 transition-all hover:bg-slate-50">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[#E3F2FD] border border-[#BBDEFB] text-[#1E88E5] flex items-center justify-center">
                                                    <Clock className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[13px] font-black text-[#1E293B]">旋转时间</span>
                                                <span className="text-[10px] text-[#64748B]">(s)</span>
                                            </div>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]">
                                                已选 {rotationSpeeds.length}/3
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['1', '2', '0.75'].map(val => (
                                                <OptionButton
                                                    key={val}
                                                    label={val}
                                                    unit="s"
                                                    active={rotationSpeeds.includes(val)}
                                                    onClick={() => toggleSelection(val, rotationSpeeds, setRotationSpeeds)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Focus */}
                                    <div className="bg-[#F8FAFC]/90 border border-[#E2E8F0] rounded-xl p-3.5 transition-all hover:bg-slate-50">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[#E3F2FD] border border-[#BBDEFB] text-[#1E88E5] flex items-center justify-center">
                                                    <Target className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[13px] font-black text-[#1E293B]">焦点</span>
                                            </div>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]">
                                                已选 {focuses.length}/2
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['small', 'big'].map(val => (
                                                <OptionButton
                                                    key={val}
                                                    label={val === 'small' ? '小焦点' : '大焦点'}
                                                    active={focuses.includes(val)}
                                                    onClick={() => toggleSelection(val, focuses, setFocuses)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3. Voltage */}
                                    <div className="bg-[#F8FAFC]/90 border border-[#E2E8F0] rounded-xl p-3.5 transition-all hover:bg-slate-50">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[#E3F2FD] border border-[#BBDEFB] text-[#1E88E5] flex items-center justify-center">
                                                    <Zap className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[13px] font-black text-[#1E293B]">管电压</span>
                                                <span className="text-[10px] text-[#64748B]">(kV)</span>
                                            </div>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]">
                                                已选 {voltages.length}/4
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['80', '100', '120', '140'].map(val => (
                                                <OptionButton
                                                    key={val}
                                                    label={val}
                                                    unit="kV"
                                                    active={voltages.includes(val)}
                                                    onClick={() => toggleSelection(val, voltages, setVoltages)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* 4. Collimator Width */}
                                    <div className="bg-[#F8FAFC]/90 border border-[#E2E8F0] rounded-xl p-3.5 transition-all hover:bg-slate-50">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[#E3F2FD] border border-[#BBDEFB] text-[#1E88E5] flex items-center justify-center">
                                                    <Layers className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[13px] font-black text-[#1E293B]">准直器</span>
                                            </div>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]">
                                                已选 {collimators.length}/1
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['32*0.6'].map(val => (
                                                <OptionButton
                                                    key={val}
                                                    label={val}
                                                    active={collimators.includes(val)}
                                                    onClick={() => toggleSelection(val, collimators, setCollimators)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Matrix Calculation Summary */}
                                <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-[#F0F7FF] border border-[#BBDEFB] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-[#BBDEFB] shadow-2xs flex items-center justify-center text-[#1E88E5] shrink-0">
                                            <Cpu className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-bold text-[#1E293B] flex items-center gap-1.5">
                                                <span>校正组合矩阵</span>
                                                <span className="text-[11px] font-normal text-[#64748B]">({rotationSpeeds.length} 速度 × {focuses.length} 焦点 × {voltages.length} 电压 × {collimators.length} 准直器)</span>
                                            </div>
                                            <div className="text-[11px] text-[#64748B] mt-0.5">预计扫描时间: ~{Math.max(1, Math.round((totalCombinations * 10) / 60))} 分钟</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-semibold text-slate-500">待执行:</span>
                                        <span className="px-2.5 py-0.5 bg-white border border-[#BBDEFB] rounded-md text-[14px] font-black text-[#1E88E5]">
                                            {totalCombinations}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[12px] font-bold text-[#334155]">
                                    <span>队列数量：</span>
                                    <span className="px-2 py-0.5 rounded bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB] font-black">{totalCombinations}</span>
                                    <span className="text-[#64748B] text-[11px] font-normal ml-1">(已完成 0, 失败 0, 待执行 {totalCombinations})</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setRotationSpeeds(['1']);
                                            setVoltages(['100']);
                                            setFocuses(['small']);
                                            setCollimators(['32*0.6']);
                                        }}
                                        className="px-4 h-[38px] bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] font-bold rounded-xl transition-all shadow-2xs text-[12px] flex items-center gap-1.5 active:scale-95"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                                        <span>清空</span>
                                    </button>
                                    <button
                                        onClick={handleStartCalibration}
                                        className="flex items-center justify-center gap-2 px-6 h-[38px] bg-[#4D94FF] hover:bg-[#3B82F6] text-white font-black rounded-xl shadow-[0_6px_18px_rgba(77,148,255,0.25)] active:scale-95 text-[13px]"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>开始校正</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 3. Footer */}
                <footer className="h-[80px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center px-8 shrink-0">
                    <button className="h-[52px] px-10 bg-white border-2 border-[#B0C4DE] rounded-md text-[14px] font-bold text-[#37474F] hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                        首页
                    </button>
                    <div className="ml-8 text-[13px] text-[#546E7A] font-medium">
                        服务模式 · 硬件 / 空气校正
                    </div>
                </footer>

                {/* 4. Progress Overlay */}
                {isCalibrating && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
                        <div className="bg-white w-[640px] rounded-3xl shadow-2xl p-8 border border-slate-100 flex flex-col justify-between animate-in zoom-in-95 duration-300">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                                            <span>CALIBRATION IN PROGRESS</span>
                                        </div>
                                        <h2 className="text-[26px] font-black text-[#1E293B]">空气校正中...</h2>
                                    </div>
                                    <span className="text-[52px] font-black leading-none bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">{Math.floor(calibrationProgress)}%</span>
                                </div>

                                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 relative"
                                        style={{ width: `${calibrationProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-slate-500 font-bold">进度：</span>
                                    <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700">
                                        {calibrationProgress.toFixed(2)}%
                                    </div>
                                </div>
                                <button
                                    onClick={handleAbort}
                                    className="flex items-center gap-2 px-5 h-11 bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-xl shadow-2xs hover:bg-rose-100 transition-all active:scale-95 text-[14px]"
                                >
                                    <Square size={16} fill="currentColor" />
                                    <span>终止校正</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Abort Confirmation Modal */}
                {showAbortConfirm && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-[60] flex items-center justify-center animate-in fade-in duration-200">
                        <div className="bg-white w-[520px] rounded-3xl shadow-2xl border border-slate-100 p-8 animate-in zoom-in-95 duration-200">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[20px] font-black text-slate-800 mb-2">确认要终止空气校正吗？</h3>
                                    <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
                                        终止将停止后续采集，但已校正的部分将保留。
                                    </p>
                                    <div className="mt-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-[13px] font-bold text-blue-700 inline-block">
                                        已完成进度: {calibrationProgress.toFixed(2)}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setShowAbortConfirm(false)}
                                    className="flex-1 h-12 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-[15px] hover:bg-slate-50 transition-all active:scale-95 shadow-2xs"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={confirmAbort}
                                    className="flex-1 h-12 bg-rose-600 text-white font-bold rounded-xl text-[15px] hover:bg-rose-700 transition-all active:scale-95 shadow-md"
                                >
                                    确认终止
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default AirCalibrationScreen;

