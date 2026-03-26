import { useEffect, useState } from 'react';
import {
    ChevronLeft,
    Clock,
    Flame,
    LayoutGrid,
    Maximize2,
    Network,
    Pause,
    Play,
    RotateCcw,
    Settings,
    SlidersHorizontal,
    Siren,
    Sun,
    User,
} from 'lucide-react';

const PHASES = [
    { id: 'p0', label: 'Phase 0%', time: '0ms' },
    { id: 'p10', label: 'Phase 10%', time: '120ms' },
    { id: 'p20', label: 'Phase 20%', time: '240ms' },
    { id: 'p30', label: 'Phase 30%', time: '360ms' },
    { id: 'p40', label: 'Phase 40%', time: '480ms' },
    { id: 'p50', label: 'Phase 50%', time: '600ms' },
    { id: 'p60', label: 'Phase 60%', time: '720ms' },
    { id: 'p70', label: 'Phase 70%', time: '840ms' },
    { id: 'p80', label: 'Phase 80%', time: '960ms' },
    { id: 'p90', label: 'Phase 90%', time: '1080ms' },
];

export default function FourDViewScreen() {
    const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sliceIndex, setSliceIndex] = useState(60);
    const [ww, setWw] = useState(350);
    const [wl, setWl] = useState(40);

    useEffect(() => {
        if (!isPlaying) return;

        const timer = window.setInterval(() => {
            setCurrentPhaseIdx((prev) => (prev + 1) % PHASES.length);
        }, 200);

        return () => window.clearInterval(timer);
    }, [isPlaying]);

    return (
        <div className="flex flex-col h-full bg-[#EEF2F9] text-[#37474F] font-sans overflow-hidden">
            <header className="flex items-center justify-between px-4 h-[80px] bg-[#E8EAF1] border-b border-[#B0C4DE] shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 py-1.5 px-4 bg-[#DCE6F2] border border-[#B0C4DE] rounded-sm min-w-[210px]">
                        <div className="w-10 h-10 rounded-sm bg-[#4A6982] flex items-center justify-center text-white opacity-90">
                            <User size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] font-bold text-[#37474F]">Roky Zhang</span>
                            <span className="text-[12px] text-[#546E7A] font-medium leading-none mt-0.5">ID: 67890</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                        <div className="text-[9px] font-bold italic">⊥ 0</div>
                        <div className="text-[9px] font-bold">∠ 0</div>
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                            <Flame size={14} />
                            <span>0%</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">13:52</div>
                    <div className="text-[12px] text-[#546E7A] font-medium mt-1 uppercase opacity-80">2月26日 周四</div>
                </div>

                <div className="flex items-center gap-5 pr-2">
                    <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70">
                        <Siren size={30} strokeWidth={1.8} />
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Network size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">5</span>
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Sun size={24} />
                    </div>
                    <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                        <Settings size={24} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">10</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-0 p-2 flex gap-2">
                <aside className="w-[126px] bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-[#EEF2F9] flex flex-col items-center gap-2 shrink-0">
                        <button
                            onClick={() => setIsPlaying((v) => !v)}
                            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                                isPlaying ? 'bg-[#FF5252] text-white' : 'bg-[#4D94FF] text-white'
                            }`}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                        </button>
                        <span className="text-[9px] font-black text-[#90A4AE] uppercase tracking-widest">4D Playback</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {PHASES.map((phase, idx) => (
                            <button
                                key={phase.id}
                                onClick={() => {
                                    setCurrentPhaseIdx(idx);
                                    setIsPlaying(false);
                                }}
                                className={`w-full px-1 py-2 rounded-md border transition-colors flex flex-col items-center ${
                                    currentPhaseIdx === idx
                                        ? 'bg-[#E3F2FD] border-[#4D94FF] text-[#1E88E5]'
                                        : 'bg-[#F8FAFC] border-[#EEF2F9] text-[#78909C] hover:bg-white'
                                }`}
                            >
                                <span className="text-[11px] font-black">{phase.label}</span>
                                <span className="text-[9px] opacity-70 font-bold">{phase.time}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="flex-1 min-w-0 bg-white border border-[#B0C4DE] rounded-md shadow-sm overflow-hidden flex flex-col">
                    <div className="h-[36px] px-3 border-b border-[#EEF2F9] bg-[#F8FAFC] flex items-center justify-between shrink-0">
                        <div className="text-[10px] font-black text-[#546E7A] uppercase tracking-[0.15em]">MPR Viewer</div>
                        <div className="flex items-center gap-1 text-[#90A4AE]">
                            {[LayoutGrid, SlidersHorizontal, RotateCcw, Maximize2].map((Icon, idx) => (
                                <button
                                    key={idx}
                                    className="h-7 w-7 rounded-md border border-[#E3EAF3] bg-white hover:border-[#4D94FF]/50 hover:text-[#4D94FF] transition-colors flex items-center justify-center"
                                >
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 grid-rows-2 bg-[#B0C4DE] gap-px min-h-0">
                        <div className="relative bg-black overflow-hidden">
                            <div className="absolute top-2 left-3 text-[10px] font-black text-white/70 uppercase tracking-wider">Axial View</div>
                            <div className="w-full h-full flex items-center justify-center">
                                <img src="/dicom/test/SYNO0160.dcm" alt="axial slice" className="max-w-full max-h-full opacity-55 grayscale invert" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-[#4D94FF]/25 text-[112px] font-black">CT</span>
                                </div>
                            </div>
                            <div className="absolute left-3 bottom-2 text-[10px] text-white/55 font-mono leading-tight">
                                <div>WL: {wl} / WW: {ww}</div>
                                <div>Slice: {sliceIndex} / 120</div>
                            </div>
                            <div className="absolute right-3 bottom-2 text-[11px] font-black text-[#6DFF8D]">{PHASES[currentPhaseIdx].label}</div>
                        </div>

                        <div className="relative bg-[#0A0D14] overflow-hidden">
                            <div className="absolute top-2 left-3 text-[10px] font-black text-white/45 uppercase tracking-wide">Coronal Reconstruction</div>
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="w-[70%] h-px bg-[#4D94FF]/20" />
                            </div>
                        </div>

                        <div className="relative bg-[#0A0D14] overflow-hidden">
                            <div className="absolute top-2 left-3 text-[10px] font-black text-white/45 uppercase tracking-wide">Sagittal Reconstruction</div>
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="h-[70%] w-px bg-[#4D94FF]/20" />
                            </div>
                        </div>

                        <div className="bg-[#0A0D14] p-4 text-white/85">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock size={14} className="text-[#4D94FF]" />
                                <span className="text-[11px] font-black uppercase tracking-wider">Dynamic Analysis</span>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-md border border-white/10 bg-white/5">
                                    <div className="text-[10px] text-white/45 font-bold uppercase mb-1">Max Inhalation Depth</div>
                                    <div className="text-[24px] leading-none text-[#4D94FF] font-black">24.8 <span className="text-[12px]">mm</span></div>
                                </div>
                                <div className="p-3 rounded-md border border-white/10 bg-white/5">
                                    <div className="text-[10px] text-white/45 font-bold uppercase mb-1">Cycle Regularity</div>
                                    <div className="text-[24px] leading-none text-[#6DFF8D] font-black">98.2 <span className="text-[12px]">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="w-[290px] bg-white border border-[#B0C4DE] rounded-md shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[44px] px-4 bg-[#F8FAFC] border-b border-[#EEF2F9] flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-black text-[#37474F] uppercase tracking-wider">Observation Settings</span>
                        <span className="text-[10px] text-[#90A4AE]">Configure viewport & visualization</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#546E7A] uppercase tracking-wider">4D Phase Strip</span>
                                <span className="text-[10px] font-black text-[#1E88E5] bg-[#E3F2FD] px-2 py-1 rounded">{PHASES[currentPhaseIdx].label}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={PHASES.length - 1}
                                value={currentPhaseIdx}
                                onChange={(e) => {
                                    setCurrentPhaseIdx(parseInt(e.target.value, 10));
                                    setIsPlaying(false);
                                }}
                                className="w-full accent-[#4D94FF]"
                            />
                            <div className="flex justify-between text-[9px] font-bold text-[#90A4AE]">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#546E7A] uppercase tracking-wider">Slice Position</span>
                                <span className="text-[11px] font-black text-[#37474F]">{sliceIndex} / 120</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="119"
                                value={sliceIndex}
                                onChange={(e) => setSliceIndex(parseInt(e.target.value, 10))}
                                className="w-full accent-[#546E7A]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#90A4AE] uppercase tracking-wide">Window Width</label>
                                <div className="h-[40px] bg-[#F8FAFC] border border-[#B0C4DE] rounded-md px-3 flex items-center justify-between">
                                    <span className="text-[14px] font-black text-[#37474F]">{ww}</span>
                                    <div className="flex flex-col">
                                        <button onClick={() => setWw((v) => v + 10)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="rotate-90" /></button>
                                        <button onClick={() => setWw((v) => v - 10)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="-rotate-90" /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#90A4AE] uppercase tracking-wide">Window Level</label>
                                <div className="h-[40px] bg-[#F8FAFC] border border-[#B0C4DE] rounded-md px-3 flex items-center justify-between">
                                    <span className="text-[14px] font-black text-[#37474F]">{wl}</span>
                                    <div className="flex flex-col">
                                        <button onClick={() => setWl((v) => v + 5)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="rotate-90" /></button>
                                        <button onClick={() => setWl((v) => v - 5)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="-rotate-90" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E3EAF3] space-y-2 mt-2">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-[#90A4AE] font-black uppercase">Recon Matrix</span>
                                <span className="text-[#546E7A] font-black">512 x 512</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-[#90A4AE] font-black uppercase">Slice Thick</span>
                                <span className="text-[#546E7A] font-black">2.5 mm</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-[#90A4AE] font-black uppercase">Kernel</span>
                                <span className="text-[#546E7A] font-black">Soft Tissue</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
