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
    Play,
    RotateCcw,
    ScanLine,
    Focus,
    ShieldCheck,
    Ruler,
} from 'lucide-react';

const scanModes = [
    { id: 'helical', label: '螺旋扫描', desc: '连续进床采集' },
    { id: 'axial', label: '断层扫描', desc: '定点分步曝光' },
];

const acquisitionFields = [
    { label: '管电压', value: '120', unit: 'kV' },
    { label: '管电流', value: '200', unit: 'mA' },
    { label: '旋转时间', value: '1.0', unit: 's' },
    { label: '准直宽度', value: '32 × 0.6', unit: 'mm' },
    { label: '螺距', value: '1.0', unit: 'Pitch' },
    { label: '起始位置', value: '--.-', unit: 'mm' },
    { label: '结束位置', value: '--.-', unit: 'mm' },
];

const reconFields = [
    { label: '重建层厚', value: '1.0 mm' },
    { label: '重建间隔', value: '0.8 mm' },
    { label: '卷积核', value: 'Standard' },
    { label: '视野', value: '250 mm' },
];

const statusCards = [
    { label: '联锁状态', value: '已通过', tone: 'text-[#1D4ED8] bg-[#EAF2FF]' },
    { label: '曝光使能', value: '待命', tone: 'text-[#0F766E] bg-[#ECFDF5]' },
    { label: '床位状态', value: '未锁定', tone: 'text-[#9A3412] bg-[#FFF7ED]' },
];

