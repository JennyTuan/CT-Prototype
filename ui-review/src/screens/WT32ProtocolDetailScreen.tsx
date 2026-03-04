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
    <div className="w-[1024px] h-[768px] bg-[#ECEEF2] border border-[#D4DBE6] rounded-[8px] overflow-hidden text-[#1F2A44] font-sans flex flex-col select-none">
      <header className="h-[92px] bg-[#F2F4F8] border-b border-[#D6DEE9] px-[18px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[14px]">
          <div className="h-[58px] min-w-[170px] rounded-[14px] border border-[#DEE4ED] bg-white px-[12px] flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-[#1E6ED8] text-white flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <div className="text-[16px] leading-[1.05] font-semibold">张三</div>
              <div className="text-[13px] leading-none text-[#8492AA] mt-[4px]">ID: 20260226</div>
            </div>
          </div>

          <div className="text-[#1D62D7] text-[12px] font-semibold leading-[1.15] space-y-[3px]">
            <div className="flex items-center gap-[6px]"><Ruler size={11} />60 MM</div>
            <div className="flex items-center gap-[6px]"><CircleDashed size={11} />3.0°</div>
            <div className="flex items-center gap-[6px]"><Thermometer size={11} />60%</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[50px] leading-none font-bold text-[#172D57]">10:52</div>
          <div className="text-[18px] font-semibold text-[#415D8A] mt-[2px]">3月4日 周三</div>
        </div>

        <div className="flex items-center gap-[8px] text-[#506484]">
          <button className="w-[40px] h-[40px] rounded-[11px] border border-[#D4DDEA] bg-[#F6F8FC] flex items-center justify-center text-[#E64C4C]">
            <Cross size={22} />
          </button>
          <button className="w-[40px] h-[40px] rounded-[11px] border border-[#D4DDEA] bg-[#F6F8FC] flex items-center justify-center relative">
            <Bell size={20} />
            <span className="absolute -top-[4px] -right-[4px] min-w-[16px] h-[16px] px-[3px] bg-[#E10016] text-white text-[10px] rounded-full leading-[16px] text-center font-semibold">9</span>
          </button>
          <button className="w-[40px] h-[40px] rounded-[11px] border border-[#D4DDEA] bg-[#F6F8FC] flex items-center justify-center">
            <Lightbulb size={20} />
          </button>
          <button className="w-[40px] h-[40px] rounded-[11px] border border-[#D4DDEA] bg-[#F6F8FC] flex items-center justify-center relative">
            <Settings size={20} />
            <span className="absolute -top-[4px] -right-[8px] min-w-[22px] h-[16px] px-[3px] bg-[#E10016] text-white text-[10px] rounded-full leading-[16px] text-center font-semibold">100</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-[12px] flex gap-[12px] overflow-hidden">
        <aside className="w-[260px] rounded-[16px] border border-[#D4DDEA] bg-white overflow-hidden flex flex-col">
          <div className="p-[14px] border-b border-[#E5EAF1]">
            <div className="text-[16px] font-semibold leading-[1.2] whitespace-nowrap overflow-hidden text-ellipsis">脑部/颈部/螺旋</div>
            <div className="mt-[8px] flex gap-[8px] text-[13px]">
              <span className="px-[10px] py-[4px] rounded-[10px] bg-[#EEF2F7] text-[#344563]">头部</span>
              <span className="px-[10px] py-[4px] rounded-[10px] bg-[#EEF2F7] text-[#344563]">成人</span>
            </div>
            <div className="mt-[10px] px-[12px] py-[8px] rounded-[10px] border border-[#99BFFF] bg-[#EAF2FF] text-[#1F62D8] text-[14px] leading-[1.35]">
              出了模板：您的修改仅对本次扫描生效。
            </div>
          </div>

          <div className="p-[10px] space-y-[10px]">
            <div className="h-[40px] rounded-[14px] bg-[#1E5BE5] text-white px-[14px] flex items-center justify-between text-[18px] font-semibold shadow-[0_4px_12px_rgba(31,93,230,0.25)]">
              协议基本信息
              <ChevronRight size={18} />
            </div>

            <div className="px-[8px] flex items-center justify-between text-[13px]">
              <span className="text-[#7A8AA6]">采集队列</span>
              <span className="text-[#1F2A44] flex items-center gap-[4px]"><Plus size={15} />新增</span>
            </div>

            <div className="h-[38px] rounded-[12px] bg-[#F3F5F8] px-[14px] flex items-center justify-between text-[16px] text-[#2D3E5C]">
              <span>定位像</span>
              <span className="text-[12px] text-[#8E9BB1]">定位像</span>
            </div>

            <div className="h-[40px] rounded-[12px] bg-[#F3F5F8] px-[14px] flex items-center justify-between">
              <span className="text-[20px] font-semibold text-[#2E3C57]">Acquisition 1</span>
              <span className="text-[12px] text-[#8E9BB1] underline">螺旋扫描</span>
            </div>

            <div className="h-[38px] rounded-[12px] bg-[#F8FAFC] px-[14px] flex items-center text-[14px] text-[#6B7A95]">锐组织</div>
            <div className="h-[38px] rounded-[12px] bg-[#F8FAFC] px-[14px] flex items-center text-[14px] text-[#6B7A95]">骨骼</div>
            <div className="px-[8px] text-[12px] text-[#4A80E2]">+ 新增序列</div>

            <div className="h-[38px] rounded-[12px] bg-[#F8FAFC] px-[14px] flex items-center justify-between text-[14px] text-[#2F3B54]">
              剂量 / 通知阈值 <ChevronRight size={16} className="text-[#9DABBF]" />
            </div>
            <div className="h-[38px] rounded-[12px] bg-[#F8FAFC] px-[14px] flex items-center justify-between text-[14px] text-[#2F3B54]">
              高级 <ChevronRight size={16} className="text-[#9DABBF]" />
            </div>
          </div>
        </aside>

        <section className="flex-1 rounded-[16px] border border-[#D4DDEA] bg-white overflow-hidden flex flex-col">
          <div className="px-[18px] py-[14px] border-b border-[#E5EAF1]">
            <h2 className="text-[20px] leading-none font-semibold text-[#152B54]">协议基本信息</h2>
            <p className="text-[14px] text-[#607193] mt-[8px]">用于扫描模式筛选与协议继承（协议段字段）</p>
          </div>

          <div className="p-[16px] flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-2 gap-x-[14px] gap-y-[10px]">
              <div>
                <div className="text-[13px] text-[#5D6D89] mb-[5px]">协议名称</div>
                <div className="h-[36px] rounded-[10px] border border-[#D5DEEA] bg-[#F7F9FD] px-[12px] flex items-center text-[14px]">脑部/颈部/螺旋</div>
              </div>
              <div>
                <div className="text-[13px] text-[#5D6D89] mb-[5px]">部位</div>
                <div className="h-[36px] rounded-[10px] border border-[#D5DEEA] bg-[#F7F9FD] px-[12px] flex items-center justify-between text-[14px]">
                  头部 <ChevronDown size={16} className="text-[#7988A5]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#5D6D89] mb-[5px]">解剖区域（细分）</div>
                <div className="h-[36px] rounded-[10px] border border-[#D5DEEA] bg-[#F7F9FD] px-[12px] flex items-center text-[14px]">脑部和颈椎</div>
              </div>
              <div>
                <div className="text-[13px] text-[#5D6D89] mb-[5px]">体型范围（KG）</div>
                <div className="h-[36px] rounded-[10px] border border-[#D5DEEA] bg-[#F7F9FD] px-[12px] flex items-center text-[14px]">50-90</div>
              </div>
              <div>
                <div className="text-[13px] text-[#5D6D89] mb-[5px]">年龄</div>
                <div className="h-[36px] rounded-[10px] border border-[#D5DEEA] bg-[#F7F9FD] px-[12px] flex items-center justify-between text-[14px]">
                  成人 <ChevronDown size={16} className="text-[#7988A5]" />
                </div>
              </div>
            </div>

            <div className="mt-[16px] pt-[14px] border-t border-[#E5EAF1] flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-[10px]">
                <div className="text-[18px] text-[#233457]">
                  <span className="font-semibold">现搭预设：</span>
                  <span className="ml-[8px]">扫描体位</span>
                </div>
                <div className="text-[13px] text-[#99A6BB]">only one position can be set for protocol preset</div>
              </div>

              <div className="grid grid-cols-4 gap-[10px]">
                {positions.map((item) => (
                  <button
                    key={item.code}
                    className={`h-[62px] rounded-[12px] border text-center ${
                      item.active
                        ? "bg-[#1F5DE6] border-[#1F5DE6] text-white shadow-[0_4px_12px_rgba(31,93,230,0.3)]"
                        : "bg-white border-[#D7DEEA] text-[#223553]"
                    }`}
                  >
                    <div className="text-[17px] font-semibold leading-none mt-[9px]">{item.code}</div>
                    <div className={`text-[11px] mt-[6px] ${item.active ? "text-white/80" : "text-[#8B9AB2]"}`}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-[12px] flex justify-end gap-[10px]">
              <button className="h-[42px] px-[20px] rounded-[10px] border border-[#D4DCEA] bg-[#F9FAFC] text-[#2E3B57] text-[20px]">取消</button>
              <button className="h-[42px] px-[20px] rounded-[10px] bg-[#1F5DE6] text-white text-[20px] shadow-[0_4px_12px_rgba(31,93,230,0.3)]">保存并应用到会话</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
