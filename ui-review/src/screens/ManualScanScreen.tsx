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
    SlidersHorizontal,
    Database,
    Play,
    RotateCcw,
} from 'lucide-react';

const acquisitionFields = [
    { label: '管电压 (kV)', value: '120', hint: '标准成人模式' },
    { label: '管电流 (mA)', value: '200', hint: '自动曝光关闭' },
    { label: '旋转时间 (s)', value: '1.0', hint: '单圈采集时间' },
    { label: '准直宽度', value: '32 × 0.6', hint: '探测器全开' },
    { label: '螺距 (Pitch)', value: '1.0', hint: '等速进床' },
    { label: '起始位置 (Start)', value: '--.-', hint: '等待示教' },
    { label: '结束位置 (End)', value: '--.-', hint: '等待示教' },
];

const reconFields = [
    { label: '重建层厚', value: '1.0 mm' },
    { label: '重建间隔', value: '0.8 mm' },
    { label: '卷积核', value: 'Standard' },
    { label: '视野 (FOV)', value: '250 mm' },
];

const statusChips = [
    { label: '曝光使能', value: '待命', tone: 'text-[#0F766E] bg-[#ECFDF5] border-[#A7F3D0]' },
    { label: '床位状态', value: '未锁定', tone: 'text-[#9A3412] bg-[#FFF7ED] border-[#FED7AA]' },
    { label: '联锁检查', value: '已通过', tone: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]' },
];

