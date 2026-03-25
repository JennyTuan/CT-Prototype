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
        <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl relative font-sans select-none">
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
                            <div className="text-[9px] font-bold">温控 60%</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">14:43</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1">3月5日 周三</div>
                </div>

                <div className="flex items-center gap-6 pr-2">
                    <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><Plus size={32} strokeWidth={1.5} /></div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Layout size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">9</span>
                    </div>
                    <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Lightbulb size={24} /></div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Settings size={24} />
                        <span className="absolute -top-1 -right-1 w-5 h-4 bg-[#D32F2F] text-white text-[9px] px-1 flex items-center justify-center rounded-full font-bold border border-white">100</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden p-2 flex gap-2 bg-[#EEF2F9]">
                <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[246px]'} bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col p-4 shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between mb-4 h-10">
                        {!isCollapsed && (
                            <div>
                                <div className="text-[14px] font-black text-[#37474F] uppercase tracking-wider">服务模式</div>
                                <div className="text-[10px] text-[#90A4AE] font-bold mt-0.5">硬件 / 手动扫描</div>
                            </div>
                        )}
                        <div
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`w-9 h-9 rounded-full bg-[#F5F7FB] border border-[#B0C4DE] flex items-center justify-center text-[#546E7A] hover:bg-gray-50 cursor-pointer transition-all active:scale-95 shadow-sm ${isCollapsed ? 'mx-auto' : ''}`}
                        >
                            <Menu size={18} />
                        </div>
                    </div>

                    {!isCollapsed && (
                        <div className="relative mb-5">
                            <input
                                type="text"
                                placeholder="关键字搜索..."
                                className="w-full h-[42px] pl-10 pr-4 bg-[#F8FAFD] border border-[#D4DFEC] rounded-2xl text-[14px] focus:outline-none focus:border-[#4D94FF] focus:ring-1 focus:ring-[#4D94FF]/20"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={16} />
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-[#F8FAFC] text-[#1E3A5F] rounded-2xl mb-3 border border-[#D4DFEC] shadow-sm`}>
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
                                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-[#E7F2FF] text-[#1E78FF] border border-[#BFDBFE] shadow-sm' : 'text-[#546E7A] hover:bg-[#F8FAFC]'}`}
                            >
                                <div className={`${item.active ? 'text-[#1E78FF]' : 'text-[#90A4AE]'}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && <span className={`text-[13px] ${item.active ? 'font-bold' : 'font-medium'} whitespace-nowrap`}>{item.label}</span>}
                            </div>
                        ))}
                    </div>
                </aside>

                <section className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm overflow-hidden flex flex-col">
                    <div className="h-[48px] bg-[#F8FAFC] border-b border-[#E2E8F0] px-5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#94A3B8]">Manual Scan</span>
                            <span className="text-[14px] font-bold text-[#334155]">手动扫描工作台</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {statusChips.map((chip) => (
                                <div
                                    key={chip.label}
                                    className={`px-3 h-7 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${chip.tone}`}
                                >
                                    <span>{chip.label}</span>
                                    <span>{chip.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 p-3 flex gap-3 overflow-hidden">
                        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                            <div className="h-[82px] rounded-2xl border border-[#D7E3F3] bg-[linear-gradient(135deg,#F8FBFF_0%,#EEF5FF_100%)] px-5 py-4 flex items-center justify-between shadow-sm">
                                <div>
                                    <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">Acquisition Status</div>
                                    <div className="mt-1 text-[24px] font-black text-[#0F172A] tracking-tight">螺旋扫描待命</div>
                                    <div className="mt-1 text-[12px] font-medium text-[#64748B]">定位完成后可直接下发扫描；关键参数已锁定为 WT32 推荐样式。</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    {[
                                        ['Slice', '32 × 0.6'],
                                        ['Pitch', '1.0'],
                                        ['Rotation', '1.0 s'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="min-w-[76px] rounded-xl border border-[#D6E4FF] bg-white/90 px-3 py-2 shadow-sm">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">{label}</div>
                                            <div className="mt-1 text-[14px] font-bold text-[#2563EB]">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 rounded-2xl border border-[#CBD7E7] bg-[#040811] relative overflow-hidden shadow-inner">
                                <div
                                    className="absolute inset-0 opacity-60"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(rgba(43,69,113,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(43,69,113,0.3) 1px, transparent 1px)',
                                        backgroundSize: '34px 34px',
                                    }}
                                />
                                <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(14,30,57,0.78)_0%,rgba(14,30,57,0)_100%)]" />
                                <div className="absolute left-5 top-4 right-5 flex items-start justify-between text-white">
                                    <div>
                                        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#93C5FD]">Preview</div>
                                        <div className="mt-1 text-[16px] font-bold text-[#E2E8F0]">Scan Field Monitor</div>
                                    </div>
                                    <div className="rounded-full border border-[#1D4ED8]/40 bg-[#0F172A]/70 px-3 py-1 text-[11px] font-bold text-[#BFDBFE]">
                                        WT32 Style Overlay
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-[164px] h-[164px] rounded-full border border-[#1E3A8A]/50 shadow-[0_0_40px_rgba(37,99,235,0.15)]" />
                                        <div className="absolute inset-[20px] rounded-full border border-dashed border-[#60A5FA]/60" />
                                        <div className="absolute left-1/2 top-1/2 w-[56px] h-[56px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#93C5FD]/60 bg-[#0F172A]/80 shadow-[0_0_24px_rgba(96,165,250,0.18)]" />
                                    </div>
                                </div>
                                <div className="absolute left-0 right-0 top-1/2 border-t border-[#0D345E]" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div className="text-[#6A7486] text-[12px] space-y-1">
                                        <div>RES: 1024×1024</div>
                                        <div>FPS: 30.0</div>
                                        <div>EXP: 500 ms</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="rounded-xl border border-[#1E3A8A]/50 bg-[#081122]/90 px-3 py-2 text-[11px] font-bold text-[#BFDBFE]">焦点 0.7 mm</div>
                                        <div className="rounded-xl border border-[#1E3A8A]/50 bg-[#081122]/90 px-3 py-2 text-[11px] font-bold text-[#BFDBFE]">曝光窗关闭</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-[370px] rounded-2xl border border-[#D6E2F2] bg-[#F8FAFD] overflow-hidden flex flex-col shadow-sm">
                            <div className="p-4 border-b border-[#E3EAF5]">
                                <div className="flex items-center gap-2 rounded-2xl bg-[#EDF2F8] p-1">
                                    <button className="h-[40px] flex-1 rounded-xl bg-white text-[#1E78FF] font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm">
                                        <SlidersHorizontal size={16} />
                                        采集参数
                                    </button>
                                    <button className="h-[40px] flex-1 rounded-xl text-[#64748B] font-bold text-[13px] flex items-center justify-center gap-2">
                                        <Database size={16} />
                                        重建参数
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                <div className="rounded-2xl border border-[#D8E5F3] bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-[12px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">Scan Mode</div>
                                            <div className="mt-1 text-[15px] font-bold text-[#1E293B]">扫描模式</div>
                                        </div>
                                        <div className="text-[11px] font-bold text-[#64748B]">服务维护</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="h-[36px] rounded-xl border border-[#66B3FF] bg-[#EAF5FF] text-[#1075D1] font-bold text-[12px] shadow-sm">螺旋扫描</button>
                                        <button className="h-[36px] rounded-xl border border-[#D4DFEC] bg-[#F4F7FB] text-[#9BA7BA] font-bold text-[12px]">断层扫描</button>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#D8E5F3] bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-[12px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">Acquisition</div>
                                            <div className="mt-1 text-[15px] font-bold text-[#1E293B]">采集参数</div>
                                        </div>
                                        <div className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-bold text-[#2563EB]">Preset A</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {acquisitionFields.map((field) => (
                                            <div key={field.label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] px-3 py-2.5">
                                                <div className="text-[11px] font-bold text-[#64748B]">{field.label}</div>
                                                <div className="mt-1 text-[16px] font-bold text-[#0F172A]">{field.value}</div>
                                                <div className="mt-1 text-[10px] font-medium text-[#94A3B8]">{field.hint}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#D8E5F3] bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-[12px] font-black uppercase tracking-[0.18em] text-[#94A3B8]">Reconstruction</div>
                                            <div className="mt-1 text-[15px] font-bold text-[#1E293B]">重建预览</div>
                                        </div>
                                        <div className="text-[11px] font-bold text-[#94A3B8]">只读</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {reconFields.map((field) => (
                                            <div key={field.label} className="rounded-xl border border-dashed border-[#D4DFEC] bg-[#F8FAFD] px-3 py-2.5">
                                                <div className="text-[11px] font-bold text-[#64748B]">{field.label}</div>
                                                <div className="mt-1 text-[14px] font-semibold text-[#334155]">{field.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto p-4 space-y-2 border-t border-[#E3EAF5] bg-white">
                                <button className="w-full h-[48px] rounded-xl bg-[#1087D2] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md hover:bg-[#0E78BA] transition-colors">
                                    <Play size={18} />
                                    启动扫描
                                </button>
                                <button className="w-full h-[40px] rounded-xl border border-[#D4DFEC] bg-[#F8FAFD] text-[#334155] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#F1F5F9] transition-colors">
                                    <RotateCcw size={16} />
                                    恢复默认
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="h-[62px] bg-[#E8EAF1] border-t border-[#B0C4DE] px-5 flex items-center justify-between text-[#37474F]">
                <button className="h-[42px] px-6 rounded-md bg-[#F5F7FB] border border-[#D0D9E7] text-[14px] font-black">首页</button>
                <div className="text-[13px] font-bold text-[#334155]">服务模式 · 硬件 / 手动扫描</div>
                <div className="w-10 h-10 rounded-full border border-[#3B4A5F] text-[#1F2937] flex items-center justify-center font-serif">N</div>
            </footer>
        </div>
    );
};

export default ManualScanScreen;
