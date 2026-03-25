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
                            <div className="text-[9px] font-bold">🌡️ 60%</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">14:43</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1">3月25日 周三</div>
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
                <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[250px]'} bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col p-4 shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}>
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
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-white text-[#1E3A5F] rounded-2xl mb-2 border border-[#D4DFEC]`}>
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#1E78FF] text-white rounded-xl">
                                    <LayoutGrid size={20} />
                                </div>
                                {!isCollapsed && <span className="font-bold text-[14px]">硬件</span>}
                            </div>
                            {!isCollapsed && <ChevronDown size={18} className="opacity-60" />}
                        </div>

                        {sidebarItems.map((item) => (
                            <div
                                key={item.label}
                                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-[#E7F2FF] text-[#1E78FF] border border-[#1E78FF]' : 'text-[#546E7A] hover:bg-gray-50'}`}
                            >
                                <div className={`${item.active ? 'text-[#1E78FF]' : 'text-[#1E78FF]'}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && <span className={`text-[22px] leading-none ${item.active ? 'font-bold' : 'font-medium'} scale-[0.60] origin-left whitespace-nowrap`}>{item.label}</span>}
                            </div>
                        ))}
                    </div>
                </aside>

                <section className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm p-3 flex gap-3 overflow-hidden">
                    <div className="flex-1 rounded-2xl border border-[#CBD7E7] bg-[#01040C] relative overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-60"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(43,69,113,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(43,69,113,0.32) 1px, transparent 1px)',
                                backgroundSize: '34px 34px',
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-lg border border-[#2E3B56]/60" />
                        </div>
                        <div className="absolute left-4 bottom-4 text-[#6A7486] text-[12px] space-y-1">
                            <div>RES: 1024x1024</div>
                            <div>FPS: 30.0</div>
                            <div>EXP: 500ms</div>
                        </div>
                        <div className="absolute left-0 right-0 top-1/2 border-t border-[#0D345E]" />
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
                            <div>
                                <div className="text-[12px] font-bold mb-2">扫描模式</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="h-[32px] rounded-xl border border-[#66B3FF] bg-[#EAF5FF] text-[#1075D1] font-bold text-[12px]">螺旋扫描</button>
                                    <button className="h-[32px] rounded-xl border border-[#D4DFEC] bg-[#F4F7FB] text-[#9BA7BA] font-bold text-[12px]">断层扫描</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2 border-t border-[#E3EAF5]">
                                {[
                                    ['管电压 (kV)', '120'],
                                    ['管电流 (mA)', '200'],
                                    ['旋转时间 (s)', '1'],
                                    ['准直器宽度', '32*0.6'],
                                    ['螺距 (Pitch)', '1'],
                                    ['起始位置 (Start)', '--.-'],
                                    ['', '结束位置 (End)'],
                                ].map((item, idx) => {
                                    if (idx === 6) {
                                        return (
                                            <div key={item[1]} className="col-start-2">
                                                <div className="text-[12px] text-[#64748B] font-bold mb-1">{item[1]}</div>
                                                <input value="--.-" readOnly className="w-full h-[36px] px-3 rounded-xl border border-[#D4DFEC] bg-[#F4F7FB] text-[#94A3B8] text-[12px]" />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={`${item[0]}-${idx}`}>
                                            <div className="text-[12px] text-[#64748B] font-bold mb-1">{item[0]}</div>
                                            <div className="w-full h-[36px] px-3 rounded-xl border border-[#D4DFEC] bg-[#F4F7FB] text-[#334155] text-[20px] scale-[0.6] origin-left font-semibold flex items-center">
                                                {item[1]}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-auto p-4 space-y-2 border-t border-[#E3EAF5] bg-white">
                            <button className="w-full h-[48px] rounded-[10px] bg-[#1087D2] text-white font-bold text-[30px] scale-[0.55] origin-center flex items-center justify-center gap-2">
                                <Play size={18} />
                                扫描
                            </button>
                            <button className="w-full h-[40px] rounded-[10px] border border-[#D4DFEC] bg-[#F8FAFD] text-[#334155] font-bold text-[26px] scale-[0.55] origin-center flex items-center justify-center gap-2">
                                <RotateCcw size={16} />
                                重置
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="h-[62px] bg-[#E8EAF1] border-t border-[#B0C4DE] px-5 flex items-center justify-between text-[#37474F]">
                <button className="h-[42px] px-6 rounded-md bg-[#F5F7FB] border border-[#D0D9E7] text-[30px] scale-[0.5] origin-left font-black">首页</button>
                <div className="text-[24px] scale-[0.5] origin-left font-bold text-[#334155]">服务模式 · 硬件 / 手动扫描</div>
                <div className="w-10 h-10 rounded-full border border-[#3B4A5F] text-[#1F2937] flex items-center justify-center font-serif">N</div>
            </footer>
        </div>
    );
};

export default ManualScanScreen;
