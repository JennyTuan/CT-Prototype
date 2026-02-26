import { useState } from 'react';
import {
    User,
    Settings,
    Sun,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Monitor,
    RefreshCw,
    Search,
    Download,
    Eye,
    Image as ImageIcon,
    ChevronsLeft,
    ChevronsRight,
    UserCheck
} from 'lucide-react';

import AddPatientScreen from './AddPatientScreen';

const PatientListScreen = () => {
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // 模拟患者列表数据
    const patientData = [
        { id: 1, serial: 6, patientId: 'P001', name: '张三', gender: '男', age: 45, type: 'CT胸部扫描' },
        { id: 2, serial: 6, patientId: 'P002', name: '李四', gender: '女', age: 32, type: 'MRI头部' },
        { id: 3, serial: 5, patientId: 'P003', name: '王五', gender: '男', age: 28, type: 'CT腹部' },
        { id: 4, serial: 5, patientId: 'P004', name: '赵六', gender: '女', age: 55, type: '螺旋扫描' },
        { id: 5, serial: 4, patientId: 'P005', name: '孙七', gender: '男', age: 19, type: '定位像' },
        { id: 6, serial: 4, patientId: 'P006', name: '周八', gender: '女', age: 64, type: 'CT增强' },
        { id: 7, serial: 3, patientId: 'P007', name: '吴九', gender: '男', age: 41, type: '骨盆扫描' },
        { id: 8, serial: 3, patientId: 'P008', name: '郑十', gender: '女', age: 37, type: '颈椎平扫' },
    ];

    const toggleSelectRow = (id: number) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(item => item !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === patientData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(patientData.map(p => p.id));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F0F4F9] p-2 text-[#37474F] font-sans select-none">

            {/* 主容器 1024x768 */}
            <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl relative">

                {/* 1. Header (保持原风格) */}
                <header className="flex items-center justify-between px-4 h-[80px] bg-[#E8EAF1] border-b border-[#B0C4DE] shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-sm min-w-[210px]">
                            <div className="w-10 h-10 rounded-sm bg-[#4A6982] flex items-center justify-center text-white opacity-90">
                                <User size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-bold">Roky Zhang</span>
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
                        <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Monitor size={24} /></div>
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
                <main className="flex-1 overflow-hidden p-4">

                    {/* 这里是包裹操作栏和列表内容的统一大卡片 */}
                    <div className="h-full flex flex-col bg-white rounded-lg border border-[#B0C4DE] shadow-sm overflow-hidden">

                        {/* 卡片头部：操作栏 (Toolbar Inside Card) */}
                        <div className="h-[64px] bg-[#F8FAFC] border-b border-[#EEF2F9] px-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center h-full gap-4">
                                {/* 状态切换 Tabs */}
                                <div className="flex bg-[#EEF2F9] rounded-md border border-[#B0C4DE]/50 overflow-hidden p-1">
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className={`px-8 h-[32px] text-[13px] font-bold transition-all rounded-md ${activeTab === 'pending' ? 'bg-[#4D94FF] text-white shadow-sm' : 'text-[#4D94FF] hover:bg-white/50'}`}
                                    >
                                        待检查
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('completed')}
                                        className={`px-8 h-[32px] text-[13px] font-bold transition-all rounded-md ${activeTab === 'completed' ? 'bg-[#4D94FF] text-white shadow-sm' : 'text-[#4D94FF] hover:bg-white/50'}`}
                                    >
                                        已完成
                                    </button>
                                </div>

                                {/* 快速操作图标 */}
                                <div className="flex items-center gap-4 text-[#90A4AE] border-l border-[#B0C4DE]/50 pl-4 ml-2">
                                    <RefreshCw size={18} className="cursor-pointer hover:text-blue-500" />
                                    <Eye size={18} className="cursor-pointer hover:text-blue-500" />
                                    <Download size={18} className="cursor-pointer hover:text-blue-500" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* 搜索框 */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="搜索患者姓名、ID..."
                                        className="w-[240px] h-[36px] pl-10 pr-4 bg-white border border-[#B0C4DE] rounded-md text-[13px] focus:outline-none focus:border-[#4D94FF] focus:ring-1 focus:ring-[#4D94FF]/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={16} />
                                </div>

                                {/* 功能按钮 */}
                                <div className="flex gap-2">
                                    <button
                                        title="新增"
                                        onClick={() => setShowAddModal(true)}
                                        className="w-[36px] h-[36px] bg-[#4D94FF] text-white rounded-md flex items-center justify-center shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                    <button title="导出" className="w-[36px] h-[36px] bg-white border border-[#B0C4DE] text-[#546E7A] rounded-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
                                        <ChevronUp size={18} />
                                    </button>
                                    <button title="删除" className="w-[36px] h-[36px] bg-white border border-[#B0C4DE] text-[#546E7A] rounded-md flex items-center justify-center hover:text-red-500 hover:border-red-200 active:scale-95 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 卡片主体：列表表格 (Table Area) */}
                        <div className="flex-1 overflow-hidden flex flex-col relative">
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full border-collapse">
                                    <thead className="bg-[#4D94FF] text-white sticky top-0 z-20 h-[48px] text-[12px] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="w-[60px] text-center border-r border-white/10">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-sm accent-[#4D94FF]"
                                                    checked={selectedRows.length === patientData.length}
                                                    onChange={toggleSelectAll}
                                                />
                                            </th>
                                            <th className="px-4 text-left border-r border-white/10">序号 <ChevronDown size={14} className="inline ml-1 opacity-60" /></th>
                                            <th className="px-4 text-left border-r border-white/10">患者ID</th>
                                            <th className="px-4 text-left border-r border-white/10">姓名</th>
                                            <th className="px-4 text-left border-r border-white/10">性别</th>
                                            <th className="px-4 text-left border-r border-white/10">年龄</th>
                                            <th className="px-4 text-left border-r border-white/10">检查类型</th>
                                            <th className="px-4 text-center">图像状态</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {patientData.map((patient) => (
                                            <tr
                                                key={patient.id}
                                                onClick={() => toggleSelectRow(patient.id)}
                                                className={`h-[52px] transition-colors cursor-pointer text-[13px] ${selectedRows.includes(patient.id) ? 'bg-[#E3F2FD]' : 'hover:bg-[#F9FBFC]'}`}
                                            >
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded-sm accent-[#4D94FF]"
                                                        checked={selectedRows.includes(patient.id)}
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="px-4 font-mono text-[#546E7A]">{patient.serial}</td>
                                                <td className="px-4 text-[#546E7A]">{patient.patientId}</td>
                                                <td className="px-4 font-bold text-[#37474F]">{patient.name}</td>
                                                <td className="px-4">{patient.gender}</td>
                                                <td className="px-4">{patient.age}</td>
                                                <td className="px-4 text-[#78909C]">{patient.type}</td>
                                                <td className="text-center">
                                                    <div className={`w-8 h-8 rounded-md flex items-center justify-center mx-auto transition-all ${selectedRows.includes(patient.id) ? 'bg-white shadow-sm text-blue-500' : 'bg-gray-50 text-gray-400'}`}>
                                                        <ImageIcon size={16} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 卡片底部：分页 (Pagination Inside Card) */}
                            <div className="h-[50px] bg-[#F8FAFC] border-t border-[#EEF2F9] flex items-center justify-end px-6 gap-6 shrink-0">
                                <div className="flex items-center gap-2 text-[12px] text-[#546E7A]">
                                    <span className="opacity-70">每页显示:</span>
                                    <div className="flex items-center gap-2 px-2 py-1 border border-[#B0C4DE] rounded bg-white cursor-pointer hover:border-blue-400">
                                        <span className="font-bold">10</span>
                                        <ChevronDown size={14} className="text-[#90A4AE]" />
                                    </div>
                                </div>

                                <div className="text-[12px] text-[#546E7A]">
                                    显示 <span className="font-bold">1-8</span> / 共 <span className="font-bold">12</span> 条记录
                                </div>

                                <div className="flex items-center gap-1 border-l border-gray-200 pl-4 ml-2">
                                    <button className="p-1.5 text-gray-300 cursor-not-allowed"><ChevronsLeft size={16} /></button>
                                    <button className="p-1.5 text-gray-300 cursor-not-allowed"><ChevronLeft size={16} /></button>
                                    <button className="p-1.5 text-[#546E7A] hover:bg-blue-50 hover:text-blue-500 rounded transition-all"><ChevronRight size={16} /></button>
                                    <button className="p-1.5 text-[#546E7A] hover:bg-blue-50 hover:text-blue-500 rounded transition-all"><ChevronsRight size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* 3. Global Footer (底部操作) */}
                <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8">
                    <div className="flex-1">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-blue-50 transition-all uppercase text-[13px] shadow-sm active:scale-95">
                            <ChevronLeft size={20} /> 上一步
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button className="flex items-center gap-3 px-14 h-[52px] bg-[#4D94FF] text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition-all uppercase text-[13px] tracking-widest active:scale-95">
                            下一步 <ChevronRight size={20} />
                        </button>
                    </div>
                </footer>

                {/* Modal Integration - Constrained to this relative container */}
                <AddPatientScreen isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            </div>
        </div>
    );
};

export default PatientListScreen;