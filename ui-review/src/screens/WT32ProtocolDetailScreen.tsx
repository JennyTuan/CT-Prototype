import {
  User,
  Plus,
  ChevronRight,
  Bell,
  Lightbulb,
  Settings,
  Crosshair,
  Thermometer,
  CircleDot,
  ChevronDown,
  Info,
  X,
  HeartPulse,
} from "lucide-react";

const scanFields = [
  { label: "KV", value: "120", type: "select" },
  { label: "MA (MAX: 240 [SMALL])", value: "50", type: "input" },
  { label: "旋转时间 (S)", value: "1", type: "select" },
  { label: "准直器 (COLLIMATION)", value: "例如：32×0.6", type: "placeholder" },
  { label: "扫描长度 (MM)", value: "450", type: "input" },
  { label: "扫描方向", value: "OUT", type: "select" },
  { label: "定位像 FOV", value: "500", type: "input" },
  { label: "DOM（动态扫描）", value: "0 或 1", type: "input" },
  { label: "床倾角 (ANGLE)", value: "0", type: "input", span: true },
];

export default function WT32ProtocolDetailScreen() {
  return (
    <div className="flex flex-col w-[1024px] h-[768px] bg-[#F3F4F6] overflow-hidden rounded-md border border-[#D1D5DB] shadow-2xl text-[#334155] font-sans select-none">
      <header className="flex items-center justify-between px-7 h-[96px] bg-[#F8FAFC] border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 py-2 px-4 bg-white border border-[#E2E8F0] rounded-2xl min-w-[170px] shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#2B6CBF] flex items-center justify-center text-white">
              <User size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[30px] leading-none scale-50 origin-left font-bold text-[#0F172A]">张三</span>
              <span className="text-[18px] leading-none scale-50 origin-left text-[#94A3B8] mt-1">ID: 20260226</span>
            </div>
          </div>
          <div className="text-[11px] font-bold text-[#1E3A8A] leading-[1.25] space-y-1">
            <div className="flex items-center gap-1"><CircleDot size={12} />60 MM</div>
            <div className="flex items-center gap-1 text-[#2563EB]"><Crosshair size={12} />3.0°</div>
            <div className="flex items-center gap-1"><Thermometer size={12} />60%</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[46px] leading-none scale-50 origin-center font-black tracking-tight text-[#0F172A]">13:32</div>
          <div className="text-[24px] scale-50 origin-center text-[#64748B] font-semibold -mt-2">3月4日 周三</div>
        </div>

        <div className="flex items-center gap-3 pr-2">
          <div className="w-10 h-10 rounded-xl border border-[#CBD5E1] bg-white text-[#EF4444] flex items-center justify-center"><HeartPulse size={25} /></div>
          <div className="relative w-10 h-10 rounded-xl border border-[#CBD5E1] bg-white text-[#64748B] flex items-center justify-center">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">9</span>
          </div>
          <div className="w-10 h-10 rounded-xl border border-[#CBD5E1] bg-white text-[#64748B] flex items-center justify-center"><Lightbulb size={21} /></div>
          <div className="relative w-10 h-10 rounded-xl border border-[#CBD5E1] bg-white text-[#64748B] flex items-center justify-center">
            <Settings size={22} />
            <span className="absolute -top-1 -right-2 min-w-[22px] h-4 px-1 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">100</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 flex gap-4">
        <aside className="w-[250px] bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] px-3 py-4 flex flex-col">
          <div className="h-[42px] px-4 rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-bold text-[#334155] flex items-center justify-between">
            协议基本信息
            <ChevronRight size={16} className="text-[#CBD5E1]" />
          </div>

          <div className="mt-4 flex justify-between px-2 text-[21px] scale-50 origin-left text-[#64748B]">
            <span>采集队列</span>
            <span className="flex items-center gap-1 text-[#0F172A]"><Plus size={16} />新增</span>
          </div>

          <div className="mt-1 rounded-xl bg-[#2563EB] px-3 h-[38px] flex items-center justify-between text-white shadow">
            <span className="text-[14px] font-bold">定位像</span>
            <span className="text-[12px]">定位像</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-2 px-4 italic">定位像不需要重建</div>

          <div className="mt-2 ml-2 border-l border-[#E2E8F0] pl-2 space-y-2">
            <div className="h-[34px] rounded-xl bg-[#E5E7EB] px-3 flex items-center justify-between">
              <span className="font-bold text-[#475569]">Acquisition 1</span>
              <span className="text-[12px] text-[#94A3B8]">螺旋扫描</span>
            </div>
            <div className="text-[14px] text-[#64748B] px-3">软组织</div>
            <div className="text-[14px] text-[#64748B] px-3">骨骼</div>
            <div className="text-[12px] text-[#60A5FA] px-3">+ 新增重建</div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-[40px] px-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[14px] font-semibold text-[#334155] flex items-center justify-between">
              剂量 / 通知阈值
              <ChevronRight size={15} className="text-[#CBD5E1]" />
            </div>
            <div className="h-[40px] px-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[14px] font-semibold text-[#334155] flex items-center justify-between">
              高级
              <ChevronRight size={15} className="text-[#CBD5E1]" />
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex flex-col min-h-0">
          <div className="px-6 py-5 border-b border-[#E5E7EB]">
            <h2 className="text-[30px] leading-none scale-50 origin-left font-black text-[#0F172A]">扫描采集：定位像</h2>
            <p className="text-[24px] leading-none scale-50 origin-left text-[#64748B] mt-1">单个采集队列的扫描参数（kV, mA, 长度等）</p>
          </div>

          <div className="px-5 py-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] text-[#64748B] mb-1">名称</div>
                <div className="h-[36px] rounded-lg border border-[#CBD5E1] bg-white px-3 text-[28px] leading-none scale-50 origin-left font-semibold text-[#0F172A] flex items-center">定位像</div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B] mb-1">模式</div>
                <div className="h-[36px] rounded-lg border border-[#CBD5E1] bg-white px-3 text-[28px] leading-none scale-50 origin-left font-semibold text-[#0F172A] flex items-center justify-between">
                  定位像
                  <ChevronRight size={14} className="rotate-90 text-[#334155]" />
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl border border-[#93C5FD] bg-[#DBEAFE] text-[#2563EB]">
              <div className="text-[14px] font-bold flex items-center gap-1"><Info size={14} /> 定位像扫描</div>
              <p className="text-[13px] mt-1">定位像用于定位扫描区域，不涉及图像重建。通常使用较低剂量参数。</p>
            </div>

            <div className="mt-4 rounded-3xl border border-[#E5E7EB] bg-[#F3F4F6] p-4">
              <div className="text-[16px] font-bold text-[#475569] mb-3">采集参数</div>
              <div className="grid grid-cols-2 gap-3">
                {scanFields.map((field) => (
                  <div key={field.label} className={field.span ? "col-span-1" : ""}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-1">{field.label}</div>
                    <div className="h-[36px] rounded-lg border border-[#D1D5DB] bg-white px-3 flex items-center justify-between text-[30px] leading-none scale-50 origin-left font-semibold text-[#111827]">
                      <span className={field.type === "placeholder" ? "text-[#94A3B8]" : ""}>{field.value}</span>
                      {field.type === "select" && <ChevronDown size={14} className="text-[#334155]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <button className="inline-flex items-center gap-1 text-[#94A3B8] text-[13px] hover:text-[#64748B]">
                  <X size={14} /> 删除该采集队列
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="h-[72px] px-6 flex items-center justify-end gap-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <button className="h-[40px] px-8 rounded-xl border border-[#D1D5DB] bg-white text-[#334155] text-[30px] leading-none scale-50 origin-center font-bold">取消</button>
        <button className="h-[40px] px-8 rounded-xl bg-[#2563EB] text-white text-[30px] leading-none scale-50 origin-center font-bold shadow">保存并应用到会话</button>
      </footer>
    </div>
  );
}
