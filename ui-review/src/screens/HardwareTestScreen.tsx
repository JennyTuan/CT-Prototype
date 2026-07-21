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
    FileText,
    Activity,
} from 'lucide-react';

const HardwareTestScreen = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('机架');
    const [params, setParams] = useState({
        rotateSpeed: '3',
        gantrySpeed: '3',
        gantryAngle: '180',
        tiltAngle: '0',
    });
    const [editingField, setEditingField] = useState<string | null>(null);

    const sidebarItems = [
        { icon: <Thermometer size={18} />, label: "球管预热" },
        { icon: <Wind size={18} />, label: "空气校正" },
        { icon: <CheckCircle2 size={18} />, label: "日常QA" },
        { icon: <TestTube size={18} />, label: "硬件测试", active: true },
        { icon: <Battery size={18} />, label: "电池管理" },
        { icon: <Disc size={18} />, label: "磁盘管理" },
        { icon: <BarChart3 size={18} />, label: "性能评估" },
        { icon: <MousePointer2 size={18} />, label: "手动扫描" },
    ];

    const tabs = ['机架', '轨道', '影像'];

    const logs = [
        { time: '16:14:02', module: '机架', action: '系统初始化', params: '无参数', result: '硬件测试控制台已就绪' },
        { time: '16:14:05', module: '机架', action: '通信检测', params: '无参数', result: '机架通讯正常' },
    ];

    const testItems = [
        { id: 'gantry-reset', name: '机架复位', code: 'RCB', params: null, buttonLabel: '复位', buttonType: 'secondary' },
        { id: 'rotate-zero', name: '旋转找零', code: null, params: null, buttonLabel: '开始', buttonType: 'primary' },
        {
            id: 'rotate-ctrl', name: '旋转控制', code: null, buttonLabel: '开始', buttonType: 'primary',
            params: [{ key: 'rotateSpeed', label: '速度', width: 'w-14' }]
        },
        {
            id: 'gantry-pos', name: '机架定位', code: null, buttonLabel: '开始', buttonType: 'primary',
            params: [
                { key: 'gantrySpeed', label: '速度', width: 'w-14' },
                { key: 'gantryAngle', label: '角度', width: 'w-16' },
            ]
        },
        { id: 'tilt-reset', name: '倾斜复位', code: null, params: null, buttonLabel: '复位', buttonType: 'secondary' },
        {
            id: 'tilt-ctrl', name: '倾斜控制', code: null, buttonLabel: '开始', buttonType: 'primary',
            params: [{ key: 'tiltAngle', label: '角度', width: 'w-14' }]
        },
    ];

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
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">16:14</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1">3月2日 周一</div>
                </div>

                <div className="flex items-center gap-6 pr-2">
                    <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><Plus size={32} strokeWidth={1.5} /></div>
                    <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Layout size={24} /></div>
                    <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Lightbulb size={24} /></div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Settings size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">10</span>
                    </div>
                </div>
            </header>

            {/* 2. Content Area */}
            <main className="flex-1 overflow-hidden p-4 flex gap-4 bg-[#EEF2F9]">
                {/* Sidebar */}
                <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[220px]'} bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col p-4 shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between mb-6 h-10">
                        {!isCollapsed && (
                            <div className="animate-in fade-in duration-300">
                                <div className="text-[14px] font-black text-[#37474F] uppercase tracking-wider">服务模式</div>
                                <div className="text-[10px] text-[#90A4AE] font-bold mt-0.5">硬件 / 硬件测试</div>
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
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-[#4D94FF] text-white rounded-md mb-4 shadow-sm transition-all`}>
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-md">
                                    <LayoutGrid size={20} />
                                </div>
                                {!isCollapsed && <span className="font-bold text-[14px]">硬件</span>}
                            </div>
                            {!isCollapsed && <ChevronDown size={18} className="opacity-60" />}
                        </div>

                        {sidebarItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-md cursor-pointer transition-all ${item.active ? 'bg-[#E3F2FD] text-[#1E88E5] border-l-4 border-[#1E88E5]' : 'text-[#546E7A] hover:bg-gray-50'}`}
                            >
                                <div className={`${item.active ? 'text-[#1E88E5]' : 'text-[#90A4AE]'}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className={`text-[13px] ${item.active ? 'font-bold' : 'font-medium'} whitespace-nowrap`}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content Card */}
                <div className="flex-1 flex flex-col min-h-0 gap-3">

                    {/* Test Panel */}
                    <section className="flex-1 flex flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

                        {/* Card Header */}
                        <div className="flex items-center justify-between border-b border-[#EEF2F9] bg-[#F8FAFC] px-5 py-3 shrink-0">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                                    style={{ background: 'linear-gradient(135deg, #4D94FF 0%, #1E88E5 100%)' }}
                                >
                                    <TestTube size={15} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold text-[#1E293B]">硬件测试</div>
                                    <div className="text-[10px] text-[#94A3B8]">设备功能验证与参数调试</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
                                style={{ background: '#E3F2FD', color: '#1E88E5' }}>
                                <Activity size={12} />
                                当前无动作运行
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-end border-b border-[#EEF2F9] px-5 pt-2 shrink-0">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative px-5 py-2 text-[13px] font-semibold transition-colors ${activeTab === tab ? 'text-[#4D94FF]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#4D94FF]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Column Header */}
                        <div className="grid grid-cols-[2fr_2fr_160px] border-b border-[#F1F5F9] bg-[#F8FAFC] px-5 py-2 shrink-0">
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">测试项目</div>
                            <div className="text-center text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">参数调节</div>
                            <div className="text-center text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">操作控制</div>
                        </div>

                        {/* Rows */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {testItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`grid grid-cols-[2fr_2fr_160px] items-center px-5 py-3.5 transition-colors hover:bg-[#FAFCFF] ${
                                        index < testItems.length - 1 ? 'border-b border-[#F1F5F9]' : ''
                                    }`}
                                    style={{ borderLeft: '3px solid transparent' }}
                                >
                                    {/* Name */}
                                    <div className="flex items-center gap-2 pr-4">
                                        <span className="text-[13px] font-semibold text-[#1E293B]">{item.name}</span>
                                        {item.code && (
                                            <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-medium text-[#94A3B8]">
                                                {item.code}
                                            </span>
                                        )}
                                    </div>

                                    {/* Params */}
                                    <div className="flex items-center justify-center gap-4 px-2">
                                        {item.params ? item.params.map(p => (
                                            <div key={p.key} className="flex items-center gap-2">
                                                <span className="text-[11px] font-medium text-[#94A3B8]">{p.label}</span>
                                                {editingField === `${item.id}:${p.key}` ? (
                                                    <input
                                                        autoFocus
                                                        value={params[p.key as keyof typeof params]}
                                                        onChange={e => setParams(prev => ({ ...prev, [p.key]: e.target.value }))}
                                                        onBlur={() => setEditingField(null)}
                                                        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingField(null); }}
                                                        className={`${p.width} h-7 rounded-md border border-[#93C5FD] bg-white px-2 text-center text-[13px] font-semibold text-[#4D94FF] outline-none ring-2 ring-[#BFDBFE]`}
                                                    />
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingField(`${item.id}:${p.key}`)}
                                                        className={`${p.width} h-7 rounded-md border border-[#CBD5E1] bg-white px-2 text-center text-[13px] font-semibold text-[#4D94FF] transition-colors hover:border-[#93C5FD] hover:bg-[#F0F7FF]`}
                                                    >
                                                        {params[p.key as keyof typeof params]}
                                                    </button>
                                                )}
                                            </div>
                                        )) : (
                                            <span className="text-[12px] italic text-[#CBD5E1]">无参数</span>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            className={`h-7 min-w-[80px] rounded-full px-5 text-[12px] font-semibold transition-all active:scale-95 ${
                                                item.buttonType === 'primary'
                                                    ? 'text-white shadow-sm'
                                                    : 'border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                                            }`}
                                            style={item.buttonType === 'primary' ? {
                                                background: 'linear-gradient(135deg, #4D94FF 0%, #1E88E5 100%)',
                                                boxShadow: '0 2px 8px rgba(77,148,255,0.3)'
                                            } : {}}
                                        >
                                            {item.buttonLabel}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Log Panel */}
                    <section className="shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#EEF2F9] bg-[#F8FAFC] px-5 py-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E3F2FD]">
                                    <FileText size={12} style={{ color: '#1E88E5' }} />
                                </div>
                                <span className="text-[12px] font-bold text-[#475569]">操作日志</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                                <span className="text-[11px] text-[#94A3B8]">
                                    最近 {logs.length} 条记录，当前无动作运行
                                </span>
                            </div>
                            <button
                                type="button"
                                className="rounded-md px-2.5 py-1 text-[11px] font-medium text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#475569]"
                            >
                                清空日志
                            </button>
                        </div>

                        <div className="grid grid-cols-[96px_72px_1fr_1.2fr_160px] border-b border-[#F1F5F9] bg-[#FAFCFF] px-5 py-1.5">
                            {['时间', '模块', '动作', '参数快照', '结果'].map(col => (
                                <div key={col} className="text-[10px] font-semibold uppercase tracking-widest text-[#CBD5E1]">{col}</div>
                            ))}
                        </div>

                        <div className="overflow-y-auto custom-scrollbar">
                            {logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`grid grid-cols-[96px_72px_1fr_1.2fr_160px] items-center px-5 py-2.5 transition-colors hover:bg-[#F8FBFF] ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFF]'
                                    } ${index < logs.length - 1 ? 'border-b border-[#F8FAFC]' : ''}`}
                                >
                                    <div className="font-mono text-[11px] text-[#94A3B8]">{log.time}</div>
                                    <div className="text-[12px] font-semibold text-[#475569]">{log.module}</div>
                                    <div className="text-[12px] text-[#475569]">{log.action}</div>
                                    <div className="truncate text-[12px] text-[#94A3B8]">{log.params}</div>
                                    <div className="text-[12px] font-semibold" style={{ color: '#4D94FF' }}>{log.result}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* 3. Footer */}
            <footer className="h-[56px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center px-8 shrink-0">
                <button className="h-[36px] px-8 bg-white border border-[#B0C4DE] rounded-md text-[13px] font-bold text-[#37474F] hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                    首页
                </button>
                <div className="ml-6 text-[12px] text-[#546E7A] font-medium">
                    服务模式 · 硬件 / 硬件测试
                </div>
            </footer>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #B0C4DE; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #90A4AE; }
            `}</style>
        </div>
    );
};

export default HardwareTestScreen;
