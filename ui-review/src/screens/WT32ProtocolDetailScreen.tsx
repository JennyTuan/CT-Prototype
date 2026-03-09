import { useState } from "react";
import { Plus, ChevronRight, Info, User } from "lucide-react";

export default function WT32ProtocolDetailScreen() {
    const [activeTab, setActiveTab] = useState("basic");
    const [selectedPos, setSelectedPos] = useState("HFS");

    const positions = [
        { id: "HFS", label: "头先进-仰卧" },
        { id: "FFS", label: "足先进-仰卧" },
        { id: "HFP", label: "头先进-俯卧" },
        { id: "FFP", label: "足先进-俯卧" },
        { id: "HFDR", label: "头先进-右侧卧" },
        { id: "FFDR", label: "足先进-右侧卧" },
        { id: "HFDL", label: "头先进-左侧卧" },
        { id: "FFDL", label: "足先进-左侧卧" },
    ];

    return (
        <div className="w-[1024px] h-[768px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#D0DFFF] font-sans text-slate-700 relative">
            <div className="flex justify-between items-center px-6 py-3 border-b border-[#D0DFFF] bg-[#F4F8FF]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#4C88FF] rounded-md flex items-center justify-center text-white">
                        <User size={18} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-800">协议编辑器 (Session Detail)</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide">协议参数配置与管理</p>
                    </div>
                </div>

            </div>

            <div className="flex flex-1 overflow-hidden bg-[#F4F7FC]">
                <div className="w-64 bg-white border-r border-[#D0DFFF] p-4 flex flex-col gap-4 overflow-y-auto">
                    <div className="mb-1">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-bold text-base">牙齿</span>
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded">头部</span>
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded">成人</span>
                        </div>
                        <div className="bg-[#F0F7FF] border border-[#D0E8FF] rounded-md p-2 flex items-start gap-2">
                            <div className="mt-0.5 text-[#4C88FF] shrink-0"><Info size={12} /></div>
                            <p className="text-[10px] text-[#4C88FF] leading-tight font-medium">
                                出厂模板：您的修改仅对本次扫描生效。
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-3">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`flex items-center justify-between px-4 py-4 rounded-lg text-sm font-medium transition-all border ${activeTab === "basic"
                                ? "bg-[#F4F8FF] border-[#4C88FF] text-[#4C88FF] shadow-sm font-bold"
                                : "text-slate-600 border-transparent hover:bg-gray-50"
                                }`}
                        >
                            协议基本信息
                        </button>

                        <div className="mt-2">
                            <div className="flex justify-between items-center px-1 mb-2">
                                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">采集队列</span>
                                <button className="text-[#4C88FF] flex items-center gap-1 text-[11px] hover:underline font-bold px-2 py-1 rounded hover:bg-sky-50 transition-colors">
                                    <Plus size={12} /> 新增
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="group relative bg-[#F9FBFF] border border-[#D0DFFF] rounded-lg p-4 cursor-pointer hover:bg-[#F4F8FF] transition-colors">
                                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                                        <span className="font-bold">定位像</span>
                                        <span className="opacity-50">定位像</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400 italic">定位像不需要重建</div>
                                </div>

                                <div className="bg-[#F9FBFF] border border-[#D0DFFF] rounded-lg p-4 cursor-pointer hover:bg-[#F4F8FF] transition-colors">
                                    <div className="flex justify-between text-[11px] text-slate-500 mb-2.5">
                                        <span className="font-bold">Acquisition 1</span>
                                        <span className="opacity-50">螺旋扫描</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400 mb-3">骨骼</div>
                                    <button className="text-[11px] text-[#4C88FF] hover:underline font-bold px-2 py-1 bg-white border border-sky-100 rounded shadow-sm">+ 新增重建</button>
                                </div>
                            </div>
                        </div>

                        <button className="flex items-center justify-between px-4 py-4 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50 mt-1 transition-colors">
                            剂量 / 通知阈值
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>

                        <button className="flex items-center justify-between px-4 py-4 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors">
                            高级
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>
                    </nav>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="mb-4 border-b border-[#D0DFFF] pb-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">协议基本信息</h2>
                                <p className="text-[11px] text-slate-400 mt-0.5">用于扫描模式筛选与协议继承（协议级字段）</p>
                            </div>
                            <div className="text-[#4C88FF]"><Info size={16} /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">协议名称</label>
                            <input
                                type="text"
                                defaultValue="牙齿"
                                className="w-full px-3 py-2 bg-white border border-[#D0DFFF] rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-[#4C88FF]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">部位</label>
                            <select className="w-full px-3 py-2 bg-white border border-[#D0DFFF] rounded-lg text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                                <option>头部</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">解剖区域（细分）</label>
                            <input
                                type="text"
                                defaultValue="上颌骨"
                                className="w-full px-3 py-2 bg-white border border-[#D0DFFF] rounded-lg text-sm font-bold text-slate-700 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">体型范围（KG）</label>
                            <input
                                type="text"
                                defaultValue="50-90"
                                className="w-full px-3 py-2 bg-white border border-[#D0DFFF] rounded-lg text-sm font-bold text-slate-700 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">年龄</label>
                            <select className="w-full px-3 py-2 bg-white border border-[#D0DFFF] rounded-lg text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                                <option>成人</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between items-end mb-3 px-1">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">规格预设：扫描体位</h3>
                            <span className="text-[9px] text-slate-400 font-normal italic">only one position can be set for protocol preset</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2.5">
                            {positions.map((pos) => (
                                <button
                                    key={pos.id}
                                    onClick={() => setSelectedPos(pos.id)}
                                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all h-20 ${selectedPos === pos.id
                                        ? "bg-[#4C88FF] border-[#4C88FF] text-white shadow-md"
                                        : "bg-white border-[#D0DFFF] text-slate-500 hover:border-[#4C88FF] hover:bg-[#F4F8FF]"
                                        }`}
                                >
                                    {selectedPos === pos.id && (
                                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                    <span className="text-base font-black mb-0.5 tracking-tight">{pos.id}</span>
                                    <span className={`text-[9px] leading-tight font-medium ${selectedPos === pos.id ? "text-white/80" : "text-slate-400"}`}>
                                        {pos.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-3 bg-[#F4F7FC] border-t border-[#D0DFFF] flex justify-end gap-3 items-center">
                <button className="px-10 py-2 text-sm font-bold text-[#4C88FF] bg-white border border-[#4C88FF] rounded-md hover:bg-[#F4F8FF] transition-colors">
                    取消
                </button>
                <button className="px-10 py-2 text-sm font-bold text-white bg-[#4C88FF] border border-[#4C88FF] rounded-md hover:bg-[#3D76E5] shadow-sm transition-all active:scale-95">
                    保存
                </button>
            </div>

        </div>
    );
}
