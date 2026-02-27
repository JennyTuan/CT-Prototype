import React, { useMemo, useState } from "react";
import PatientListScreen from "./screens/PatientListScreen";
import ScoutScanScreen from "./screens/ScoutScanScreen";
import ProtocolSetupScreen from "./screens/ProtocolSetupScreen";
import ScanConfirmScreen from "./screens/ScanConfirmScreen";

interface ScreenDef {
    key: string;
    name: string;
    component: React.ReactNode;
}

export default function Gallery() {
    const screens = useMemo<ScreenDef[]>(
        () => [
            { key: "patient_list", name: "患者列表（待检查/已完成）", component: <PatientListScreen /> },
            { key: "scout_scan", name: "激光灯定位", component: <ScoutScanScreen /> },
            { key: "scan_confirm", name: "参数确认页面", component: <ScanConfirmScreen /> },
            { key: "protocol_setup", name: "协议选择界面", component: <ProtocolSetupScreen /> },
        ],
        []
    );

    const [activeKey, setActiveKey] = useState(screens[0]?.key);
    const active = screens.find((s) => s.key === activeKey) ?? screens[0];

    return (
        <div className="h-screen w-screen flex bg-[#F3F6FB]">
            {/* 左侧导航 */}
            <aside className="w-[280px] shrink-0 border-r border-[#D6E0EE] bg-white">
                <div className="px-4 py-3 border-b border-[#EEF2F9]">
                    <div className="font-bold text-[14px] text-[#263238]">UI Review Gallery</div>
                    <div className="text-[12px] text-[#607D8B] mt-1">用于设计评审的界面集合</div>
                </div>

                <div className="p-2">
                    {screens.map((s) => {
                        const active = s.key === activeKey;
                        return (
                            <button
                                key={s.key}
                                onClick={() => setActiveKey(s.key)}
                                className={[
                                    "w-full text-left px-3 py-2 rounded-md mb-1 transition",
                                    active
                                        ? "bg-[#E3F2FD] text-[#1565C0] font-bold"
                                        : "hover:bg-[#F6F9FF] text-[#37474F]"
                                ].join(" ")}
                            >
                                <div className="text-[13px]">{s.name}</div>
                                <div className="text-[11px] opacity-70">{s.key}</div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* 右侧预览 */}
            <main className="flex-1 overflow-auto p-4">
                <div className="mb-3 text-[12px] text-[#607D8B]">
                    当前预览：<span className="font-bold text-[#37474F]">{active?.name}</span>
                </div>

                {/* 让你的 1024x768 主画面居中显示 */}
                <div className="flex justify-center">
                    {active?.component}
                </div>
            </main>
        </div>
    );
}