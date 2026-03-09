import { ChevronDown, ChevronRight, Info, Plus, User, Settings, Sun, ChevronLeft, Monitor, UserCheck, X } from "lucide-react";

type HelicalField =
    | { label: string; type: "select"; options: string[]; required?: boolean; error?: string }
    | { label: string; type: "input"; value?: string; placeholder?: string; required?: boolean; error?: string };

const helicalFields: HelicalField[] = [
    { label: "KV", type: "select", options: ["120", "100", "80"], required: true },
    { label: "MA (MAX: 240 [SMALL])", type: "input", value: "215", required: true, error: "mA (215) 必须是 10 的倍数" },
    { label: "旋转时间 (S)", type: "select", options: ["1", "0.5", "1.5"], required: true },
    { label: "准直器 (COLLIMATION)", type: "input", value: "32x0.6", required: true },
    { label: "扫描长度 (MM)", type: "input", value: "165", required: true },
    { label: "扫描方向", type: "select", options: ["OUT", "IN"], required: true },
    { label: "定位像 FOV", type: "input", value: "500", required: true },
    { label: "DOM (动态扫描)", type: "input", value: "0", required: true },
    { label: "PITCH (螺距)", type: "input", value: "0.984", required: true },
    { label: "床倾角 (ANGLE)", type: "input", value: "0", required: true },
];

