import { useState } from 'react';
import {
    User,
    Settings,
    Search,
    Menu,
    ChevronDown,
    Plus,
    LayoutGrid,
    Lightbulb,
    Thermometer,
    Wind,
    CheckCircle2,
    TestTube,
    Battery,
    Disc,
    BarChart3,
    MousePointer2,
    Layout,
    ImageIcon,
    Activity,
    FileText,
    Users
} from 'lucide-react';

const PerformanceEvaluationScreen = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('MTF');
    const [showBaseline, setShowBaseline] = useState(true);

    const sidebarItems = [
        { icon: <Thermometer size={18} />, label: "球管预热" },
        { icon: <Wind size={18} />, label: "空气校正" },
        { icon: <CheckCircle2 size={18} />, label: "日常QA" },
        { icon: <TestTube size={18} />, label: "硬件测试" },
        { icon: <Battery size={18} />, label: "电池管理" },
        { icon: <Disc size={18} />, label: "磁盘管理" },
        { icon: <BarChart3 size={18} />, label: "性能评估", active: true },
        { icon: <MousePointer2 size={18} />, label: "手动扫描" },
    ];

    const settingsItems = [
        { icon: <FileText size={18} />, label: "协议管理" },
        { icon: <Activity size={18} />, label: "四角信息" },
        { icon: <Activity size={18} />, label: "DICOM" },
        { icon: <Users size={18} />, label: "用户管理" },
    ];

    const tabs = ['MTF', 'FWHM_H', 'FWHM_V'];

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
                        <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">08:55</div>
                        <div className="text-[12px] text-[#546E7A] font-medium mt-1">3月3日 周二</div>
                    </div>

                    <div className="flex items-center gap-6 pr-2">
                        <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><Plus size={32} strokeWidth={1.5} /></div>
                        <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Layout size={24} /></div>
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
                                    <div className="text-[10px] text-[#90A4AE] font-bold mt-0.5">硬件 / 性能评估</div>
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
                            {/* Hardware Group */}
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-[#EEF2F9] text-[#4D94FF] rounded-md mb-2 shadow-sm transition-all border border-[#B0C4DE]/30`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-[#4D94FF] text-white rounded-md">
                                        <LayoutGrid size={20} />
                                    </div>
                                    {!isCollapsed && <span className="font-bold text-[14px]">硬件</span>}
                                </div>
                                {!isCollapsed && <ChevronDown size={18} className="opacity-60" />}
                            </div>

                            {sidebarItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-md cursor-pointer transition-all ${item.active ? 'bg-[#E3F2FD] text-[#4D94FF] border-l-4 border-[#4D94FF]' : 'text-[#546E7A] hover:bg-gray-50'}`}
                                >
                                    <div className={`${item.active ? 'text-[#4D94FF]' : 'text-[#90A4AE]'}`}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && <span className={`text-[13px] ${item.active ? 'font-bold' : 'font-medium'} whitespace-nowrap`}>{item.label}</span>}
                                </div>
                            ))}

                            {/* Settings Group */}
                            <div className={`mt-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 text-[#546E7A] rounded-md mb-2 transition-all`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-blue-500 text-white rounded-md">
                                        <Settings size={20} />
                                    </div>
                                    {!isCollapsed && <span className="font-bold text-[14px]">设置</span>}
                                </div>
                                {!isCollapsed && <ChevronDown size={18} className="opacity-60" />}
                            </div>

                            {!isCollapsed && settingsItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 px-10 py-2.5 rounded-md cursor-pointer transition-all text-[#546E7A] hover:bg-gray-50 opacity-80"
                                >
                                    <div className="text-[#90A4AE]">
                                        {item.icon}
                                    </div>
                                    <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Card */}
                    <section className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm p-6 flex flex-col relative overflow-hidden">

                        {/* Top Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex bg-[#EEF2F9] p-1 rounded-full border border-[#B0C4DE]/50 overflow-hidden shadow-sm">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 h-[32px] text-[12px] font-bold rounded-full transition-all duration-200 ${activeTab === tab ? 'bg-white text-[#4D94FF] shadow-sm' : 'text-[#90A4AE] hover:bg-white/30'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-[#90A4AE]">显示基线</span>
                                    <div
                                        onClick={() => setShowBaseline(!showBaseline)}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-200 ${showBaseline ? 'bg-[#4D94FF]' : 'bg-[#B0C4DE]'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${showBaseline ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <button className="px-6 h-10 bg-[#2F54EB] text-white font-bold rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-md text-[13px] flex items-center gap-2">
                                    导入图像
                                </button>
                            </div>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="flex-1 flex gap-6 overflow-hidden">
                            {/* Dark Preview Area */}
                            <div className="flex-1 bg-[#050A19] rounded-3xl relative flex items-center justify-center overflow-hidden border border-[#1A2642] shadow-2xl">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#4D94FF] flex items-center justify-center text-[#4D94FF]">
                                        <ImageIcon size={32} />
                                    </div>
                                    <span className="text-[#4D94FF] text-[14px] font-bold tracking-widest">待导入模体图像</span>
                                </div>

                                {/* Geometric shape overlay for futuristic look */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-[#4D94FF]/20 rounded-tl-3xl m-6"></div>
                                    <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#4D94FF]/20 rounded-tr-3xl m-6"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#4D94FF]/20 rounded-bl-3xl m-6"></div>
                                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-[#4D94FF]/20 rounded-br-3xl m-6"></div>
                                </div>
                            </div>

                            {/* Right Info Panel */}
                            <div className="w-[280px] flex flex-col gap-4">
                                {/* Large Info Card */}
                                <div className="bg-[#F8FAFC] border border-[#B0C4DE]/50 rounded-3xl p-6 shadow-sm">
                                    <div className="font-black text-[#263238] text-[16px] mb-2">空间分辨率 (MTF)</div>
                                    <div className="text-[12px] text-[#90A4AE] font-medium leading-relaxed mb-6">评估系统在扫描路径上的空间分辨率特征。</div>

                                    <div className="aspect-[4/3] bg-white/50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-[#B0C4DE] shadow-inner">
                                        <span className="text-[14px] font-black text-[#B0C4DE] tracking-widest uppercase">NO DATA</span>
                                    </div>
                                </div>

                                {/* Metrics Row */}
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-[#B0C4DE]/50 rounded-3xl p-4 shadow-sm flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-[#90A4AE] mb-2">当前预测值</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-[20px] font-black text-[#263238]">--</span>
                                            <span className="text-[10px] font-bold text-[#546E7A]">lp/cm</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white border border-[#B0C4DE]/50 rounded-3xl p-4 shadow-sm flex flex-col items-center">
                                        <span className="text-[10px] font-bold text-[#90A4AE] mb-2">基线漂移</span>
                                        <div className="text-[20px] font-black text-[#263238]">--</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                </main>

                {/* 3. Footer */}
                <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center px-8 shrink-0">
                    <button className="h-[52px] px-10 bg-white border-2 border-[#B0C4DE] rounded-md text-[14px] font-bold text-[#37474F] hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                        首页
                    </button>
                    <div className="ml-8 text-[13px] text-[#546E7A] font-medium">
                        服务模式 · 硬件 / 性能评估
                    </div>
                </footer>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #B0C4DE;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #90A4AE;
                }
            `}</style>
        </div>
    );
};

export default PerformanceEvaluationScreen;
