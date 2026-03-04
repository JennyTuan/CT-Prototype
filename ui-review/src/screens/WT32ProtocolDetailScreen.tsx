import {
  User,
  Plus,
  ChevronRight,
  Bell,
  Sun,
  Settings,
  Monitor,
  UserCheck,
  Crosshair,
  Thermometer,
  ChevronDown,
} from "lucide-react";

const positions = [
  { code: "HFS", desc: "头先进-仰卧", active: true },
  { code: "FFS", desc: "足先进-仰卧" },
  { code: "HFP", desc: "头先进-俯卧" },
  { code: "FFP", desc: "足先进-俯卧" },
  { code: "HFDR", desc: "头先进-右侧卧" },
  { code: "FFDR", desc: "足先进-右侧卧" },
  { code: "HFDL", desc: "头先进-左侧卧" },
  { code: "FFDL", desc: "足先进-左侧卧" },
];

export default function WT32ProtocolDetailScreen() {
  return (
    <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl text-[#37474F] font-sans select-none">
      <header className="flex items-center justify-between px-4 h-[80px] bg-[#E8EAF1] border-b border-[#B0C4DE] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-sm min-w-[210px]">
            <div className="w-10 h-10 rounded-sm bg-[#4A6982] flex items-center justify-center text-white opacity-90">
              <User size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[#37474F]">张三</span>
              <span className="text-[12px] text-[#546E7A] font-medium leading-none mt-0.5">ID: 20260226</span>
            </div>
          </div>
          <div className="text-[12px] font-bold text-[#4D94FF] leading-[1.2] space-y-1">
            <div className="flex items-center gap-1"><Crosshair size={12} />60 MM</div>
            <div className="flex items-center gap-1"><Monitor size={12} />3.0°</div>
            <div className="flex items-center gap-1"><Thermometer size={12} />60%</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">10:52</div>
          <div className="text-[12px] text-[#546E7A] font-medium mt-1 uppercase opacity-80">3月4日 周三</div>
        </div>

        <div className="flex items-center gap-5 pr-2">
          <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><UserCheck size={30} strokeWidth={1.6} /></div>
          <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">9</span>
          </div>
          <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70"><Sun size={22} /></div>
          <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
            <Settings size={22} />
            <span className="absolute -top-1 -right-2 min-w-[18px] h-4 px-1 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">100</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 flex gap-4">
        <aside className="w-[260px] bg-white rounded-lg border border-[#B0C4DE] shadow-sm overflow-hidden flex flex-col">
          <div className="px-3 py-3 border-b border-[#EEF2F9]">
            <div className="text-[14px] font-bold text-[#37474F] whitespace-nowrap overflow-hidden text-ellipsis">脑部/颈部/螺旋</div>
            <div className="mt-2 flex gap-2 text-[12px]">
              <span className="px-2 py-1 rounded-md bg-[#EEF2F9] text-[#455A64]">头部</span>
              <span className="px-2 py-1 rounded-md bg-[#EEF2F9] text-[#455A64]">成人</span>
            </div>
            <div className="mt-2 text-[12px] leading-5 text-[#4D94FF] bg-[#E8F1FF] border border-[#BFD8FF] rounded-md px-2 py-1.5">出了模板：您的修改仅对本次扫描生效。</div>
          </div>

          <div className="p-3 space-y-2">
            <div className="h-[40px] px-3 rounded-xl bg-[#4D94FF] text-white text-[14px] font-bold flex items-center justify-between shadow-sm">
              协议基本信息
              <ChevronRight size={16} />
            </div>

            <div className="flex justify-between px-1 text-[12px] text-[#78909C]">
              <span>采集队列</span>
              <span className="flex items-center gap-1 text-[#37474F]"><Plus size={14} />新增</span>
            </div>

            <div className="h-[34px] rounded-lg bg-[#F5F7FB] px-3 flex items-center justify-between text-[13px]">
              <span className="font-semibold">定位像</span>
              <span className="text-[11px] text-[#90A4AE]">定位像</span>
            </div>
            <div className="h-[40px] rounded-lg bg-[#F5F7FB] px-3 flex items-center justify-between text-[13px]">
              <span className="font-bold text-[18px] text-[#2F3E58]">Acquisition 1</span>
              <span className="text-[11px] text-[#90A4AE] underline">螺旋扫描</span>
            </div>
            <div className="h-[34px] rounded-lg bg-[#F8FAFC] px-3 flex items-center text-[13px] text-[#607D8B]">锐组织</div>
            <div className="h-[34px] rounded-lg bg-[#F8FAFC] px-3 flex items-center text-[13px] text-[#607D8B]">骨骼</div>
            <div className="text-[12px] text-[#4D94FF] px-1">+ 新增序列</div>

            <div className="h-[34px] rounded-lg bg-[#F8FAFC] px-3 flex items-center justify-between text-[13px]">剂量 / 通知阈值 <ChevronRight size={14} className="text-[#90A4AE]" /></div>
            <div className="h-[34px] rounded-lg bg-[#F8FAFC] px-3 flex items-center justify-between text-[13px]">高级 <ChevronRight size={14} className="text-[#90A4AE]" /></div>
          </div>
        </aside>

        <section className="flex-1 bg-white rounded-lg border border-[#B0C4DE] shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#EEF2F9]">
            <h2 className="text-[20px] font-bold text-[#37474F]">协议基本信息</h2>
            <p className="text-[12px] text-[#607D8B] mt-1">用于扫描模式筛选与协议继承（协议段字段）</p>
          </div>

          <div className="p-4 flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "协议名称", value: "脑部/颈部/螺旋", hasSelect: false },
                { label: "部位", value: "头部", hasSelect: true },
                { label: "解剖区域（细分）", value: "脑部和颈椎", hasSelect: false },
                { label: "体型范围（KG）", value: "50-90", hasSelect: false },
                { label: "年龄", value: "成人", hasSelect: true },
              ].map(({ label, value, hasSelect }, idx) => (
                <div key={label} className={idx === 4 ? "col-span-1" : ""}>
                  <div className="text-[12px] text-[#607D8B] mb-1">{label}</div>
                  <div className="h-[42px] rounded-md border border-[#CFD8E6] bg-[#F8FAFC] px-3 flex items-center justify-between text-[14px] font-medium text-[#37474F]">
                    <span>{value}</span>
                    {hasSelect && <ChevronDown size={16} className="text-[#78909C]" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E3EAF4] flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[15px] text-[#37474F]"><span className="font-bold">现搭预设：</span> 扫描体位</div>
                <div className="text-[12px] text-[#90A4AE]">only one position can be set for protocol preset</div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {positions.map((item) => (
                  <button
                    key={item.code}
                    className={`h-[74px] rounded-xl border text-center transition-colors ${
                      item.active
                        ? "bg-[#4D94FF] border-[#4D94FF] text-white shadow-sm"
                        : "bg-white border-[#CFD8E6] text-[#37474F]"
                    }`}
                  >
                    <div className="text-[16px] font-bold mt-2.5">{item.code}</div>
                    <div className={`text-[11px] mt-1 ${item.active ? "text-white/80" : "text-[#90A4AE]"}`}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-3">
              <button className="h-[42px] px-7 rounded-md border border-[#CFD8E6] bg-white text-[#37474F] text-[16px] font-medium">取消</button>
              <button className="h-[42px] px-7 rounded-md bg-[#4D94FF] text-white text-[16px] font-bold shadow-sm">保存并应用到会话</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
