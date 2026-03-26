import { useEffect, useMemo, useState } from 'react';
import {
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Columns2,
    Folder,
    Grid2x2,
    Hand,
    LayoutTemplate,
    Move,
    Pause,
    Play,
    RefreshCw,
    Ruler,
    Search,
    Settings,
    Sun,
    Trash2,
    User,
    Waves,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import DicomViewer from '../components/DicomViewer';

type SeriesId = '4d' | 'scout' | 'h1' | 'h2' | 'h3';
type LayoutId = 'single' | 'quad' | 'compare';
type ToolId = 'pan' | 'zoom' | 'zoomout' | 'measure' | 'fit' | 'reset';

const PHASES = [
    ['p0', 0, '0ms', '/dicom/test/SYNO0001.dcm'],
    ['p10', 10, '120ms', '/dicom/test/SYNO0033.dcm'],
    ['p20', 20, '240ms', '/dicom/test/SYNO0067.dcm'],
    ['p30', 30, '360ms', '/dicom/test/SYNO0100.dcm'],
    ['p40', 40, '480ms', '/dicom/test/SYNO0134.dcm'],
    ['p50', 50, '600ms', '/dicom/test/SYNO0168.dcm'],
    ['p60', 60, '720ms', '/dicom/test/SYNO0201.dcm'],
    ['p70', 70, '840ms', '/dicom/test/SYNO0235.dcm'],
    ['p80', 80, '960ms', '/dicom/test/SYNO0269.dcm'],
    ['p90', 90, '1080ms', '/dicom/test/SYNO0301.dcm'],
] as const;

const HELICAL: Record<Exclude<SeriesId, '4d'>, string> = {
    scout: '/dicom/test/SYNO0160.dcm',
    h1: '/dicom/test/SYNO0160.dcm',
    h2: '/dicom/test/SYNO0170.dcm',
    h3: '/dicom/test/SYNO0180.dcm',
};

const speeds = [0.5, 1, 2] as const;
const tools: Array<{ id: ToolId; icon: typeof Hand; label: string }> = [
    { id: 'pan', icon: Hand, label: '平移' },
    { id: 'zoom', icon: ZoomIn, label: '放大' },
    { id: 'zoomout', icon: ZoomOut, label: '缩小' },
    { id: 'measure', icon: Ruler, label: '测量' },
    { id: 'fit', icon: Move, label: '适配' },
    { id: 'reset', icon: RefreshCw, label: '重置' },
];

const cnDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日 ${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]}`;
const cnTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const LayoutButton = ({
    active, label, children, onClick,
}: { active: boolean; label: string; children: React.ReactNode; onClick: () => void }) => (
    <button
        className={`flex h-10 w-10 flex-col items-center justify-center rounded-[7px] border transition-all ${active ? 'border-[#1A6EE0] bg-[#E8F0FB]' : 'border-[#D8E2EE] hover:border-[#C2D0E2] hover:bg-[#EEF2F7]'}`}
        onClick={onClick}
        title={label}
    >
        {children}
    </button>
);

const ParamCard = ({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) => (
    <div className={`rounded-md border px-2 py-1.5 ${accent ? 'border-[#C5D8F8] bg-[#EEF5FF]' : 'border-[#D8E2EE] bg-[#F4F7FB]'}`}>
        <div className={`mb-1 text-[9px] uppercase tracking-[0.05em] ${accent ? 'text-[#1A6EE0]' : 'text-[#9AAABB]'}`}>{label}</div>
        <div className={`text-[12px] font-medium ${accent ? 'text-[#1A6EE0]' : 'text-[#1A2438]'}`}>{value}</div>
    </div>
);

export default function FourDViewScreen() {
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const slice = 60;
    const ww = 350;
    const wl = 40;
    const [speed, setSpeed] = useState<(typeof speeds)[number]>(1);
    const [layout, setLayout] = useState<LayoutId>('single');
    const [series, setSeries] = useState<SeriesId>('4d');
    const [tool, setTool] = useState<ToolId>('pan');
    const [now, setNow] = useState(() => new Date());
    const [studyOpen, setStudyOpen] = useState(true);
    const [helicalOpen, setHelicalOpen] = useState(true);
    const [phaseOpen, setPhaseOpen] = useState(true);

    const is4d = series === '4d';
    const phase = PHASES[phaseIdx];
    const viewerUrl = is4d ? phase[3] : HELICAL[series];
    const fillWidth = `${(phaseIdx / (PHASES.length - 1)) * 100}%`;
    const layoutGrid = layout === 'single' ? 'grid-cols-1 grid-rows-1' : layout === 'quad' ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2 grid-rows-1';

    useEffect(() => {
        const t = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(t);
    }, []);

    useEffect(() => {
        if (!playing || !is4d) return;
        const t = window.setInterval(() => setPhaseIdx((v) => (v + 1) % PHASES.length), 360 / speed);
        return () => window.clearInterval(t);
    }, [playing, is4d, speed]);

    useEffect(() => {
        if (!is4d) setPlaying(false);
    }, [is4d]);

    useEffect(() => {
        if (tool === 'fit' || tool === 'reset') {
            const t = window.setTimeout(() => setTool('pan'), 80);
            return () => window.clearTimeout(t);
        }
    }, [tool]);

    const treeRow = 'mx-1 my-px flex min-h-7 w-[calc(100%-8px)] items-center gap-[5px] rounded-md px-2 py-[5px] text-left transition-colors hover:bg-[#EEF2F7]';
    const phaseCount = useMemo(() => `${phaseIdx + 1}`, [phaseIdx]);

    return (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#edf2f8_45%,_#e4ebf4_100%)] p-3 text-[#1A2438]">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-[#dbe4ef] bg-[#f7f9fc] shadow-[0_20px_45px_rgba(31,45,61,0.14)]">
            <header className="relative flex h-[58px] shrink-0 items-center gap-3 border-b border-[#D8E2EE] bg-white/95 px-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1A6EE0]"><User size={18} /></div>
                    <div><div className="text-[13px] font-medium">放疗患者 张三</div><div className="text-[11px] text-[#5A6A80]">ID: TH-20240309-001</div></div>
                </div>
                <div className="ml-1 font-mono text-[11px] leading-[1.8] text-[#9AAABB]">
                    <div>0</div><div>0</div><div className="flex items-center gap-1"><Waves size={12} /><span>0%</span></div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <div className="font-mono text-[24px] font-light leading-none tracking-[2px]">{cnTime(now)}</div>
                    <div className="text-[11px] text-[#5A6A80]">{cnDate(now)}</div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[#E8404A] hover:bg-[#EEF2F7]"><Bell size={15} /></button>
                    <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[#5A6A80] hover:bg-[#EEF2F7]"><span className="absolute right-[3px] top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#1A6EE0] text-[9px] text-white">5</span></button>
                    <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[#5A6A80] hover:bg-[#EEF2F7]"><Sun size={15} /></button>
                    <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[#5A6A80] hover:bg-[#EEF2F7]"><Settings size={15} /><span className="absolute right-[3px] top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#1A6EE0] text-[9px] text-white">10</span></button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden p-2.5">
                <aside className="flex w-[224px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-[#dbe4ef] bg-white shadow-[0_10px_26px_rgba(31,45,61,0.06)]">
                    <div className="flex h-10 shrink-0 items-center gap-0.5 border-b border-[#D8E2EE] bg-[#F6F9FC] px-2.5">
                        <button className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#5A6A80] hover:bg-[#D8E2EE]"><Folder size={12} /></button>
                        <button className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#5A6A80] hover:bg-[#D8E2EE]"><LayoutTemplate size={12} /></button>
                        <button className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#5A6A80] hover:bg-[#D8E2EE]"><Trash2 size={12} /></button>
                        <button className="ml-auto flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#5A6A80] hover:bg-[#D8E2EE]"><Search size={12} /></button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto py-2">
                        <button className={treeRow} onClick={() => setStudyOpen((v) => !v)}>
                            <ChevronRight size={11} className={`text-[#9AAABB] transition-transform ${studyOpen ? 'rotate-90' : ''}`} />
                            <Waves size={12} className="text-[#1A6EE0]" />
                            <div className="min-w-0 flex-1"><div className="truncate text-[12px]">THORAX CT</div><div className="text-[10px] text-[#9AAABB]">2024-03-09</div></div>
                        </button>

                        {studyOpen && <div className="pl-3.5">
                            <button className={`${treeRow} ${series === 'scout' ? 'bg-[#E8F0FB]' : ''}`} onClick={() => setSeries('scout')}><span className="w-[11px]" /><span className="w-4" /><span className="truncate text-[12px]">Scout</span></button>

                            <button className={treeRow} onClick={() => setHelicalOpen((v) => !v)}>
                                <ChevronRight size={11} className={`text-[#9AAABB] transition-transform ${helicalOpen ? 'rotate-90' : ''}`} />
                                <Folder size={12} className="text-[#5A6A80]" />
                                <span className="truncate text-[12px]">Helical Scan</span>
                            </button>
                            {helicalOpen && <div className="pl-3.5">
                                {(['h1', 'h2', 'h3'] as const).map((id, i) => (
                                    <button key={id} className={`${treeRow} ${series === id ? 'bg-[#E8F0FB]' : ''}`} onClick={() => setSeries(id)}>
                                        <span className="w-[11px]" /><span className="w-4" />
                                        <span className="truncate text-[11px]">1-1-{i + 1}{i === 0 && <span className="ml-1.5 text-[10px] text-[#9AAABB]">118张</span>}</span>
                                    </button>
                                ))}
                            </div>}

                            <div className={`mx-1 my-px rounded-md ${series === '4d' ? 'bg-[#E8F0FB]' : 'hover:bg-[#EEF2F7]'}`}>
                                <div className="flex items-center gap-[5px] px-2 py-[5px]">
                                    <button className="flex w-[11px] items-center justify-center" onClick={() => setPhaseOpen((v) => !v)}><ChevronRight size={11} className={`text-[#1A6EE0] transition-transform ${phaseOpen ? 'rotate-90' : ''}`} /></button>
                                    <button className="flex min-w-0 flex-1 items-center gap-[5px] text-left" onClick={() => setSeries('4d')}>
                                        <Waves size={12} className="shrink-0 text-[#1A6EE0]" />
                                        <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-medium text-[#1A6EE0]">4D Free Scan</div><div className="text-[10px] text-[#5A6A80]">10 phases Phase-based</div></div>
                                        <span className="rounded bg-[#1A6EE0] px-1.5 py-px font-mono text-[9px] text-white">4D</span>
                                    </button>
                                </div>
                                {phaseOpen && <div className="pl-3.5 pb-1">
                                    {PHASES.map((p, idx) => {
                                        const active = idx === phaseIdx && is4d;
                                        return (
                                            <button key={p[0]} className={`mx-1 my-px flex w-[calc(100%-8px)] items-center gap-1.5 rounded-md px-2 py-[5px] text-left ${active ? 'bg-[#E8F0FB]' : 'hover:bg-[#EEF2F7]'}`} onClick={() => { setSeries('4d'); setPhaseIdx(idx); setPlaying(false); }}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[#1A6EE0]' : 'bg-[#C2D0E2]'}`} />
                                                <span className={`text-[12px] ${active ? 'font-medium text-[#1A6EE0]' : ''}`}>Phase {p[1]}%</span>
                                                <span className="ml-auto font-mono text-[10px] text-[#9AAABB]">{p[2]}</span>
                                            </button>
                                        );
                                    })}
                                </div>}
                            </div>
                        </div>}
                    </div>

                    <div className="mx-3 my-1.5 h-px bg-[#D8E2EE]" />
                    <div className="px-3.5 pt-1 text-[10px] uppercase tracking-[0.08em] text-[#9AAABB]">布局模版</div>
                    <div className="flex gap-2 px-3.5 py-2">
                        <LayoutButton active={layout === 'single'} label="CT 平片" onClick={() => setLayout('single')}><LayoutTemplate size={14} className={layout === 'single' ? 'text-[#1A6EE0]' : 'text-[#C2D0E2]'} /></LayoutButton>
                        <LayoutButton active={layout === 'quad'} label="四分屏" onClick={() => setLayout('quad')}><Grid2x2 size={14} className={layout === 'quad' ? 'text-[#1A6EE0]' : 'text-[#C2D0E2]'} /></LayoutButton>
                        <LayoutButton active={layout === 'compare'} label="对比" onClick={() => setLayout('compare')}><Columns2 size={14} className={layout === 'compare' ? 'text-[#1A6EE0]' : 'text-[#C2D0E2]'} /></LayoutButton>
                    </div>
                    <div className="flex gap-2 px-3.5 pb-3 text-[9px] text-[#5A6A80]"><span className="w-10 text-center">CT 平片</span><span className="w-10 text-center">四分屏</span><span className="w-10 text-center">对比</span></div>

                    <div className="mx-3 my-1.5 h-px bg-[#D8E2EE]" />
                    <div className="px-3.5 pt-1 text-[10px] uppercase tracking-[0.08em] text-[#9AAABB]">图像参数</div>
                    <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
                        <ParamCard label="图框" value={<div className="flex items-center justify-between text-[11px]"><span>肺窗</span><ChevronDown size={12} /></div>} />
                        <ParamCard label="层厚" value="3.0 mm" />
                        <ParamCard label="窗位" value={wl} />
                        <ParamCard label="窗宽" value={ww} />
                        {is4d && <><ParamCard label="相位数" value="10" accent /><ParamCard label="排序" value="Phase-based" accent /></>}
                    </div>
                </aside>

                <main className="ml-2.5 flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div className="flex min-h-0 flex-1 overflow-hidden gap-2.5">
                        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-[#101a24] bg-[#050b11] shadow-[0_14px_32px_rgba(5,11,17,0.24)]">
                            <div className={`grid min-h-0 flex-1 ${layoutGrid} bg-black`}>
                                <div className="relative min-h-0 overflow-hidden bg-black">
                                    <DicomViewer dicomUrl={viewerUrl} activeTool={tool} windowCenter={wl} windowWidth={ww} />
                                    <div className="pointer-events-none absolute left-1/2 top-[10px] -translate-x-1/2 font-mono text-[11px] text-white/20">A</div>
                                    <div className="pointer-events-none absolute bottom-[68px] left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/20">P</div>
                                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-white/20">L</div>
                                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-white/20">R</div>
                                    <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/20 px-2 py-1 font-mono text-[11px] leading-[1.65] text-white/78 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"><div>Patient ID</div><div>2024-03-09</div><div>HFS</div></div>
                                    <div className="pointer-events-none absolute right-3 top-2.5 text-right font-mono text-[11px] leading-[1.65] text-white/75 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                                        <div className="rounded-md bg-black/20 px-2 py-1.5">
                                            <div>鑫定人民医院</div><div>STN-CT CT</div><div>张三</div>{is4d && <span className="mt-1 inline-block rounded bg-[rgba(26,110,224,0.88)] px-2 py-0.5 text-[11px] text-white">Phase {phase[1]}%</span>}
                                        </div>
                                    </div>
                                    <div className="pointer-events-none absolute bottom-[76px] left-3 rounded-md bg-black/20 px-2 py-1 font-mono text-[11px] leading-[1.65] text-white/78 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"><div>T: mm</div><div>120kV 200mA</div><div>FOV: 500</div></div>
                                    <div className="pointer-events-none absolute bottom-[76px] right-3 rounded-md bg-black/20 px-2 py-1 text-right font-mono text-[11px] leading-[1.65] text-white/78 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"><div>Zoom: 1.0</div><div>Image: {slice}/120</div><div>WW: {ww} WL: {wl}</div></div>
                                </div>

                                {layout !== 'single' && <>
                                    <div className={`relative min-h-0 overflow-hidden bg-[#06090e] ${layout === 'compare' ? '' : 'border-b border-black'}`}><div className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-white/55">Coronal</div><div className="flex h-full items-center justify-center"><div className="h-px w-[68%] bg-[#1A6EE0]/20" /></div></div>
                                    {layout === 'quad' && <>
                                        <div className="relative min-h-0 overflow-hidden bg-[#06090e]"><div className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-white/55">Sagittal</div><div className="flex h-full items-center justify-center"><div className="h-[68%] w-px bg-[#1A6EE0]/20" /></div></div>
                                        <div className="min-h-0 overflow-hidden bg-[linear-gradient(180deg,#08111a_0%,#06090e_100%)] p-4 text-white/85"><div className="mb-3 flex items-center gap-2"><Waves size={14} className="text-[#1A6EE0]" /><span className="text-[11px] uppercase tracking-[0.15em]">Dynamic Analysis</span></div><div className="space-y-3"><div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="mb-1 text-[10px] uppercase text-white/45">Max Inhalation Depth</div><div className="text-[24px] font-semibold leading-none text-[#1A6EE0]">24.8 <span className="text-[12px]">mm</span></div></div><div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="mb-1 text-[10px] uppercase text-white/45">Cycle Regularity</div><div className="text-[24px] font-semibold leading-none text-[#9BE38C]">98.2 <span className="text-[12px]">%</span></div></div></div></div>
                                    </>}
                                </>}
                            </div>

                            {is4d && <div className="flex h-[68px] shrink-0 items-center gap-3 border-t border-[#dbe4ef] bg-white px-4 shadow-[0_-1px_4px_rgba(0,0,0,0.04)]">
                                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A6EE0] text-white shadow-[0_10px_20px_rgba(26,110,224,0.3)] hover:scale-[1.06] hover:bg-[#1558c0]" onClick={() => setPlaying((v) => !v)}>{playing ? <Pause size={14} /> : <Play size={14} className="translate-x-px" />}</button>
                                <div className="flex gap-1.5">{speeds.map((v) => <button key={v} className={`rounded-md border px-2.5 py-1 font-mono text-[11px] ${speed === v ? 'border-[#1A6EE0] bg-[#E8F0FB] text-[#1A6EE0]' : 'border-[#C2D0E2] text-[#5A6A80] hover:border-[#1A6EE0] hover:text-[#1A6EE0]'}`} onClick={() => setSpeed(v)}>{v}</button>)}</div>
                                <div className="relative flex h-12 flex-1 items-center px-1">
                                    <div className="absolute left-1 right-1 top-1/2 h-0.5 -translate-y-1/2 rounded bg-[#D8E2EE]" />
                                    <div className="absolute left-1 top-1/2 h-0.5 -translate-y-1/2 rounded bg-[#1A6EE0]" style={{ width: `calc(${fillWidth} - 2px)` }} />
                                    <div className="absolute left-1 right-1 flex items-center justify-between">
                                        {PHASES.map((p, idx) => {
                                            const active = idx === phaseIdx;
                                            return <button key={p[0]} className={`relative flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] font-mono text-[9px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${active ? 'z-10 scale-[1.18] border-[#1A6EE0] bg-[#1A6EE0] text-white shadow-[0_2px_10px_rgba(26,110,224,0.36)]' : 'border-[#C2D0E2] bg-white text-[#9AAABB] hover:border-[#1A6EE0] hover:bg-[#E8F0FB] hover:text-[#1A6EE0]'}`} onClick={() => { setPhaseIdx(idx); setPlaying(false); }}>{p[1]}<span className={`absolute -bottom-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] ${active ? 'text-[#1A6EE0]' : 'text-[#9AAABB]'}`}>{p[1]}%</span></button>;
                                        })}
                                    </div>
                                </div>
                                <div className="min-w-[60px] text-right font-mono text-[12px] text-[#5A6A80]"><b className="font-semibold text-[#1A6EE0]">{phaseCount}</b> / 10</div>
                            </div>}
                        </section>

                        <aside className="flex w-[50px] shrink-0 flex-col items-center gap-1 rounded-[16px] bg-[#223242] px-0 py-2.5 shadow-[0_12px_28px_rgba(23,34,46,0.22)]">
                            <div className="mb-2 text-[8px] uppercase tracking-[0.1em] text-white/35 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">TOOLS</div>
                            {tools.map((item, idx) => {
                                const Icon = item.icon;
                                const active = tool === item.id;
                                return (
                                    <div key={item.id} className="contents">
                                        {idx === 4 && <div className="my-1 h-px w-6 bg-white/10" />}
                                        <button className={`flex h-9 w-9 items-center justify-center rounded-[10px] transition-all ${active ? 'bg-[#1A6EE0] text-white shadow-[0_8px_18px_rgba(26,110,224,0.35)]' : 'text-white/50 hover:bg-white/10 hover:text-white'}`} title={item.label} onClick={() => setTool(item.id)}>
                                            <Icon size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </aside>
                    </div>
                </main>
            </div>

            <footer className="flex h-[54px] shrink-0 items-center gap-2 border-t border-[#D8E2EE] bg-white/95 px-4">
                <button className="flex h-9 items-center gap-1 rounded-lg border border-[#C2D0E2] px-3.5 text-[12px] text-[#5A6A80] hover:border-[#1A6EE0] hover:text-[#1A6EE0]"><ChevronLeft size={14} />高级处理</button>
                <button className="flex h-9 items-center gap-1 rounded-lg border border-[#C2D0E2] px-3.5 text-[12px] text-[#5A6A80] hover:border-[#1A6EE0] hover:text-[#1A6EE0]">图像处理</button>
                <div className="ml-2 text-[11px] text-[#9AAABB]">扫描模式：<span className="font-medium text-[#1A6EE0]">4D CT 自由扫描</span></div>
                <button className="ml-auto flex h-9 items-center gap-1 rounded-lg border border-[#C2D0E2] px-3.5 text-[12px] text-[#5A6A80] hover:border-[#1A6EE0] hover:text-[#1A6EE0]"><ChevronLeft size={14} />上一步</button>
                <button className="flex h-9 items-center gap-1 rounded-lg bg-[#1A6EE0] px-5 text-[12px] text-white shadow-[0_10px_20px_rgba(26,110,224,0.28)] hover:bg-[#1558c0]">结束检查<ChevronRight size={14} /></button>
            </footer>
            </div>
        </div>
    );
}
