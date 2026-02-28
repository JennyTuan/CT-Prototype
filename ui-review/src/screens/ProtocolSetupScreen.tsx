import { useState } from "react";
import {
    User,
    Settings,
    Sun,
    Plus,
    Copy,
    Trash2,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Monitor,
    RefreshCw,
    Check,
    Target,
    CircleDot,
    Info,
    UserCheck,
    AlertTriangle,
    Activity,
} from "lucide-react";

const ProtocolSetupScreen = () => {
    const [activeTab, setActiveTab] = useState<"scan" | "recon">("scan");
    const [libraryTab, setLibraryTab] = useState<"spiral" | "axial">("spiral");
    const [selectedProtocol, setSelectedProtocol] = useState<number>(2);
    const [positioning, setPositioning] = useState<"HFS" | "FFS" | "HFP" | "FFP">("HFS");
    const [planListOpen, setPlanListOpen] = useState(true);

    // 选中序列ID和重建方案索引
    const [selectedSeqId, setSelectedSeqId] = useState("seq-2");
    const [selectedReconIndex, setSelectedReconIndex] = useState(0);

    // 多选删除相关
    const [checkedSeqIds, setCheckedSeqIds] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const toggleCheckSeq = (seqId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCheckedSeqIds(prev =>
            prev.includes(seqId) ? prev.filter(id => id !== seqId) : [...prev, seqId]
        );
    };

    const handleDeleteClick = () => {
        if (checkedSeqIds.length === 0) return;
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setScanPlans(prev => prev
            .map(plan => ({
                ...plan,
                sequences: plan.sequences.filter(s => !checkedSeqIds.includes(s.id))
            }))
            .filter(plan => plan.sequences.length > 0)
        );
        setCheckedSeqIds([]);
        setShowDeleteConfirm(false);
        setSelectedSeqId("");
    };

    const [scanPlans, setScanPlans] = useState([
        {
            id: "plan-1",
            title: "HEAD_ROUTINE_01",
            sequences: [
                {
                    id: "seq-1",
                    name: "定位像 (Scout)",
                    status: "DONE",
                    type: "scout",
                    icon: <Target size={14} />,
                    scanParams: [
                        { label: "MA", value: "10", options: ["10", "15", "20", "30", "50", "100"] },
                        { label: "KV", value: "80", options: ["80", "100", "120", "140"] },
                        { label: "SLICE", value: "1.0mm" },
                        { label: "FOV", value: "250mm" },
                        { label: "LEN", value: "300mm" },
                        { label: "DIR", value: "0°" },
                    ],
                    reconPlans: [
                        {
                            name: "R1",
                            params: [
                                { label: "THICK", value: "1.0mm" },
                                { label: "INT", value: "1.0mm" },
                                { label: "KER", value: "Standard" },
                                { label: "MAT", value: "512" },
                            ],
                        },
                    ],
                },
                {
                    id: "seq-2",
                    name: "螺旋扫描 (Spiral)",
                    status: "ACTIVE",
                    type: "spiral",
                    icon: <RefreshCw size={14} />,
                    scanParams: [
                        { label: "MA", value: "30", options: ["10", "15", "30", "50", "100", "150", "200"] },
                        { label: "KV", value: "120", options: ["80", "100", "120", "140"] },
                        { label: "SLICE", value: "0.625mm" },
                        { label: "FOV", value: "220mm" },
                        { label: "PITCH", value: "1.0", highlight: true },
                        { label: "ROTATION", value: "0.5s" },
                    ],
                    reconPlans: [
                        {
                            name: "R1",
                            params: [
                                { label: "THICK", value: "0.625mm" },
                                { label: "INT", value: "0.625mm" },
                                { label: "KER", value: "Bone" },
                                { label: "MAT", value: "512" },
                                { label: "ASIR", value: "30%" },
                            ],
                        },
                        {
                            name: "R2",
                            params: [
                                { label: "THICK", value: "2.5mm" },
                                { label: "INT", value: "2.5mm" },
                                { label: "KER", value: "Soft" },
                                { label: "MAT", value: "512" },
                                { label: "ASIR", value: "Off" },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "plan-2",
            title: "CHEST_SCAN_02",
            sequences: [
                {
                    id: "seq-3",
                    name: "胸部定位像",
                    status: "PENDING",
                    type: "scout",
                    icon: <Target size={14} />,
                    scanParams: [
                        { label: "MA", value: "15", options: ["10", "15", "30", "50", "100"] },
                        { label: "KV", value: "100", options: ["80", "100", "120", "140"] },
                        { label: "FOV", value: "350mm" },
                    ],
                    reconPlans: [{ name: "R1", params: [{ label: "THICK", value: "5mm" }] }],
                },
                {
                    id: "seq-4",
                    name: "螺旋扫描",
                    status: "PENDING",
                    type: "spiral",
                    icon: <RefreshCw size={14} />,
                    scanParams: [
                        { label: "MA", value: "100", options: ["10", "15", "30", "50", "100", "150", "200"] },
                        { label: "KV", value: "120", options: ["80", "100", "120", "140"] },
                        { label: "FOV", value: "380mm" },
                    ],
                    reconPlans: [
                        { name: "R1", params: [{ label: "THICK", value: "1.25mm" }] },
                        { name: "R2", params: [{ label: "THICK", value: "5.0mm" }] },
                        { name: "R3", params: [{ label: "THICK", value: "MIP" }] },
                    ],
                },
            ],
        },
    ]);

    // 获取当前选中的序列对象
    const allSequences = scanPlans.flatMap((p) => p.sequences);
    const activeSeq = allSequences.find((s) => s.id === selectedSeqId) || allSequences[0];

    const libraryData = [
        { id: 1, name: "HEAD_SCOUT_STANDARD", region: "Head" },
        { id: 2, name: "HEAD_SPIRAL_ULTRA", region: "Head" },
        { id: 3, name: "HEAD_BONE_CONTRAST", region: "Head" },
        { id: 4, name: "NECK_SPIRAL_V5", region: "Neck" },
        { id: 5, name: "CHEST_LOW_Dose", region: "Chest" },
        { id: 6, name: "ABDOMEN_3PHASE", region: "Abdomen" },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F0F4F9] p-2 text-[#37474F] font-sans select-none">
            <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl">
                {/* Header */}
                <header className="flex items-center justify-between px-4 h-[80px] bg-[#E8EAF1] border-b border-[#B0C4DE] shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-sm min-w-[210px]">
                            <div className="w-10 h-10 rounded-sm bg-[#4A6982] flex items-center justify-center text-white opacity-90">
                                <User size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-bold tracking-tight">Roky Zhang</span>
                                <span className="text-[12px] text-[#546E7A] font-medium leading-none mt-0.5 opacity-80">
                                    ID: 12345678
                                </span>
                            </div>
                            <div className="ml-auto flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                                <div className="text-[9px] font-bold italic tracking-tighter">⊥ 0</div>
                                <div className="text-[9px] font-bold tracking-tighter">∠ 0</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">13:52</div>
                        <div className="text-[11px] text-[#546E7A] font-bold mt-1 uppercase opacity-70">
                            2月26日 周四
                        </div>
                    </div>

                    <div className="flex items-center gap-5 pr-2">
                        <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70">
                            <UserCheck size={32} strokeWidth={1.5} />
                        </div>
                        <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                            <Monitor size={24} />
                        </div>
                        <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                            <Sun size={24} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">
                                5
                            </span>
                        </div>
                        <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                            <Settings size={24} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">
                                10
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 overflow-hidden p-[16px] flex gap-[16px] bg-[#EEF2F9]">
                    {/* Left */}
                    <aside className="w-[310px] flex flex-col bg-white border border-[#B0C4DE] rounded-md shadow-sm overflow-hidden">
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#EEF2F9] flex justify-between items-center shrink-0">
                                <button
                                    className="flex items-center gap-2 flex-1 min-w-0"
                                    onClick={() => setPlanListOpen((v) => !v)}
                                >
                                    <Activity size={14} className="text-[#4D94FF] shrink-0" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-[#37474F]">
                                        扫描计划
                                    </span>
                                    {planListOpen
                                        ? <ChevronUp size={14} className="text-[#90A4AE] ml-1" />
                                        : <ChevronDown size={14} className="text-[#90A4AE] ml-1" />
                                    }
                                </button>
                                <div className="flex items-center gap-1">
                                    {/* 新增序列 */}
                                    <button
                                        title="新增序列"
                                        className="w-[44px] h-[44px] flex items-center justify-center rounded-md text-[#4D94FF] hover:bg-[#E3F2FD] active:bg-[#BBDEFB] transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                    {/* 复制序列 */}
                                    <button
                                        title="复制序列"
                                        className="w-[44px] h-[44px] flex items-center justify-center rounded-md text-[#4D94FF] hover:bg-[#E3F2FD] active:bg-[#BBDEFB] transition-colors"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    {/* 删除序列 */}
                                    <button
                                        title="删除已选序列"
                                        onClick={handleDeleteClick}
                                        className={`w-[44px] h-[44px] flex items-center justify-center rounded-md transition-colors ${checkedSeqIds.length > 0
                                            ? 'text-[#D32F2F] hover:bg-[#FFEBEE] active:bg-[#FFCDD2]'
                                            : 'text-[#B0C4DE] cursor-not-allowed'
                                            }`}
                                    >
                                        <Trash2 size={18} />
                                        {checkedSeqIds.length > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D32F2F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                                {checkedSeqIds.length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {planListOpen && (
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {scanPlans.map((plan) => (
                                        <div key={plan.id} className="border-b border-gray-100/50">
                                            {/* 计划标题行 - 左滑删除实现 */}
                                            <div className="h-[32px] px-4 flex items-center gap-2 bg-[#F8FAFC] border-b border-[#EEF2F9]">
                                                <CircleDot
                                                    size={8}
                                                    className={selectedSeqId && plan.sequences.some(s => s.id === selectedSeqId) ? "text-[#4D94FF]" : "text-[#94A3B8]"}
                                                />
                                                <span className="text-[10px] font-black tracking-tight text-[#546E7A]">
                                                    {plan.title}
                                                </span>
                                            </div>

                                            {plan.sequences.map((seq) => (
                                                <div
                                                    key={seq.id}
                                                    onClick={() => {
                                                        setSelectedSeqId(seq.id);
                                                        setSelectedReconIndex(0);
                                                    }}
                                                    className={`h-[36px] flex items-center px-8 gap-3 cursor-pointer relative ${checkedSeqIds.includes(seq.id)
                                                        ? 'bg-[#F3F8FF]'
                                                        : selectedSeqId === seq.id
                                                            ? 'bg-[#E3F2FD] border-l-4 border-[#4D94FF]'
                                                            : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-gray-100"></div>
                                                    <div className="absolute left-5 top-1/2 w-2 h-[1px] bg-gray-100"></div>

                                                    {/* Checkbox */}
                                                    <div
                                                        onClick={(e) => toggleCheckSeq(seq.id, e)}
                                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checkedSeqIds.includes(seq.id)
                                                            ? 'bg-[#4D94FF] border-[#4D94FF]'
                                                            : 'bg-white border-[#B0C4DE] hover:border-[#4D94FF]'
                                                            }`}
                                                    >
                                                        {checkedSeqIds.includes(seq.id) && <Check size={10} className="text-white stroke-[3]" />}
                                                    </div>

                                                    <span
                                                        className={`text-[12px] font-bold ${checkedSeqIds.includes(seq.id)
                                                            ? 'text-[#546E7A]'
                                                            : selectedSeqId === seq.id
                                                                ? 'text-[#1E88E5]'
                                                                : 'text-[#546E7A]'
                                                            }`}
                                                    >
                                                        {seq.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Params */}
                        <div className="shrink-0 bg-[#F8FAFC] border-t border-[#EEF2F9] p-3 flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-3 bg-[#4D94FF] rounded-full"></div>
                                        <span className="text-[10px] font-black uppercase tracking-tight text-[#37474F]">
                                            参数详情 ({activeSeq.type?.toUpperCase()})
                                        </span>
                                    </div>
                                    <div className="flex bg-white rounded-md border border-[#B0C4DE]/50 p-0.5 h-[28px]">
                                        <button
                                            onClick={() => setActiveTab("scan")}
                                            className={`px-4 text-[10px] font-bold rounded-md transition-all ${activeTab === "scan" ? "bg-[#4D94FF] text-white shadow-sm" : "text-[#4D94FF]"
                                                }`}
                                        >
                                            扫描
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("recon")}
                                            className={`px-4 text-[10px] font-bold rounded-md transition-all ${activeTab === "recon" ? "bg-[#4D94FF] text-white shadow-sm" : "text-[#4D94FF]"
                                                }`}
                                        >
                                            重建
                                        </button>
                                    </div>
                                </div>

                                {/* 重建方案切换栏 (仅在重建 Tab 且有多个方案时显示) */}
                                {activeTab === "recon" && activeSeq.reconPlans && (
                                    <div className="flex gap-1">
                                        {activeSeq.reconPlans.map((plan, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedReconIndex(idx)}
                                                className={`h-[24px] px-3 rounded text-[10px] font-black transition-all border ${selectedReconIndex === idx
                                                    ? "bg-[#4D94FF] text-white border-[#4D94FF] shadow-sm"
                                                    : "bg-white text-[#90A4AE] border-[#B0C4DE]/30 hover:border-[#4D94FF] hover:text-[#4D94FF]"
                                                    }`}
                                            >
                                                {plan.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {activeTab === "scan"
                                    ? activeSeq.scanParams?.map((p, i) => (
                                        <ParamBox key={i} label={p.label} value={p.value} highlight={p.highlight} options={p.options} />
                                    ))
                                    : activeSeq.reconPlans?.[selectedReconIndex]?.params?.map((p, i) => (
                                        <ParamBox key={i} label={p.label} value={p.value} />
                                    ))}
                            </div>

                            <button className="h-[32px] w-full bg-white border border-[#B0C4DE] rounded-md text-[10px] font-bold text-[#4D94FF] flex items-center justify-center gap-1 hover:bg-blue-50 transition-all shadow-sm">
                                <Info size={14} /> 更多详情
                            </button>
                        </div>
                    </aside >

                    {/* Center */}
                    < section className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col relative overflow-hidden" >
                        <div className="h-[44px] bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#37474F]">
                                解剖区域确认
                            </span>
                        </div>

                        <div className="flex-1 bg-white"></div>
                    </section >

                    {/* Right */}
                    < aside className="w-[360px] flex flex-col" >
                        <div className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col overflow-hidden">
                            {/* 协议库 tabs */}
                            <div className="flex h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] p-1.5 gap-1.5 shrink-0">
                                <button
                                    onClick={() => setLibraryTab("spiral")}
                                    className={`flex-1 text-[12px] font-black rounded-md transition-all ${libraryTab === "spiral"
                                        ? "bg-[#4D94FF] text-white shadow-md"
                                        : "bg-white text-[#4D94FF] hover:bg-gray-50"
                                        }`}
                                >
                                    螺旋协议
                                </button>
                                <button
                                    onClick={() => setLibraryTab("axial")}
                                    className={`flex-1 text-[12px] font-black rounded-md transition-all ${libraryTab === "axial"
                                        ? "bg-[#4D94FF] text-white shadow-md"
                                        : "bg-white text-[#4D94FF] hover:bg-gray-50"
                                        }`}
                                >
                                    断层协议
                                </button>
                            </div>

                            {/* 协议列表 */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#4D94FF] text-white sticky top-0 h-[44px] text-[11px] uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="w-[50px] text-center border-r border-white/10">选</th>
                                            <th className="px-4 border-r border-white/10">协议名称</th>
                                            <th className="w-[80px] text-center px-2">区域</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {libraryData.map((item) => (
                                            <tr
                                                key={item.id}
                                                onClick={() => setSelectedProtocol(item.id)}
                                                className={`h-[52px] cursor-pointer transition-colors ${selectedProtocol === item.id ? "bg-[#E3F2FD]" : "hover:bg-[#F9FBFC]"
                                                    }`}
                                            >
                                                <td className="text-center">
                                                    <div
                                                        className={`w-5 h-5 rounded-md border-2 mx-auto flex items-center justify-center transition-all ${selectedProtocol === item.id
                                                            ? "bg-[#4D94FF] border-[#4D94FF]"
                                                            : "bg-white border-[#B0C4DE]/50"
                                                            }`}
                                                    >
                                                        {selectedProtocol === item.id && (
                                                            <Check size={14} className="text-white stroke-[4px]" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 text-[12px] font-bold text-[#546E7A]">{item.name}</td>
                                                <td className="text-[10px] text-center text-[#90A4AE] font-mono">{item.region}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 摆位关联设置 — 同一张卡内的子分区 */}
                            <div className="shrink-0 border-t-2 border-[#EEF2F9] bg-[#F8FAFC] px-4 pt-3 pb-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-3 bg-[#4D94FF] rounded-full"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#37474F]">
                                        摆位关联设置
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-3 h-[52px]">
                                    {(["HFS", "FFS", "HFP", "FFP"] as const).map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPositioning(pos)}
                                            className={`h-full rounded-md border-2 font-black text-[13px] shadow-sm transition-all flex items-center justify-center ${positioning === pos
                                                ? "bg-white border-[#4D94FF] text-[#4D94FF] ring-2 ring-[#4D94FF]/10"
                                                : "bg-white border-[#B0C4DE]/40 text-[#B0C4DE] hover:border-[#B0C4DE]"
                                                }`}
                                        >
                                            {pos}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside >
                </main >

                {/* Footer */}
                < footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8" >
                    <div className="flex-1">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-blue-50 transition-all uppercase text-[13px] shadow-sm active:scale-95">
                            <ChevronLeft size={20} /> 上一步
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-[#4D94FF] text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition-all uppercase text-[13px] active:scale-95">
                            下一步 <ChevronRight size={20} />
                        </button>
                    </div>
                </footer >

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-[#B0C4DE] w-[360px] overflow-hidden">
                            {/* Dialog Header */}
                            <div className="flex items-center gap-3 px-5 py-4 bg-[#FFF8E1] border-b border-[#FFE082]">
                                <div className="w-9 h-9 rounded-full bg-[#F57C00]/10 flex items-center justify-center shrink-0">
                                    <AlertTriangle size={18} className="text-[#F57C00]" />
                                </div>
                                <div>
                                    <div className="text-[14px] font-black text-[#37474F]">确认删除序列</div>
                                    <div className="text-[11px] text-[#78909C] mt-0.5">此操作不可恢复</div>
                                </div>
                            </div>
                            {/* Dialog Body */}
                            <div className="px-5 py-4">
                                <p className="text-[13px] text-[#546E7A] leading-relaxed">
                                    即将删除以下 <span className="font-black text-[#D32F2F]">{checkedSeqIds.length}</span> 个序列：
                                </p>
                                <ul className="mt-2 flex flex-col gap-1.5">
                                    {checkedSeqIds.map(id => {
                                        const seq = scanPlans.flatMap(p => p.sequences).find(s => s.id === id);
                                        return seq ? (
                                            <li key={id} className="flex items-center gap-2 text-[12px] text-[#37474F] font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                                                {seq.name}
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                            {/* Dialog Footer */}
                            <div className="flex gap-2 px-5 pb-5">
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
            </div >
        </div >
    );
};

type ParamBoxProps = {
    label: string;
    value: string;
    highlight?: boolean;
    options?: string[];
    onChange?: (val: string) => void;
};

const ParamBox = ({ label, value, highlight = false, options, onChange }: ParamBoxProps) => (
    <div
        className={`p-2 rounded-md border flex flex-col items-center justify-center transition-all shadow-sm relative group ${highlight ? "bg-[#E3F2FD] border-[#4D94FF]" : "bg-white border-[#B0C4DE]/30"
            }`}
    >
        <span
            className={`text-[8px] font-black uppercase leading-none tracking-tighter ${highlight ? "text-[#4D94FF]" : "text-[#90A4AE]"
                }`}
        >
            {label}
        </span>
        {options ? (
            <div className="relative mt-1 flex items-center">
                <select
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`text-[14px] font-black font-mono bg-transparent appearance-none pr-3 cursor-pointer focus:outline-none ${highlight ? "text-[#1E88E5]" : "text-[#37474F]"
                        }`}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown size={10} className="absolute right-0 pointer-events-none text-[#90A4AE] group-hover:text-[#4D94FF] transition-colors" />
            </div>
        ) : (
            <span
                className={`text-[14px] font-black font-mono mt-1 ${highlight ? "text-[#1E88E5]" : "text-[#37474F]"
                    }`}
            >
                {value}
            </span>
        )}
    </div>
);



export default ProtocolSetupScreen;
