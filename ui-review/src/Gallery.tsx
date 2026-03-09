import { useMemo, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import PatientListScreen from "./screens/PatientListScreen";
import ScoutScanScreen from "./screens/ScoutScanScreen";
import FourDScanScreen from "./screens/FourDScanScreen";
import ProtocolSetupScreen from "./screens/ProtocolSetupScreen";
import WT32ProtocolDetailScreen from "./screens/WT32ProtocolDetailScreen";
import WT32ProtocolScoutDetailScreen from "./screens/WT32NewProtocolScoutDetailScreen";
import WT32ProtocolHelicalDetailScreen from "./screens/WT32NewProtocolHelicalDetailScreen";
import WT32ProtocolReconDetailScreen from "./screens/WT32NewProtocolReconDetailScreen";
import ScanConfirmScreen from "./screens/ScanConfirmScreen";
import MockScanScreen from "./screens/MockScanScreen";
import ViewScreen from "./screens/ViewScreen";
import TubeWarmupScreen from "./screens/TubeWarmupScreen";
import AirCalibrationScreen from "./screens/AirCalibrationScreen";
import DailyQAScreen from "./screens/DailyQAScreen";
import HardwareTestScreen from "./screens/HardwareTestScreen";
import BatteryManagementScreen from "./screens/BatteryManagementScreen";
import ComponentLibraryScreen from "./screens/ComponentLibraryScreen";
import DiskManagementScreen from "./screens/DiskManagementScreen";
import PerformanceEvaluationScreen from "./screens/PerformanceEvaluationScreen";
import CTSimulatorUIRefactor from "./screens/CTSimulatorUIRefactor";
import CTSimulatorUIRefactorLight from "./screens/CTSimulatorUIRefactorLight";
import CTSimulatorUIRefactorLight2 from "./screens/CTSimulatorUIRefactorLight2";



export default function Gallery() {
    const categories = useMemo(() => [
        {
            id: "wt32",
            name: "WT32 平台",
            screens: [
                { key: "patient_list", name: "患者列表", component: <PatientListScreen /> },
                { key: "protocol_setup", name: "协议选择", component: <ProtocolSetupScreen /> },
                { key: "protocol_detail", name: "协议详情", component: <WT32ProtocolDetailScreen /> },
                { key: "protocol_scout_detail", name: "协议详情-定位像", component: <WT32ProtocolScoutDetailScreen /> },
                { key: "protocol_helical_detail", name: "协议详情-螺旋扫描", component: <WT32ProtocolHelicalDetailScreen /> },
                { key: "protocol_recon_soft", name: "协议详情-重建(软组织)", component: <WT32ProtocolReconDetailScreen type="soft" /> },
                { key: "protocol_recon_bone", name: "协议详情-重建(骨骼)", component: <WT32ProtocolReconDetailScreen type="bone" /> },
                { key: "scout_scan", name: "激光灯定位", component: <ScoutScanScreen /> },
                { key: "4d-scan", name: "4D 扫描", component: <FourDScanScreen /> },
                { key: "scan_confirm", name: "参数确认", component: <ScanConfirmScreen /> },
                { key: "view", name: "图像预览", component: <ViewScreen /> },
                { key: "mock_scan", name: "模拟按键", component: <MockScanScreen /> },
                { key: "tube-warmup", name: "球管预热", component: <TubeWarmupScreen /> },
                { key: "air-calibration", name: "空气校正", component: <AirCalibrationScreen /> },
                { key: "daily-qa", name: "日常QA", component: <DailyQAScreen /> },
                { key: "hardware-test", name: "硬件测试", component: <HardwareTestScreen /> },
                { key: "battery-management", name: "电池管理", component: <BatteryManagementScreen /> },
                { key: "disk-management", name: "磁盘管理", component: <DiskManagementScreen /> },
                { key: "performance-evaluation", name: "性能评估", component: <PerformanceEvaluationScreen /> },
                { key: "component-library", name: "组件库", component: <ComponentLibraryScreen /> },
            ]
        },
        {
            id: "vertical-ct",
            name: "垂直 CT 平台",
            screens: [
                { key: "ct-simulator-ui-refactor-dark", name: "CTSimulatorUIRefactor-dark", component: <CTSimulatorUIRefactor /> },
                { key: "CTSimulatorUIRefactor-light", name: "CTSimulatorUIRefactor-light", component: <CTSimulatorUIRefactorLight /> },
                { key: "CTSimulatorUIRefactor-light2", name: "CTSimulatorUIRefactor-light2", component: <CTSimulatorUIRefactorLight2 /> },
            ]
        }
    ], []);

    const allScreens = useMemo(() => categories.flatMap(c => c.screens), [categories]);
    const [activeKey, setActiveKey] = useState(allScreens[0]?.key);
    const active = allScreens.find((s) => s.key === activeKey) ?? allScreens[0];
    const wt32Keys = useMemo(() => categories.find((c) => c.id === "wt32")?.screens.map((s) => s.key) ?? [], [categories]);
    const isWt32Active = wt32Keys.includes(activeKey ?? "");

    const previewRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        if (!previewRef.current) return;

        // Target the actual 1366x768 component container, not the wrapper with borders and shadow
        const targetElement = previewRef.current.firstElementChild as HTMLElement || previewRef.current;

        try {
            const canvas = await html2canvas(targetElement, {
                scale: 3, // Increased scale for maximum Retina clarity
                useCORS: true,
                backgroundColor: null,
                width: 1366,
                height: 768,
                windowWidth: 1366,
                windowHeight: 768,
            });

            const link = document.createElement('a');
            link.download = `${active?.name || 'export'}_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-[#F8FAFC]">
            {/* 侧边导航 */}
            <aside className="w-[260px] shrink-0 border-r border-[#E2E8F0] bg-white flex flex-col shadow-sm">
                <div className="p-6 border-b border-[#F1F5F9]">
                    <div className="font-black text-[15px] text-[#0F172A] tracking-tight uppercase">UI Review Gallery</div>
                    <div className="text-[11px] text-[#64748B] font-medium mt-1">Design Validation System</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                    {categories.map((cat) => (
                        <div key={cat.id} className="mb-6 last:mb-2">
                            <div className="px-3 mb-2 text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.15em] flex items-center gap-2">
                                <span className="w-1 h-3 bg-[#CBD5E1] rounded-full"></span>
                                {cat.name}
                            </div>
                            <div className="space-y-0.5">
                                {cat.screens.map((s) => {
                                    const isActive = s.key === activeKey;
                                    return (
                                        <button
                                            key={s.key}
                                            onClick={() => setActiveKey(s.key)}
                                            className={`
                                                w-full text-left px-4 py-2 rounded-lg transition-all duration-200 group relative
                                                ${isActive
                                                    ? "bg-[#F1F5F9] text-[#2563EB] font-bold shadow-sm"
                                                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                                                }
                                            `}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#2563EB] rounded-r-full" />
                                            )}
                                            <div className="text-[13px] tracking-tight">{s.name}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
                    <div className="text-[10px] text-[#94A3B8] font-bold text-center uppercase tracking-widest">
                        v4.2.0 • Build 2026.03
                    </div>
                </div>
            </aside>

            {/* 内容预览 */}
            <main className="flex-1 overflow-hidden flex flex-col bg-[#F1F5F9]/30">
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#94A3B8] font-medium uppercase tracking-wider">Previewing:</span>
                        <span className="text-[14px] font-bold text-[#1E293B]">{active?.name}</span>
                    </div>
                    <button
                        onClick={handleExport}
                        className="px-5 py-1.5 border-2 border-red-500 text-red-500 font-bold rounded hover:bg-red-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
                    >
                        导出
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
                    <div ref={previewRef} className={`bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E2E8F0] overflow-hidden ${isWt32Active ? "wt32-preview" : ""}`}>
                        {active?.component}
                    </div>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
                .wt32-preview button {
                    border-radius: 8px !important;
                }
            `}</style>
        </div>
    );
}

