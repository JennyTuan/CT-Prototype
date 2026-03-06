import { useState } from "react";
import {
  User,
  Plus,
  ChevronRight,
  ChevronDown,
  Bell,
  Lightbulb,
  Settings,
  Monitor,
  Crosshair,
  Thermometer,
  CircleDot,
  HeartPulse,
  Info,
  X,
} from "lucide-react";

type DetailPanel = "basic" | "scout" | "softTissue" | "bone";

type Field = {
  label: string;
  value: string;
  type?: "select" | "input" | "placeholder";
};

const basicInfoFields: Field[] = [
  { label: "协议名称", value: "Chest Routine + Contrast" },
  { label: "检查部位", value: "Thorax" },
  { label: "扫描模式", value: "Helical" },
  { label: "协议版本", value: "WT32 v2.4" },
  { label: "默认层厚", value: "1.0 mm" },
  { label: "重建间隔", value: "0.8 mm" },
];

const scoutFields: Field[] = [
  { label: "KV", value: "120", type: "select" },
  { label: "MA (MAX: 240 [SMALL])", value: "50", type: "input" },
  { label: "ROTATION TIME (S)", value: "1", type: "select" },
  { label: "COLLIMATION", value: "e.g. 2x0.6", type: "placeholder" },
  { label: "SCAN LENGTH (MM)", value: "450", type: "input" },
  { label: "SCAN DIRECTION", value: "OUT", type: "select" },
  { label: "SCOUT FOV", value: "500", type: "input" },
  { label: "DOM", value: "0 or 1", type: "input" },
];

const reconFields: Record<Exclude<DetailPanel, "basic" | "scout">, Field[]> = {
  softTissue: [
    { label: "Kernel", value: "B31f (Soft Tissue)" },
    { label: "Slice Thickness", value: "1.0 mm" },
    { label: "Increment", value: "0.8 mm" },
    { label: "Window W/L", value: "400 / 40" },
  ],
  bone: [
    { label: "Kernel", value: "B70f (Bone)" },
    { label: "Slice Thickness", value: "1.0 mm" },
    { label: "Increment", value: "0.7 mm" },
    { label: "Window W/L", value: "2000 / 500" },
  ],
};

const panelMeta: Record<DetailPanel, { title: string; subtitle: string }> = {
  basic: {
    title: "协议基本信息",
    subtitle: "Protocol profile and defaults",
  },
  scout: {
    title: "定位像采集参数",
    subtitle: "Acquisition settings for scout scan",
  },
  softTissue: {
    title: "软组织重建参数",
    subtitle: "Reconstruction settings for soft tissue",
  },
  bone: {
    title: "骨骼重建参数",
    subtitle: "Reconstruction settings for bone",
  },
};

const cardInputClass =
  "h-[36px] rounded-md border border-[#B0C4DE]/50 bg-white px-3 flex items-center justify-between text-[12px] font-bold text-[#37474F] shadow-sm";

const panelButtonClass = (active: boolean) =>
  `w-full h-[34px] rounded-md px-3 flex items-center justify-between text-[12px] font-bold transition-all ${
    active ? "bg-[#4D94FF] text-white shadow-sm" : "text-[#546E7A] hover:bg-[#EEF2F9]"
  }`;