const ManualScanScreen = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarItems = [
        { icon: <Thermometer size={18} />, label: '球管预热' },
        { icon: <Wind size={18} />, label: '空气校正' },
        { icon: <CheckCircle2 size={18} />, label: '日常QA' },
        { icon: <TestTube size={18} />, label: '硬件测试' },
        { icon: <Battery size={18} />, label: '电池管理' },
        { icon: <Disc size={18} />, label: '磁盘管理' },
        { icon: <BarChart3 size={18} />, label: '性能评估' },
        { icon: <MousePointer2 size={18} />, label: '手动扫描', active: true },
    ];

    return (
        <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-[18px] border border-[#C5D3E5] relative font-sans select-none">
            <header className="flex items-center justify-between px-4 h-[80px] bg-[#E7ECF5] border-b border-[#C5D3E5] shrink-0 z-10">
                <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-md min-w-[230px] h-[56px]">
                    <div className="w-10 h-10 rounded-sm bg-[#54718B] flex items-center justify-center text-white opacity-90">
                        <User size={22} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#172B4D]">暂无选中患者</span>
                        <span className="text-[12px] text-[#546E7A] font-medium leading-none mt-1">ID: —</span>
                    </div>
                    <div className="ml-auto flex flex-col gap-0.5 text-[#698198] opacity-70">
                        <div className="text-[10px] font-semibold">⊥ 60 mm</div>
                        <div className="text-[10px] font-semibold">∠ 3.0°</div>
                        <div className="text-[10px] font-semibold">温控 60%</div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[42px] font-bold tracking-tight text-[#2D3E50] leading-[36px]">14:43</div>
                    <div className="text-[20px] text-[#546E7A] font-medium mt-1 scale-[0.55] origin-center">3月5日 周三</div>
                </div>

                <div className="flex items-center gap-6 pr-2">
                    <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><Plus size={30} strokeWidth={1.5} /></div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Layout size={22} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">9</span>
                    </div>
                    <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Lightbulb size={22} /></div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Settings size={22} />
                        <span className="absolute -top-1 -right-1 min-w-5 h-4 px-1 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">100</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden p-2 flex gap-2 bg-[#EEF2F9]">
                <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[248px]'} bg-[#F8FBFF] border border-[#B8C9DE] rounded-md shadow-sm flex flex-col p-4 shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between mb-3 h-10">
                        {!isCollapsed && (
                            <div>
                                <div className="text-[14px] font-black text-[#334E68] tracking-[0.18em]">服务模式</div>
                                <div className="text-[11px] text-[#8CA0B3] font-semibold mt-1">硬件 / 手动扫描</div>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`w-9 h-9 rounded-full bg-[#EEF4FB] border border-[#B8C9DE] flex items-center justify-center text-[#546E7A] hover:bg-white transition-all active:scale-95 shadow-sm ${isCollapsed ? 'mx-auto' : ''}`}
                        >
                            <Menu size={18} />
                        </button>
                    </div>

                    {!isCollapsed && (
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="关键字搜索..."
                                className="w-full h-[42px] pl-10 pr-4 bg-[#F2F7FC] border border-[#CCDBEB] rounded-2xl text-[13px] focus:outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={16} />
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-[#EFF6FD] text-[#1E3A5F] rounded-2xl mb-2 border border-[#C8DAEF]`}>
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#1E78FF] text-white rounded-xl shadow-sm">
                                    <LayoutGrid size={20} />
                                </div>
                                {!isCollapsed && <span className="font-bold text-[14px]">硬件</span>}
                            </div>
                            {!isCollapsed && <ChevronDown size={18} className="opacity-60" />}
                        </div>

                        {sidebarItems.map((item) => (
                            <div
                                key={item.label}
                                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-[#DFECFA] text-[#1E78FF] border border-[#99C2F4]' : 'text-[#546E7A] hover:bg-[#F3F7FB]'}`}
                            >
                                <div className="text-[#6B86A3]">{item.icon}</div>
                                {!isCollapsed && <span className={`text-[22px] leading-none ${item.active ? 'font-bold text-[#1E63D5]' : 'font-medium'} scale-[0.58] origin-left whitespace-nowrap`}>{item.label}</span>}
                            </div>
                        ))}
                    </div>
                </aside>

                <section className="flex-1 bg-[#F9FBFE] border border-[#B8C9DE] rounded-md shadow-sm overflow-hidden flex flex-col">
                    <div className="h-[48px] px-4 border-b border-[#D6E2F2] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[14px] tracking-[0.24em] text-[#7A90AE] font-black">MANUAL SCAN</span>
                            <span className="text-[13px] font-bold text-[#183B62]">手动扫描工作台</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {['显影滤能 待命', '床位状态 未锁定', '联锁检查 已通过'].map((text, idx) => (
                                <div key={text} className={`h-7 px-3 rounded-full border text-[11px] font-semibold flex items-center ${idx === 2 ? 'border-[#6DA8FF] text-[#1E63D5] bg-[#EBF3FF]' : 'border-[#D4DFEC] text-[#5F7082] bg-white'}`}>{text}</div>
                            ))}
                        </div>
                    </div>

                    <div className="w-[370px] rounded-2xl border border-[#D6E2F2] bg-[#F8FAFD] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-[#E3EAF5]">
                            <div className="flex items-center gap-2 rounded-2xl bg-[#EDF2F8] p-1">
                                <button className="h-[40px] flex-1 rounded-xl bg-white text-[#1E78FF] font-bold text-[22px] scale-[0.55] origin-center flex items-center justify-center gap-1">
                                    <SlidersHorizontal size={16} />
                                    采集参数
                                </button>
                                <button className="h-[40px] flex-1 rounded-xl text-[#64748B] font-bold text-[22px] scale-[0.55] origin-center flex items-center justify-center gap-1">
                                    <Database size={16} />
                                    重建参数
                                </button>
                            </div>
                        </div>

                            <div className="p-4 space-y-4 text-[#1E293B]">
                                <div className="rounded-2xl border border-[#D7E3F2] bg-[#F8FBFF] p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-[11px] tracking-[0.24em] text-[#7F94AE] font-black">SCAN MODE</div>
                                        <div className="text-[11px] text-[#607387] font-semibold">服务维护</div>
                                    </div>
                                    <div className="text-[26px] scale-[0.52] origin-left text-[#0D223E] font-black mb-2">扫描模式</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="h-[34px] rounded-xl border border-[#5AA2FF] bg-[#EAF5FF] text-[#0F67C2] font-bold text-[12px]">螺旋扫描</button>
                                        <button className="h-[34px] rounded-xl border border-[#D4DFEC] bg-[#EEF3FA] text-[#9BA7BA] font-bold text-[12px]">断层扫描</button>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#D7E3F2] bg-[#F8FBFF] p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-[11px] tracking-[0.24em] text-[#7F94AE] font-black">ACQUISITION</div>
                                        <div className="h-6 px-3 rounded-full bg-[#E7F0FF] text-[#2B63C7] text-[11px] font-bold flex items-center">Preset A</div>
                                    </div>
                                    <div className="text-[26px] scale-[0.52] origin-left text-[#0D223E] font-black mb-2">采集参数</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-xl border border-[#D4DFEC] bg-[#F1F5FA] p-3 h-[84px]">
                                            <div className="text-[11px] text-[#6A7F97] font-bold">管电压 (kV)</div>
                                            <div className="text-[33px] scale-[0.58] origin-left text-[#061A38] font-black mt-1">120</div>
                                            <div className="text-[10px] text-[#8CA0B8] mt-1">标准成人模式</div>
                                        </div>
                                        <div className="rounded-xl border border-[#D4DFEC] bg-[#F1F5FA] p-3 h-[84px]">
                                            <div className="text-[11px] text-[#6A7F97] font-bold">管电流 (mA)</div>
                                            <div className="text-[33px] scale-[0.58] origin-left text-[#061A38] font-black mt-1">200</div>
                                            <div className="text-[10px] text-[#8CA0B8] mt-1">自动曝光关闭</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto p-4 space-y-2 border-t border-[#E3EAF5] bg-white">
                                <button className="w-full h-[48px] rounded-[10px] bg-[#1D87C9] text-white font-bold text-[30px] scale-[0.55] origin-center flex items-center justify-center gap-2">
                                    <Play size={18} />
                                    启动扫描
                                </button>
                                <button className="w-full h-[40px] rounded-[10px] border border-[#D4DFEC] bg-[#F2F5FA] text-[#223A56] font-bold text-[26px] scale-[0.55] origin-center flex items-center justify-center gap-2">
                                    <RotateCcw size={16} />
                                    恢复默认
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="h-[62px] bg-[#E7ECF5] border-t border-[#C5D3E5] px-5 flex items-center justify-between text-[#37474F]">
                <button className="h-[42px] px-6 rounded-md bg-[#F5F7FB] border border-[#D0D9E7] text-[30px] scale-[0.5] origin-left font-black">首页</button>
                <div className="text-[24px] scale-[0.5] origin-left font-bold text-[#334155]">服务模式 · 硬件 / 手动扫描</div>
                <div className="w-10 h-10 rounded-full border border-[#3B4A5F] text-[#1F2937] flex items-center justify-center font-serif">N</div>
            </footer>
        </div>
    );
};

export default ManualScanScreen;
