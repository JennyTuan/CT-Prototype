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
    Clock,
    Circle
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

const ScoutScanScreen = () => {
    const [startPos, setStartPos] = useState("472.95");
    const [endPos, setEndPos] = useState("595.17");

    // Initial data
    const [groups, setGroups] = useState<ProtocolGroup[]>([
        {
            id: 'g1',
            name: 'Head_FacialBoneVolume',
            sequences: [
                { id: 's1', name: 'Scout', steps: ['打开激光灯获取定位', '确认参数', '执行扫描'] }
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

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = () => {
        if (selectedIds.length === 0) return;

        // Filter out selected groups and sequences
        setGroups(prev => prev
            .filter(g => !selectedIds.includes(g.id))
            .map(g => ({
                ...g,
                sequences: g.sequences.filter(s => !selectedIds.includes(s.id))
            }))
            .filter(g => g.sequences.length > 0 || !['g1', 'g2'].includes(g.id)) // Keep top levels if needed, or refine filter
        );
        setSelectedIds([]);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F0F4F9] p-2 text-[#37474F] font-sans select-none">
            {/* 主容器 1024x768 */}
            <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl relative">

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
                                    onClick={handleDelete}
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
                                                {/* Active Sequence Style */}
                                                <div className="flex items-center gap-2 px-2 py-2 bg-[#4D94FF] text-white rounded-md ml-4 shadow-sm mb-1">
                                                    <ChevronDown size={14} />
                                                    <div
                                                        onClick={(e) => { e.stopPropagation(); toggleSelection(seq.id); }}
                                                        className={`w-4 h-4 rounded-sm border border-white/30 cursor-pointer flex items-center justify-center transition-all ${selectedIds.includes(seq.id) ? 'bg-white border-white' : 'bg-white/20'}`}
                                                    >
                                                        {selectedIds.includes(seq.id) && <div className="w-1.5 h-1.5 bg-[#4D94FF] rounded-full"></div>}
                                                    </div>
                                                    <span className="text-[13px] font-bold">{seq.name}</span>
                                                </div>

                                                {/* Workflow Steps - Only for active/expanded sequences */}
                                                {seq.steps && seq.steps.length > 0 && (
                                                    <div className="flex flex-col ml-10 mt-2 gap-4 relative pb-4">
                                                        <div className="absolute left-[7px] top-2 bottom-6 w-[1px] bg-[#B0C4DE]"></div>

                                                        <div className="flex items-center gap-3 z-10 group">
                                                            <div className="w-4 h-4 rounded-full bg-white border border-[#B0C4DE] flex items-center justify-center">
                                                                <Clock size={10} className="text-[#37474F]" />
                                                            </div>
                                                            <span className="text-[13px] font-bold text-[#37474F]">打开激光灯获取定位</span>
                                                        </div>

                                                        <div className="flex items-center gap-3 z-10">
                                                            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#4D94FF] translate-x-[1px]"></div>
                                                            <span className="text-[13px] font-bold text-[#37474F]">确认参数</span>
                                                        </div>

                                                        <div className="flex items-center gap-3 z-10">
                                                            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#4D94FF] translate-x-[1px]"></div>
                                                            <span className="text-[13px] font-bold text-[#37474F]">执行扫描</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Positioning Controls - Card Footer Style (Expands when tree is collapsed) */}
                        <div className={`border-t border-[#EEF2F9] bg-[#F8FAFC] p-4 flex flex-col justify-center gap-4 shrink-0 transition-all duration-300 ${isTreeCollapsed ? 'flex-1 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'h-[140px]'}`}>
                            <div className="flex items-center gap-2">
                                <Circle size={12} className="text-[#90A4AE] border-2 border-white rounded-full shrink-0" />
                                <span className="text-[12px] font-bold text-[#90A4AE] w-[72px] shrink-0">起始位置 :</span>
                                <input
                                    type="text"
                                    value={startPos}
                                    onChange={(e) => setStartPos(e.target.value)}
                                    className="flex-1 min-w-0 h-[32px] bg-white border border-[#B0C4DE] rounded px-2 text-[13px] font-bold text-[#90A4AE] outline-none focus:border-[#4D94FF]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#66BB6A] border-2 border-white flex items-center justify-center p-[2px] shrink-0">
                                    <div className="w-full h-full bg-white rounded-full"></div>
                                </div>
                                <span className="text-[12px] font-bold text-[#66BB6A] w-[72px] shrink-0">结束位置 :</span>
                                <input
                                    type="text"
                                    value={endPos}
                                    onChange={(e) => setEndPos(e.target.value)}
                                    className="flex-1 min-w-0 h-[32px] bg-white border border-[#B0C4DE] rounded px-2 text-[13px] font-bold text-[#66BB6A] outline-none focus:border-[#4D94FF]"
                                />
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

                {/* 3. Footer (Nav Buttons) - Refined Parity */}
                <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8 z-10">
                    <div className="flex-1">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-solid shadow-sm transition-all uppercase text-[13px] active:scale-95">
                            <ChevronLeft size={20} /> 上一步
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button className="flex items-center gap-3 px-14 h-[52px] bg-[#4D94FF] text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition-all uppercase text-[13px] tracking-widest active:scale-95">
                            下一步 <ChevronRight size={20} />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ScoutScanScreen;
