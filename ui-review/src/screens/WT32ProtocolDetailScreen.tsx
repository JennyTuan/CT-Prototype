import { useState } from "react";
import { ChevronRight, Plus, X } from "lucide-react";

export default function WT32ProtocolDetailScreen() {
    const [selectedPos, setSelectedPos] = useState("HFS");

    const positions = [
        { id: "HFS", label: "HFS", sub: "头先进-仰卧" },
        { id: "FFS", label: "FFS", sub: "足先进-仰卧" },
        { id: "HFP", label: "HFP", sub: "头先进-俯卧" },
        { id: "FFP", label: "FFP", sub: "足先进-俯卧" },
        { id: "HFDR", label: "HFDR", sub: "头先进-右侧卧" },
        { id: "FFDR", label: "FFDR", sub: "足先进-右侧卧" },
        { id: "HFDL", label: "HFDL", sub: "头先进-左侧卧" },
        { id: "FFDL", label: "FFDL", sub: "足先进-左侧卧" },
    ];

    return (
        <div className="w-[1024px] h-[768px] bg-[#EEF2F9] text-[#37474F] flex flex-col overflow-hidden select-none font-sans border border-[#B0C4DE] rounded-md">
            {/* Header */}
            <header className="h-[60px] px-6 flex items-center justify-between border-b border-[#B0C4DE] bg-[#E8EAF1] shrink-0">
                <span className="text-[18px] font-black text-[#37474F]">协议编辑器 (Session Detail)</span>
                <button className="text-[#90A4AE] hover:text-[#546E7A] transition-colors">
                    <X size={24} />
                </button>
            </header>

            <main className="flex-1 flex overflow-hidden p-3 gap-3">
                {/* Sidebar */}
                <aside className="w-[280px] flex flex-col gap-3 shrink-0 overflow-y-auto pr-1">
                    {/* Profile Summary Card */}
                    <div className="bg-white rounded-md border border-[#B0C4DE]/50 p-4 shadow-sm">
                        <div className="text-[16px] font-black mb-3">牙齿</div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-[#F8FAFC] rounded-sm text-[12px] text-[#546E7A] font-bold border border-[#EEF2F9]">头部</span>
                            <span className="px-3 py-1 bg-[#F8FAFC] rounded-sm text-[12px] text-[#546E7A] font-bold border border-[#EEF2F9]">成人</span>
                        </div>
                        {/* Warning Box */}
                        <div className="mt-4 p-3 bg-[#E3F2FD] text-[#1E88E5] text-[12px] font-bold rounded-sm border border-[#BBDEFB] leading-relaxed">
                            出厂模板：您的修改仅对本次扫描生效。
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex flex-col gap-2">
                        <button className="h-[48px] rounded-md bg-[#4D94FF] text-white px-4 flex items-center justify-between shadow-md">
                            <span className="text-[14px] font-black">协议基本信息</span>
                            <ChevronRight size={18} />
                        </button>

                        <div className="mt-2 mb-1 px-4 flex items-center justify-between">
                            <span className="text-[11px] font-black text-[#90A4AE] uppercase tracking-widest">采集队列</span>
                            <button className="flex items-center gap-1 text-[13px] font-black text-[#4D94FF] hover:opacity-80">
                                <Plus size={16} /> 新增
                            </button>
                        </div>

                        <div className="space-y-1">
                            {/* 定位像 */}
                            <div className="bg-white rounded-md p-3 border border-transparent hover:border-[#B0C4DE]/50 transition-all cursor-pointer">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[14px] font-black text-[#37474F]">定位像</span>
                                    <span className="text-[11px] font-bold text-[#90A4AE]">定位像</span>
                                </div>
                                <div className="text-[12px] text-[#90A4AE] italic font-medium ml-2">定位像不需要重建</div>
                            </div>

                            {/* Acquisition 1 */}
                            <div className="bg-white rounded-md p-3 border border-[#B0C4DE]/30">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[14px] font-black text-[#37474F]">Acquisition 1</span>
                                    <span className="text-[11px] font-bold text-[#90A4AE]">螺旋扫描</span>
                                </div>
                                <div className="ml-2 border-l-2 border-[#EEF2F9] pl-3 py-1 space-y-3">
                                    <div className="text-[13px] font-bold text-[#546E7A]">骨骼</div>
                                    <button className="flex items-center gap-1 text-[12px] font-bold text-[#4D94FF] hover:opacity-80">
                                        <Plus size={14} /> 新增重建
                                    </button>
                                </div>
                            </div>

                            <button className="w-full h-[48px] rounded-md bg-white border border-[#B0C4DE]/30 px-4 flex items-center justify-between text-[#546E7A] hover:bg-white/80 transition-all">
                                <span className="text-[14px] font-black">剂量 / 通知阈值</span>
                                <ChevronRight size={18} className="#90A4AE" />
                            </button>

                            <button className="w-full h-[48px] rounded-md bg-white border border-[#B0C4DE]/30 px-4 flex items-center justify-between text-[#546E7A] hover:bg-white/80 transition-all">
                                <span className="text-[14px] font-black">高级</span>
                                <ChevronRight size={18} className="#90A4AE" />
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Right Content */}
                <section className="flex-1 bg-white rounded-md border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 overflow-y-auto">
                        <div className="mb-8 border-b border-[#EEF2F9] pb-4">
                            <h2 className="text-[18px] font-black text-[#37474F]">协议基本信息</h2>
                            <p className="text-[13px] font-bold text-[#90A4AE] mt-1">用于扫描模式筛选与协议继承 (协议级字段)</p>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-black text-[#90A4AE]">协议名称</label>
                                <input
                                    type="text"
                                    defaultValue="牙齿"
                                    className="h-[48px] px-4 rounded-md border border-[#B0C4DE]/50 bg-white font-bold text-[15px] focus:outline-none focus:border-[#4D94FF] text-[#37474F]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-black text-[#90A4AE]">部位</label>
                                <div className="relative">
                                    <select className="w-full h-[48px] px-4 rounded-md border border-[#B0C4DE]/50 bg-white font-bold text-[15px] focus:outline-none appearance-none text-[#37474F]">
                                        <option>头部</option>
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#90A4AE]" size={16} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-black text-[#90A4AE]">解剖区域 (细分)</label>
                                <input
                                    type="text"
                                    defaultValue="上颌骨"
                                    className="h-[48px] px-4 rounded-md border border-[#B0C4DE]/50 bg-white font-bold text-[15px] focus:outline-none focus:border-[#4D94FF] text-[#37474F]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-black text-[#90A4AE]">体型范围 (KG)</label>
                                <input
                                    type="text"
                                    defaultValue="50-90"
                                    className="h-[48px] px-4 rounded-md border border-[#B0C4DE]/50 bg-white font-bold text-[15px] focus:outline-none focus:border-[#4D94FF] text-[#37474F]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-black text-[#90A4AE]">年龄</label>
                                <div className="relative">
                                    <select className="w-full h-[48px] px-4 rounded-md border border-[#B0C4DE]/50 bg-white font-bold text-[15px] focus:outline-none appearance-none text-[#37474F]">
                                        <option>成人</option>
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#90A4AE]" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Positioning Grid */}
                        <div className="mt-12">
                            <div className="flex justify-between items-baseline mb-4 border-b border-[#EEF2F9] pb-2">
                                <h3 className="text-[14px] font-black text-[#37474F]">规格预设：扫描体位</h3>
                                <span className="text-[11px] font-bold text-[#90A4AE] italic">only one position can be set for protocol preset</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {positions.map((pos) => (
                                    <button
                                        key={pos.id}
                                        onClick={() => setSelectedPos(pos.id)}
                                        className={`h-[68px] rounded-md flex flex-col items-center justify-center gap-1 border-2 transition-all relative ${selectedPos === pos.id
                                            ? "bg-white border-[#4D94FF] text-[#4D94FF] ring-4 ring-[#4D94FF]/5 shadow-sm"
                                            : "bg-white border-[#B0C4DE]/30 text-[#B0C4DE] hover:border-[#B0C4DE]"
                                            }`}
                                    >
                                        <span className={`text-[14px] font-black ${selectedPos === pos.id ? "text-[#4D94FF]" : "text-[#546E7A]"}`}>
                                            {pos.label}
                                        </span>
                                        <span className={`text-[10px] font-bold ${selectedPos === pos.id ? "text-[#4D94FF] opacity-70" : "text-[#90A4AE]"}`}>
                                            {pos.sub}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="h-[84px] border-t border-[#B0C4DE] px-8 flex items-center justify-end gap-5 shrink-0 bg-[#E8EAF1]">
                <button className="h-[52px] px-10 rounded-md bg-white border-2 border-[#4D94FF] font-bold text-[13px] text-[#4D94FF] hover:bg-blue-50 transition-all shadow-sm active:scale-95">
                    取消
                </button>
                <button className="h-[52px] px-10 rounded-md bg-[#4D94FF] font-bold text-[13px] text-white shadow-lg hover:bg-blue-600 transition-all uppercase active:scale-95">
                    保存并应用到会话
                </button>
            </footer>
        </div>
    );
}
