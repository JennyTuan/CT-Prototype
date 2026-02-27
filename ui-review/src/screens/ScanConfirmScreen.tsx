import { useState } from "react";
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
    CheckCircle,
    StretchHorizontal
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

const ScanConfirmScreen = () => {
    const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
    const [bedMode, setBedMode] = useState<"in" | "out">("in");

    // Data structure with sequences at the same level
    const [groups] = useState<ProtocolGroup[]>([
        {
            id: 'g1',
            name: 'Head_FacialBoneVolume',
            sequences: [
                { id: 's1', name: 'Scout', steps: ['打开激光灯获取定位', '确认参数', '执行扫描'] },
                { id: 's2', name: 'Helical Scan', steps: ['参数确认', '执行扫描'] }
            ]
        }
    ]);

    const [expandedSeqId, setExpandedSeqId] = useState<string | null>('s1');

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F0F4F9] p-2 text-[#37474F] font-sans select-none">
            {/* 主容器 1024x768 */}
            <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl relative">

                {/* 1. Header (System Info) */}
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

                {/* 2. Main Content Area */}
                <main className="flex-1 flex overflow-hidden p-4 gap-4">

                    {/* Left Sidebar Card */}
                    <aside className="w-[264px] bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden shrink-0">
                        {/* Sidebar Toolbar - Precise match to screenshot */}
                        <div className="h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center justify-between px-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 text-[#546E7A] hover:bg-[#EEF2F9] rounded transition-all"><FilePlus size={18} /></button>
                                <button className="p-1.5 text-[#90A4AE] opacity-40 cursor-not-allowed"><Trash2 size={18} /></button>
                            </div>
                            <button
                                onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                                className="p-1.5 text-[#4D94FF] hover:bg-[#EEF2F9] rounded transition-all"
                            >
                                {isTreeCollapsed ? <ChevronDown size={20} /> : <ChevronsUp size={20} />}
                            </button>
                        </div>

                        {/* Protocol Tree Summary - Fixed Hierarchy */}
                        <div className={`overflow-y-auto p-2 flex flex-col gap-0 transition-all duration-300 ${isTreeCollapsed ? 'h-[48px] opacity-40 grayscale overflow-hidden' : 'h-[240px]'}`}>
                            {groups.map(group => (
                                <div key={group.id} className="flex flex-col">
                                    <div className="flex items-center gap-2 px-2 py-1.5 text-[#37474F]">
                                        <ChevronDown size={14} className="opacity-40" />
                                        <div className="w-3.5 h-3.5 rounded-sm border border-[#B0C4DE] bg-white"></div>
                                        <span className="text-[13px] font-bold truncate text-[#37474F]">{group.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        {group.sequences.map(seq => {
                                            const isExpanded = expandedSeqId === seq.id;
                                            const isActive = seq.id === 's1';

                                            return (
                                                <div key={seq.id} className="mb-1">
                                                    <div
                                                        onClick={() => setExpandedSeqId(isExpanded ? null : seq.id)}
                                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md ml-4 shadow-sm cursor-pointer transition-all ${isActive ? 'bg-[#4D94FF] text-white' : 'text-[#37474F] hover:bg-gray-50 mr-1'}`}
                                                    >
                                                        {isExpanded ? <ChevronDown size={14} className={isActive ? "text-white/70" : "text-gray-400"} /> : <ChevronRight size={14} className={isActive ? "text-white/70" : "text-gray-400"} />}
                                                        <div className={`w-3.5 h-3.5 rounded-sm border ${isActive ? 'bg-white/20 border-white/30' : 'bg-white border-[#B0C4DE]'}`}></div>
                                                        <span className="text-[13px] font-bold">{seq.name}</span>
                                                    </div>

                                                    {/* Toggleable Workflow Steps */}
                                                    {isExpanded && seq.steps && seq.steps.length > 0 && (
                                                        <div className="flex flex-col ml-12 mt-2 gap-4 relative pb-4">
                                                            {/* Connector Line */}
                                                            <div className="absolute left-[7px] top-2 bottom-6 w-[1px] bg-[#B0C4DE]"></div>

                                                            {seq.steps.map((step, idx) => {
                                                                const isStepCompleted = seq.id === 's1' && idx === 0;
                                                                const isStepInProgress = seq.id === 's1' && idx === 1;

                                                                return (
                                                                    <div key={idx} className="flex items-center gap-3 z-10">
                                                                        {isStepCompleted ? (
                                                                            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                                                                <CheckCircle size={16} className="text-[#66BB6A]" />
                                                                            </div>
                                                                        ) : isStepInProgress ? (
                                                                            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#4D94FF] translate-x-[1px] shadow-[0_0_8px_rgba(77,148,255,0.3)]"></div>
                                                                        ) : (
                                                                            <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#B0C4DE] translate-x-[1px]"></div>
                                                                        )}
                                                                        <span className={`text-[12px] font-bold ${isStepInProgress ? 'text-[#37474F]' : 'text-[#37474F]/60'}`}>
                                                                            {step}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* New Parameter Confirmation Area */}
                        <div className="flex-1 border-t border-[#EEF2F9] bg-[#F8FAFC] flex flex-col overflow-hidden">
                            {/* In/Out Toggle */}
                            <div className="p-3 flex justify-center">
                                <div className="flex w-full h-[36px] bg-white border border-[#B0C4DE] rounded-sm overflow-hidden p-[2px]">
                                    <button
                                        onClick={() => setBedMode("in")}
                                        className={`flex-1 flex items-center justify-center text-[12px] font-bold rounded-sm transition-all ${bedMode === "in" ? 'bg-[#4D94FF] text-white shadow-inner' : 'text-[#90A4AE] hover:bg-gray-50'}`}
                                    >
                                        进床
                                    </button>
                                    <button
                                        onClick={() => setBedMode("out")}
                                        className={`flex-1 flex items-center justify-center text-[12px] font-bold rounded-sm transition-all ${bedMode === "out" ? 'bg-[#4D94FF] text-white shadow-inner' : 'text-[#90A4AE] hover:bg-gray-50'}`}
                                    >
                                        出床
                                    </button>
                                </div>
                            </div>

                            {/* Reorganized Parameter Grid - 2 Column Layout */}
                            <div className="flex-1 px-4 py-3 flex flex-col gap-4 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Scan Length */}
                                    <div className="p-2 bg-white border border-[#B0C4DE]/40 rounded-md flex flex-col items-center justify-center shadow-sm">
                                        <span className="text-[9px] font-black text-[#90A4AE] uppercase tracking-tighter">扫描长度</span>
                                        <span className="text-[14px] font-black text-[#B0BEC5] mt-0.5">122.00</span>
                                    </div>

                                    {/* mA */}
                                    <div className="p-2 bg-white border border-[#B0C4DE]/40 rounded-md flex flex-col items-center justify-center shadow-sm group hover:border-[#4D94FF] cursor-pointer">
                                        <span className="text-[9px] font-black text-[#90A4AE] uppercase tracking-tighter">mA</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[14px] font-black text-[#37474F]">10</span>
                                            <ChevronDown size={10} className="text-[#90A4AE] group-hover:text-[#4D94FF]" />
                                        </div>
                                    </div>

                                    {/* KV */}
                                    <div className="p-2 bg-white border border-[#B0C4DE]/40 rounded-md flex flex-col items-center justify-center shadow-sm group hover:border-[#4D94FF] cursor-pointer">
                                        <span className="text-[9px] font-black text-[#90A4AE] uppercase tracking-tighter">KV</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[14px] font-black text-[#37474F]">80</span>
                                            <ChevronDown size={10} className="text-[#90A4AE] group-hover:text-[#4D94FF]" />
                                        </div>
                                    </div>

                                    {/* Plane Angle */}
                                    <div className="p-2 bg-white border border-[#B0C4DE]/40 rounded-md flex flex-col items-center justify-center shadow-sm group hover:border-[#4D94FF] cursor-pointer">
                                        <span className="text-[9px] font-black text-[#90A4AE] uppercase tracking-tighter">平扫角度</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[14px] font-black text-[#37474F]">90</span>
                                            <ChevronDown size={10} className="text-[#90A4AE] group-hover:text-[#4D94FF]" />
                                        </div>
                                    </div>

                                    {/* Body Position (Full width or double? Keeping single for now to match 2-col requested) */}
                                    <div className="p-2 bg-white border border-[#B0C4DE]/40 rounded-md flex flex-col items-center justify-center shadow-sm group hover:border-[#4D94FF] cursor-pointer col-span-2">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <StretchHorizontal size={14} className="text-[#4D94FF]" />
                                            <span className="text-[9px] font-black text-[#90A4AE] uppercase tracking-tighter">体位 (Position)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-black text-[#37474F]">HFS</span>
                                            <ChevronDown size={12} className="text-[#90A4AE] group-hover:text-[#4D94FF]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Button */}
                            <div className="p-4 pt-1 flex justify-end shrink-0">
                                <button className="h-[32px] px-3 bg-white border-2 border-[#4D94FF] rounded text-[12px] font-bold text-[#37474F] hover:bg-blue-50 active:scale-95 transition-all shadow-sm">
                                    参数详情
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Viewport Card */}
                    <section className="flex-1 bg-[#1A222B] rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden relative">
                        {/* Mock Viewport Content */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full opacity-10 bg-gradient-to-br from-blue-900/40 to-transparent flex items-center justify-center text-[#546E7A] uppercase font-thin text-[52px] tracking-[16px]">
                                Viewport
                            </div>
                        </div>
                    </section>
                </main>

                {/* 3. Footer (Nav Buttons) */}
                <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8 z-10">
                    <div className="flex-1">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-solid shadow-sm transition-all uppercase text-[13px] active:scale-95">
                            <ChevronLeft size={20} /> 上一步
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button className="flex items-center gap-3 px-14 h-[52px] bg-[#4D94FF] text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition-all uppercase text-[13px] tracking-widest active:scale-95">
                            执行扫描 <ChevronRight size={20} />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ScanConfirmScreen;