export default function WT32ProtocolDetailScreen() {
  const [activePanel, setActivePanel] = useState<DetailPanel>("basic");

  const renderBasicPanel = () => (
    <div className="grid grid-cols-2 gap-3">
      {basicInfoFields.map((field) => (
        <div key={field.label} className="p-2 bg-[#F8FAFC] border border-[#EEF2F9] rounded-md">
          <div className="text-[9px] font-black uppercase tracking-wider text-[#90A4AE]">{field.label}</div>
          <div className={`${cardInputClass} mt-1`}>{field.value}</div>
        </div>
      ))}
    </div>
  );

  const renderScoutPanel = () => (
    <>
      <div className="p-3 bg-[#E3F2FD] border border-[#BBDEFB] rounded-md text-[#1E88E5]">
        <div className="text-[12px] font-black flex items-center gap-1">
          <Info size={14} /> Scout note
        </div>
        <p className="text-[11px] mt-1">Scout is used for positioning. It does not include reconstruction output.</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {scoutFields.map((field) => (
          <div key={field.label} className="p-2 bg-[#F8FAFC] border border-[#EEF2F9] rounded-md">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#90A4AE]">{field.label}</div>
            <div className={`${cardInputClass} mt-1`}>
              <span className={field.type === "placeholder" ? "text-[#B0BEC5]" : ""}>{field.value}</span>
              {field.type === "select" && <ChevronDown size={12} className="text-[#90A4AE]" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button className="h-[32px] px-3 border border-[#B0C4DE] rounded-md text-[11px] font-bold text-[#546E7A] hover:bg-[#EEF2F9] transition-all flex items-center gap-1">
          <X size={12} /> 删除该采集队列
        </button>
      </div>
    </>
  );

  const renderReconPanel = () => {
    const fields = reconFields[activePanel as "softTissue" | "bone"];
    return (
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.label} className="p-2 bg-[#F8FAFC] border border-[#EEF2F9] rounded-md">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#90A4AE]">{field.label}</div>
            <div className={`${cardInputClass} mt-1`}>{field.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[1024px] h-[768px] bg-[#EEF2F9] border border-[#B0C4DE] rounded-md shadow-sm text-[#37474F] flex flex-col overflow-hidden select-none">
      <header className="h-[84px] bg-[#E8EAF1] border-b border-[#B0C4DE] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-[#4D94FF] text-white flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <div className="text-[13px] font-black">张三</div>
              <div className="text-[10px] text-[#546E7A] font-bold">ID: 20260226</div>
            </div>
          </div>
          <div className="text-[10px] font-bold text-[#546E7A] leading-4">
            <div className="flex items-center gap-1">
              <CircleDot size={10} /> 60 MM
            </div>
            <div className="flex items-center gap-1">
              <Crosshair size={10} /> 3.0°
            </div>
            <div className="flex items-center gap-1">
              <Thermometer size={10} /> 60%
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[28px] font-bold leading-none">13:32</div>
          <div className="text-[11px] font-bold text-[#546E7A] mt-1">3月4日 周三</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[#D32F2F]">
            <HeartPulse size={24} />
          </div>
          <div className="text-[#546E7A]">
            <Monitor size={22} />
          </div>
          <div className="relative text-[#546E7A]">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[8px] rounded-full flex items-center justify-center border border-white">
              9
            </span>
          </div>
          <div className="text-[#546E7A]">
            <Lightbulb size={22} />
          </div>
          <div className="relative text-[#546E7A]">
            <Settings size={22} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[8px] rounded-full flex items-center justify-center border border-white">
              10
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        <aside className="w-[264px] bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] px-3 flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-[#37474F]">协议结构</span>
            <button className="w-[28px] h-[28px] rounded-md text-[#4D94FF] hover:bg-[#EEF2F9] flex items-center justify-center">
              <Plus size={16} />
            </button>
          </div>

          <div className="p-2 space-y-2">
            <button type="button" onClick={() => setActivePanel("basic")} className={panelButtonClass(activePanel === "basic")}>
              <span>协议基本信息</span>
              <ChevronRight size={14} className={activePanel === "basic" ? "text-white" : "text-[#90A4AE]"} />
            </button>

            <div className="rounded-md border border-[#EEF2F9] p-2">
              <button type="button" onClick={() => setActivePanel("scout")} className={panelButtonClass(activePanel === "scout")}>
                <span>定位像</span>
                <span className="text-[10px] opacity-80">Scout</span>
              </button>
              <div className="text-[10px] text-[#90A4AE] px-2 py-1">定位像不需要重建</div>

              <div className="ml-2 border-l border-[#EEF2F9] pl-2 space-y-1">
                <div className="h-[28px] rounded-md bg-[#EEF2F9] px-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#546E7A]">Acquisition 1</span>
                  <span className="text-[10px] text-[#90A4AE]">Helical</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePanel("softTissue")}
                  className={`w-full h-[28px] px-2 rounded-md text-left text-[11px] font-bold transition-all ${
                    activePanel === "softTissue"
                      ? "bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]"
                      : "text-[#546E7A] hover:bg-[#EEF2F9]"
                  }`}
                >
                  软组织
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("bone")}
                  className={`w-full h-[28px] px-2 rounded-md text-left text-[11px] font-bold transition-all ${
                    activePanel === "bone"
                      ? "bg-[#E3F2FD] text-[#1E88E5] border border-[#BBDEFB]"
                      : "text-[#546E7A] hover:bg-[#EEF2F9]"
                  }`}
                >
                  骨骼
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto p-2 border-t border-[#EEF2F9] bg-[#F8FAFC] space-y-2">
            <button className="w-full h-[32px] rounded-md border border-[#B0C4DE] bg-white text-[11px] font-bold text-[#546E7A] hover:bg-[#EEF2F9]">
              剂量 / 通知阈值
            </button>
            <button className="w-full h-[32px] rounded-md border border-[#B0C4DE] bg-white text-[11px] font-bold text-[#546E7A] hover:bg-[#EEF2F9]">
              高级
            </button>
          </div>
        </aside>

        <section className="flex-1 bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden">
          <div className="h-[48px] bg-[#F8FAFC] border-b border-[#EEF2F9] px-4 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-black text-[#37474F]">{panelMeta[activePanel].title}</div>
              <div className="text-[10px] font-bold text-[#90A4AE]">{panelMeta[activePanel].subtitle}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === "basic" && renderBasicPanel()}
            {activePanel === "scout" && renderScoutPanel()}
            {(activePanel === "softTissue" || activePanel === "bone") && renderReconPanel()}
          </div>
        </section>
      </main>

      <footer className="h-[84px] bg-[#E8EAF1] border-t border-[#B0C4DE] px-8 flex items-center justify-end gap-3 shrink-0">
        <button className="h-[44px] px-8 bg-white text-[#4D94FF] border-2 border-[#4D94FF] rounded-md text-[13px] font-bold hover:bg-[#E3F2FD] transition-all">
          取消
        </button>
        <button className="h-[44px] px-8 bg-[#4D94FF] text-white rounded-md text-[13px] font-bold shadow-md hover:bg-blue-600 transition-all">
          保存并应用到会话
        </button>
      </footer>
    </div>
  );
}
