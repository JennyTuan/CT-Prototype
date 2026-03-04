import {
  User,
  Ruler,
  CircleDashed,
  Thermometer,
  Plus,
  ChevronRight,
  Cross,
  Bell,
  Lightbulb,
  Settings,
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
    <div className="w-[1024px] h-[768px] bg-[#F5F6FA] border border-[#D8DFEA] rounded-[6px] overflow-hidden text-[#1F2A44] font-sans select-none flex flex-col">
      <header className="h-[94px] border-b border-[#D8DFEA] bg-[#F3F4F7] px-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-[170px] h-[64px] rounded-[14px] border border-[#E2E6EE] bg-white px-4 flex items-center gap-3 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#2277D6] flex items-center justify-center text-white">
              <User size={22} />
            </div>
            <div>
              <div className="text-[26px] leading-none font-semibold">张三</div>
              <div className="text-[18px] text-[#7F8BA3] mt-1">ID: 20260226</div>
            </div>
          </div>
          <div className="text-[#1B63D5] space-y-1 text-[25px] font-semibold leading-none">
            <div className="flex items-center gap-2"><Ruler size={15} />60 MM</div>
            <div className="flex items-center gap-2"><CircleDashed size={15} />3.0°</div>
            <div className="flex items-center gap-2"><Thermometer size={15} />60%</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[50px] leading-none font-bold text-[#1F2A44]">10:52</div>
          <div className="text-[30px] text-[#4E607F] font-semibold mt-1">3月4日 周三</div>
        </div>

        <div className="flex items-center gap-3 text-[#4E607F]">
          <button className="w-[42px] h-[42px] rounded-xl border border-[#D5DDEA] bg-[#F5F7FB] flex items-center justify-center text-[#E54747]"><Cross size={24} /></button>
          <button className="w-[42px] h-[42px] rounded-xl border border-[#D5DDEA] bg-[#F5F7FB] flex items-center justify-center relative"><Bell size={22} /><span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-[#E30613] text-white text-[10px] leading-4">9</span></button>
          <button className="w-[42px] h-[42px] rounded-xl border border-[#D5DDEA] bg-[#F5F7FB] flex items-center justify-center"><Lightbulb size={22} /></button>
          <button className="w-[42px] h-[42px] rounded-xl border border-[#D5DDEA] bg-[#F5F7FB] flex items-center justify-center relative"><Settings size={22} /><span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-[#E30613] text-white text-[10px] leading-4">100</span></button>
        </div>
      </header>

      <main className="flex-1 p-6 flex gap-4 overflow-hidden">
        <aside className="w-[260px] rounded-2xl border border-[#D8DFEA] bg-white overflow-hidden">
          <div className="p-4 border-b border-[#E6EBF3]">
            <div className="text-[29px] font-semibold">脑部/颈部/螺旋</div>
            <div className="mt-3 flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#EFF3F8] text-[18px]">头部</span>
              <span className="px-3 py-1 rounded-lg bg-[#EFF3F8] text-[18px]">成人</span>
            </div>
            <div className="mt-3 bg-[#EAF2FF] border border-[#9CC2FF] rounded-xl px-3 py-2 text-[20px] text-[#1B63D5] font-medium">出了模板：您的修改仅对本次扫描生效。</div>
          </div>

          <div className="p-3 space-y-3 text-[29px]">
            <div className="bg-[#1E5BE5] text-white rounded-2xl px-4 py-4 flex items-center justify-between shadow">协议基本信息 <ChevronRight size={22} /></div>
            <div className="px-2 text-[20px] text-[#7C8AA6] flex justify-between"><span>采集队列</span><span className="text-[#1F2A44] flex items-center gap-1"><Plus size={18} />新增</span></div>
            <div className="bg-[#F4F5F7] rounded-xl p-3 text-[24px] text-[#34405B]">定位像</div>
            <div className="bg-[#F4F5F7] rounded-xl p-3 text-[30px] font-semibold text-[#34405B]">Acquisition 1</div>
            <div className="bg-[#F8F9FC] rounded-xl p-3 text-[24px] text-[#64748B]">锐组织</div>
            <div className="bg-[#F8F9FC] rounded-xl p-3 text-[24px] text-[#64748B]">骨骼</div>
            <div className="text-[#4D7FE0] text-[20px] px-2">+ 新增序列</div>
            <div className="bg-[#F8F9FC] rounded-xl p-3 flex justify-between">剂量 / 通知阈值 <ChevronRight size={20} className="text-[#9BA8C1]" /></div>
            <div className="bg-[#F8F9FC] rounded-xl p-3 flex justify-between">高级 <ChevronRight size={20} className="text-[#9BA8C1]" /></div>
          </div>
        </aside>

        <section className="flex-1 rounded-2xl border border-[#D8DFEA] bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E6EBF3]">
            <h2 className="text-[34px] font-semibold">协议基本信息</h2>
            <p className="text-[24px] text-[#61718D] mt-1">用于扫描模式筛选与协议继承（协议段字段）</p>
          </div>

          <div className="p-4 flex-1 overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 gap-3 text-[20px]">
              {[
                ["协议名称", "脑部/颈部/螺旋"],
                ["部位", "头部"],
                ["解剖区域（细分）", "脑部和颈椎"],
                ["体型范围（KG）", "50-90"],
                ["年龄", "成人"],
              ].map(([label, value], idx) => (
                <div key={label} className={idx === 4 ? "col-span-1" : ""}>
                  <div className="text-[#5E6C87] mb-1">{label}</div>
                  <div className="h-[42px] rounded-xl border border-[#D7DFEC] bg-[#F8FAFE] px-3 flex items-center justify-between font-medium">
                    <span>{value}</span>
                    {(label === "部位" || label === "年龄") && <ChevronRight size={18} className="rotate-90 text-[#7C8AA6]" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E6EBF3] flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between text-[24px] mb-2">
                <span className="font-medium text-[#3E4D68]">现搭预设：扫描体位</span>
                <span className="text-[#A1ACC0] text-[18px]">only one position can be set for protocol preset</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {positions.map((p) => (
                  <button
                    key={p.code}
                    className={`rounded-2xl border h-[74px] text-center ${p.active ? "bg-[#1F5DE6] text-white border-[#1F5DE6] shadow" : "bg-white text-[#25324C] border-[#DCE3EF]"}`}
                  >
                    <div className="text-[28px] font-semibold">{p.code}</div>
                    <div className={`text-[16px] ${p.active ? "text-white/80" : "text-[#9AA8BE]"}`}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-3">
              <button className="h-[44px] px-8 rounded-xl border border-[#D8DFEA] text-[30px] text-[#2D3A56]">取消</button>
              <button className="h-[44px] px-8 rounded-xl bg-[#1F5DE6] text-white text-[30px] shadow">保存并应用到会话</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