export default function WT32NewProtocolHelicalDetailScreen() {
    return (
        <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl text-[#37474F] font-sans select-none">
            {/* 1. Header (System Info) - Identical to Detail Screen */}
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
                    <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70 relative">
                        <Monitor size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">
                            9
                        </span>
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

            {/* 2. Main Content Area */}
            <main className="flex-1 overflow-hidden p-2 flex gap-3">
                {/* Left Panel - Protocol Sidebar (EXACT COPY OF Detail Screen) */}
                <aside className="w-[310px] flex flex-col bg-white border border-[#B0C4DE] rounded-md shadow-sm overflow-hidden shrink-0">
                    <div className="h-[44px] bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center px-4 shrink-0">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#37474F]">
                            协议队列 (Protocols)
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
                        <div className="p-3 bg-[#F8FAFC] border border-[#EEF2F9] rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-sm text-[#37474F]">脑部螺旋</span>
                                <span className="bg-[#EEF2F9] text-[#546E7A] text-[10px] px-1.5 py-0.5 rounded">头部</span>
                                <span className="bg-[#EEF2F9] text-[#546E7A] text-[10px] px-1.5 py-0.5 rounded">成人</span>
                            </div>
                            <div className="flex items-start gap-2 text-[#4D94FF]">
                                <Info size={12} className="shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-tight font-bold">
                                    出厂模板：您的修改仅对本次扫描生效。
                                </p>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                className="flex items-center justify-between px-4 py-2.5 rounded-md text-[13px] font-bold text-[#546E7A] border border-transparent hover:bg-gray-50 transition-all text-left"
                            >
                                协议基本信息
                            </button>

                            <div className="mt-2 flex flex-col">
                                <div className="flex justify-between items-center px-1 mb-2">
                                    <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest">采集队列</span>
                                    <button className="text-[#4D94FF] flex items-center gap-1 text-[11px] hover:underline font-bold px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                                        <Plus size={12} /> 新增
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-[#F8FAFC] border border-[#EEF2F9] rounded-md p-3 cursor-pointer hover:bg-[#F3F8FF] transition-colors shadow-sm">
                                        <div className="flex justify-between text-[11px] text-[#546E7A] mb-1">
                                            <span className="font-bold">定位像</span>
                                            <span className="opacity-50 text-[10px]">LOCALIZER</span>
                                        </div>
                                        <div className="text-[10px] text-[#90A4AE] italic text-xs">定位像不需要重建</div>
                                    </div>

                                    {/* Selected Acquisition Item */}
                                    <div className="flex flex-col rounded-md border border-[#B0C4DE] overflow-hidden shadow-sm">
                                        <div className="bg-[#4D94FF] text-white px-3 py-3 flex justify-between items-center cursor-pointer shadow-sm">
                                            <span className="text-[11px] font-bold">Acquisition 1</span>
                                            <span className="text-[10px] opacity-80 font-medium">螺旋扫描</span>
                                        </div>

                                        <div className="bg-[#E3F2FD]/50 p-2 flex flex-col gap-1.5 border-t border-[#B0C4DE]/20">
                                            <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#E3F2FD] rounded cursor-pointer transition-colors group">
                                                <div className="w-1 h-3 bg-[#4D94FF] rounded-full opacity-40 group-hover:opacity-100"></div>
                                                <span className="text-[11px] text-[#546E7A] font-bold">软组织</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#E3F2FD] rounded cursor-pointer transition-colors group">
                                                <div className="w-1 h-3 bg-[#4D94FF] rounded-full opacity-40 group-hover:opacity-100"></div>
                                                <span className="text-[11px] text-[#546E7A] font-bold">骨骼</span>
                                            </div>

                                            <button className="mt-1 w-full py-1.5 bg-white border border-[#4D94FF]/20 text-[#4D94FF] hover:bg-[#4D94FF] hover:text-white rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1">
                                                <Plus size={10} /> 新增重建
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center justify-between px-4 py-3 rounded-md text-[13px] font-bold text-[#546E7A] hover:bg-gray-50 mt-1 transition-colors group text-left">
                                剂量 / 通知阈值
                                <ChevronRight size={14} className="text-[#90A4AE] group-hover:text-[#4D94FF]" />
                            </button>

                            <button className="flex items-center justify-between px-4 py-3 rounded-md text-[13px] font-bold text-[#546E7A] hover:bg-gray-50 transition-colors group text-left">
                                高级设置
                                <ChevronRight size={14} className="text-[#90A4AE] group-hover:text-[#4D94FF]" />
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Right Panel - Parameter Editor (Helical Specific) */}
                <section className="flex-1 bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[44px] bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center justify-between px-6 shrink-0 text-[#37474F]">
                        <span className="text-[11px] font-black uppercase tracking-widest">扫描采集：Acquisition 1 (Helical Params)</span>
                        <button className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#D32F2F] transition-colors group">
                            <X size={14} className="opacity-70 group-hover:opacity-100" />
                            <span className="text-[11px] font-bold">删除该采集队列</span>
                        </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-[#EEF2F9]/20">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-[#90A4AE] ml-1 uppercase tracking-tight">名称</label>
                                <input
                                    type="text"
                                    defaultValue="Acquisition 1"
                                    className="w-full h-[38px] px-3 bg-white border border-[#B0C4DE] rounded-md text-[13px] font-bold text-[#37474F] outline-none focus:border-[#4D94FF] focus:ring-1 focus:ring-[#4D94FF]/10 shadow-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-[#90A4AE] ml-1 uppercase tracking-tight">模式</label>
                                <div className="relative">
                                    <select className="w-full h-[38px] px-3 bg-white border border-[#B0C4DE] rounded-md text-[13px] font-bold text-[#37474F] outline-none appearance-none cursor-pointer focus:border-[#4D94FF] shadow-sm">
                                        <option>螺旋扫描</option>
                                        <option>定位像</option>
                                        <option>断层扫描</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90A4AE] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#B0C4DE] rounded-lg shadow-sm overflow-hidden">
                            <div className="px-5 py-4 bg-[#F8FAFC] border-b border-[#EEF2F9] flex items-center gap-2">
                                <div className="w-1.5 h-3 bg-[#4D94FF] rounded-full"></div>
                                <span className="text-[10px] font-black text-[#546E7A] uppercase tracking-widest">采集参数配置</span>
                            </div>

                            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-3">
                                {helicalFields.map((field) => (
                                    <div key={field.label} className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-[#90A4AE] ml-1 uppercase tracking-tight flex items-center gap-0.5">
                                            {field.label}
                                            {field.required && <span className="text-red-500 text-[12px] leading-none select-none">*</span>}
                                            {field.error && <span className="ml-auto text-[10px] text-red-500 font-bold lowercase italic">{field.error}</span>}
                                        </label>
                                        <div className="relative">
                                            {field.type === "select" ? (
                                                <>
                                                    <select className="w-full h-[38px] px-3 bg-white border border-[#B0C4DE] rounded-md text-[13px] font-bold text-[#37474F] outline-none appearance-none cursor-pointer focus:border-[#4D94FF] focus:ring-1 focus:ring-[#4D94FF]/10 transition-all">
                                                        {field.options.map((option) => (
                                                            <option key={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90A4AE] pointer-events-none" />
                                                </>
                                            ) : (
                                                <input
                                                    type="text"
                                                    defaultValue={field.value}
                                                    placeholder={field.placeholder}
                                                    className={`w-full h-[38px] px-3 bg-white border ${field.error ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#B0C4DE]'} rounded-md text-[13px] font-bold text-[#37474F] outline-none placeholder:font-normal placeholder:text-[#90A4AE]/40 focus:border-[#4D94FF] focus:ring-1 focus:ring-[#4D94FF]/10 transition-all shadow-sm`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 3. Footer (Action Buttons) - Also aligned with WT32 style */}
            <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8 z-10">
                <div className="flex-1">
                    <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-blue-50 transition-all uppercase text-[13px] shadow-sm active:scale-95">
                        <ChevronLeft size={20} /> 上一步
                    </button>
                </div>
                <div className="flex-1 flex justify-end gap-4">
                    <button className="px-10 h-[52px] bg-white text-[#546E7A] font-bold rounded-md border-2 border-[#B0C4DE] hover:bg-gray-50 transition-all uppercase text-[13px] shadow-sm active:scale-95">
                        取消
                    </button>
                    <button className="px-12 h-[52px] bg-[#4D94FF] text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition-all uppercase text-[13px] active:scale-95">
                        保存并应用到会话
                    </button>
                </div>
            </footer>
        </div>
    );
}
