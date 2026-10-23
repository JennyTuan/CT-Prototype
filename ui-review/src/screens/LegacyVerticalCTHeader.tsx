type Props = {
    mode?: "horizontal" | "vertical";
    className?: string;
    time?: Date;
};

// Reuse supplied artwork; only the larger position reference is scaled to fit.
function ReferenceIcon({ x, y, width, height, source = "vertical-header-reference", scale = 1 }: {
    x: number; y: number; width: number; height: number;
    source?: "vertical-header-reference" | "horizontal-position-reference" | "vertical-position-reference";
    scale?: number;
}) {
    return <span aria-hidden="true" className="block shrink-0 bg-no-repeat" style={{
        width: width * scale, height: height * scale,
        backgroundImage: `url(/status-bar/${source}.png)`,
        backgroundPosition: `-${x * scale}px -${y * scale}px`,
        backgroundSize: source === "vertical-position-reference" ? `${598 * scale}px ${489 * scale}px` : undefined,
    }} />;
}

// Fixed reference values for the design-review prototype.
export default function LegacyVerticalCTHeader({ mode = "vertical", className = "", time }: Props) {
    const horizontal = mode === "horizontal";
    return <header aria-label="设备顶部状态栏（模拟）" className={`relative h-[80px] w-full shrink-0 bg-[#C9D0DA] font-[Arial,'Microsoft_YaHei',sans-serif] text-[#67758A] ${className}`}>
        <div className="absolute left-[24px] top-[5px] flex h-[58px] w-[153px] items-center rounded-[4px] border border-[#99B5DB] bg-[#D2D9E3] px-3">
            <ReferenceIcon x={37} y={13} width={39} height={40} />
            <div className="ml-2 flex-1 text-center"><div className="text-[21px] font-bold leading-7 text-[#233C65]">admin</div><div className="mt-1 h-[7px] rounded-full border border-[#76968B] bg-[#A4D98B]" /></div>
        </div>
        <div className="absolute left-[198px] top-[1px] text-center"><div className="text-[44px] font-bold leading-[44px] tracking-[-1px]">{time ? `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}` : "13:07"}</div><div className="text-[15px] font-semibold leading-[18px]">{time ? `${time.getMonth() + 1}月${time.getDate()}日` : "3月9日 周日"}</div></div>
        <div className="absolute left-[324px] top-[5px] w-[108px] text-[15px] font-semibold leading-[20px]"><div>急诊患者</div><div>ID:00058</div><div className="truncate">身高：170cm...</div></div>
        <div className="absolute left-[493px] top-[11px] flex flex-col items-center"><ReferenceIcon x={497} y={11} width={31} height={26} /><span className="text-[19px] font-bold leading-5 text-[#152B42]">急诊</span></div>
        <div aria-label="设备状态示意" className="absolute left-[630px] top-[19px] flex items-center gap-[14px]">
            {[630, 674, 718, 762, 806].map((x) => <ReferenceIcon key={x} x={x} y={19} width={30} height={29} />)}
        </div>
        <div className="absolute left-[840px] top-0 flex h-[66px] w-[88px] flex-col items-center border-x border-[#9DA7B9]">
            <div role="img" aria-label="温度状态 0%（模拟）"><ReferenceIcon x={852} y={0} width={64} height={34} /></div>
            <div role="img" aria-label="电池电量 100%（模拟）"><ReferenceIcon x={860} y={36} width={50} height={28} /></div>
        </div>
        <div aria-label={horizontal ? "水平模式位置数据（模拟）" : "垂直模式位置数据（模拟）"} className="absolute left-[936px] top-0 flex h-[70px] w-[88px] flex-col bg-[#C8CEDC] text-[14px] font-semibold text-[#1B2A3A]">
            <div className="flex h-[35px] items-center gap-[2px]">
                <span className="flex w-[34px] shrink-0 justify-center">
                    {horizontal ? <ReferenceIcon source="horizontal-position-reference" x={0} y={0} width={34} height={35} /> : <ReferenceIcon source="vertical-position-reference" x={80} y={32} width={178} height={186} scale={0.16} />}
                </span>
                <span className="whitespace-nowrap">{horizontal ? "−12°" : <>112 <span className="text-[11px] font-normal">mm</span></>}</span>
            </div>
            <div className="flex h-[34px] items-center gap-[2px]">
                <span className="flex w-[34px] shrink-0 justify-center">
                    {horizontal ? <ReferenceIcon source="horizontal-position-reference" x={0} y={35} width={34} height={34} /> : <ReferenceIcon source="vertical-position-reference" x={85} y={268} width={168} height={194} scale={0.16} />}
                </span>
                <span className="whitespace-nowrap">{horizontal ? "−12°" : <>112 <span className="text-[11px] font-normal">mm</span></>}</span>
            </div>
        </div>
    </header>;
}