export default function ManualScanScreen() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMode, setActiveMode] = useState('helical');
    const [activePanel, setActivePanel] = useState<'acq' | 'recon'>('acq');

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
                            <div className="text-[9px] font-bold">🌡️ 60%</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">14:43</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1">3月5日 周三</div>
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

            <main className="flex-1 overflow-hidden p-2 flex gap-2 bg-[#EEF2F9]">
                <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[220px]'} bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col p-4 shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between mb-6 h-10">
                        {!isCollapsed && (
                            <div>
                                <div className="text-[14px] font-black text-[#37474F] uppercase tracking-wider">服务模式</div>
                                <div className="text-[10px] text-[#90A4AE] font-bold mt-0.5">硬件 / 手动扫描</div>
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
                    </div>
                </aside>

                <section className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm p-3 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 rounded-2xl border border-[#D6E2F2] bg-[linear-gradient(180deg,#F8FBFF_0%,#EDF3FA_100%)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_rgba(148,163,184,0.12)]">
                            {scanModes.map((mode) => {
                                const active = activeMode === mode.id;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setActiveMode(mode.id)}
                                        className={`group relative flex h-[42px] min-w-[120px] flex-col items-start justify-center rounded-[14px] border px-4 text-left transition-all duration-200 ${active
                                            ? 'border-[#BFDBFE] bg-white shadow-[0_8px_18px_rgba(59,130,246,0.18)]'
                                            : 'border-transparent bg-transparent text-[#94A3B8] hover:border-white/70 hover:bg-white/65'
                                            }`}
                                    >
                                        <span className={`text-[12px] font-black tracking-[0.06em] ${active ? 'text-[#1D4ED8]' : 'text-[#64748B]'}`}>{mode.label}</span>
                                        <span className={`mt-0.5 text-[10px] font-bold ${active ? 'text-[#475569]' : 'text-[#A3B2C2] group-hover:text-[#64748B]'}`}>{mode.desc}</span>
                                        {active && (
                                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#60A5FA] shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-3">
                            {statusCards.map((card) => (
                                <div key={card.label} className={`rounded-full px-3 py-1.5 text-[11px] font-black ${card.tone}`}>
                                    {card.label} · {card.value}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex gap-3 overflow-hidden">
                        <div className="flex-1 bg-[#050A19] rounded-3xl relative overflow-hidden border border-[#1A2642] shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16)_0%,rgba(5,10,25,0)_45%)]" />
                            <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(rgba(77,148,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(77,148,255,0.18) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <div>
                                    <div className="text-[#93C5FD] text-[11px] font-black tracking-[0.22em] uppercase">Live Preview</div>
                                    <div className="text-white text-[16px] font-bold mt-1">手动扫描监视区</div>
                                </div>
                                <div className="rounded-full border border-[#4D94FF]/30 bg-[#081122]/80 px-3 py-1 text-[11px] font-bold text-[#BFDBFE]">
                                    WT32 / Performance Style
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-[220px] h-[220px] rounded-full border border-[#4D94FF]/35" />
                                    <div className="absolute inset-[34px] rounded-full border border-dashed border-[#60A5FA]/70" />
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-[#4D94FF]/50" />
                                    <div className="absolute left-1/2 inset-y-0 -translate-x-1/2 border-l border-[#4D94FF]/35" />
                                    <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#93C5FD]/60 bg-[#081122]/85 shadow-[0_0_30px_rgba(96,165,250,0.18)]" />
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
                                {[
                                    { icon: <ScanLine size={14} />, label: 'RES', value: '1024×1024' },
                                    { icon: <Focus size={14} />, label: '焦点', value: '0.7 mm' },
                                    { icon: <Ruler size={14} />, label: 'Pitch', value: '1.0' },
                                    { icon: <ShieldCheck size={14} />, label: '联锁', value: 'Ready' },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-[#1F335A] bg-[#081122]/90 px-3 py-2 text-[#BFDBFE]">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7DD3FC]">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <div className="mt-1 text-[13px] font-bold text-white">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-[#4D94FF]/20 rounded-tl-3xl m-6" />
                            <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#4D94FF]/20 rounded-tr-3xl m-6" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#4D94FF]/20 rounded-bl-3xl m-6" />
                            <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-[#4D94FF]/20 rounded-br-3xl m-6" />
                        </div>

                        <div className="w-[300px] flex flex-col gap-3 h-full overflow-hidden">
                            <div className="flex items-center gap-1 rounded-2xl border border-[#D6E2F2] bg-[linear-gradient(180deg,#F8FBFF_0%,#EDF3FA_100%)] p-1 shadow-sm">
                                <button
                                    onClick={() => setActivePanel('acq')}
                                    className={`flex-1 h-[38px] rounded-xl text-[12px] font-black transition-all ${activePanel === 'acq' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B]'}`}
                                >
                                    采集参数
                                </button>
                                <button
                                    onClick={() => setActivePanel('recon')}
                                    className={`flex-1 h-[38px] rounded-xl text-[12px] font-black transition-all ${activePanel === 'recon' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B]'}`}
                                >
                                    重建参数
                                </button>
                            </div>

                            <div className="flex flex-col flex-1 bg-[#F8FAFC] border border-[#B0C4DE]/50 rounded-3xl p-3 shadow-sm overflow-hidden">
                                <div className="flex items-start justify-between gap-3 mb-3 shrink-0">
                                    <div>
                                        <div className="font-black text-[#263238] text-[15px]">
                                            {activePanel === 'acq' ? '扫描参数概览' : '重建参数概览'}
                                        </div>
                                        <div className="text-[10px] text-[#90A4AE] font-medium leading-[1.2] mt-0.5">
                                            {activePanel === 'acq'
                                                ? '参数按性能评估页的信息卡形式收敛，优先展示最常用手动扫描参数。'
                                                : '重建参数保留只读预览，避免与扫描执行操作抢占视觉焦点。'}
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-full bg-[#E3F2FD] px-2.5 py-1 text-[10px] font-black text-[#1E88E5]">
                                        {activePanel === 'acq' ? 'ACQ' : 'RECON'}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                                    {activePanel === 'acq' ? (
                                        acquisitionFields.map((field) => (
                                            <div key={field.label} className="bg-white border border-[#D7E3F4] rounded-2xl px-4 py-3 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-[11px] font-black text-[#90A4AE] uppercase tracking-wider">{field.label}</div>
                                                    <div className="text-[11px] font-bold text-[#B0BEC5]">{field.unit}</div>
                                                </div>
                                                <div className="mt-2 text-[24px] font-black text-[#263238] leading-none">{field.value}</div>
                                            </div>
                                        ))
                                    ) : (
                                        reconFields.map((field) => (
                                            <div key={field.label} className="bg-white border border-[#D7E3F4] rounded-2xl px-4 py-3 shadow-sm">
                                                <div className="text-[11px] font-black text-[#90A4AE] uppercase tracking-wider">{field.label}</div>
                                                <div className="mt-2 text-[18px] font-black text-[#263238] leading-none">{field.value}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#F8FAFC] border border-[#B0C4DE]/50 rounded-3xl p-3 shadow-sm">
                                <div className="text-[11px] font-black text-[#90A4AE] uppercase tracking-wider mb-2">执行控制</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="h-11 rounded-2xl bg-[#2F54EB] text-white font-black text-[13px] hover:bg-blue-700 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2">
                                        <Play size={16} />
                                        启动扫描
                                    </button>
                                    <button className="h-11 rounded-2xl bg-white border border-[#D7E3F4] text-[#475569] font-black text-[13px] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <RotateCcw size={16} />
                                        恢复默认
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="h-[80px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center px-8 shrink-0">
                <button className="h-[52px] px-10 bg-white border-2 border-[#B0C4DE] rounded-md text-[14px] font-bold text-[#37474F] hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                    首页
                </button>
                <div className="ml-8 text-[13px] text-[#546E7A] font-medium leading-none">
                    服务模式 · 硬件 / 手动扫描
                </div>
            </footer>
        </div>
    );
}
