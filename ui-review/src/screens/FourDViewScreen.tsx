import { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Play, 
    Pause, 
    ChevronLeft, 
    ChevronRight, 
    Maximize2, 
    RotateCcw, 
    SlidersHorizontal,
    LayoutGrid,
    Settings,
    User,
    Clock,
    Activity
} from 'lucide-react';
import * as dicomParser from 'dicom-parser';

// Mock Phase Data
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
    const [layout, setLayout] = useState<'single' | 'mpr'>('mpr');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const playbackTimerRef = useRef<number | null>(null);

    // Playback Logic
    useEffect(() => {
        if (isPlaying) {
            playbackTimerRef.current = window.setInterval(() => {
                setCurrentPhaseIdx(prev => (prev + 1) % PHASES.length);
            }, 150); // ~6.6 FPS for 4D cine
        } else {
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
        }
        return () => {
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
        };
    }, [isPlaying]);

    return (
        <div className="flex flex-col h-full bg-[#EEF2F9] text-[#37474F] font-sans overflow-hidden">
            {/* 1. Header Area - Consistent with WT32 */}
            <header className="h-[64px] bg-white border-b border-[#D1D9E1] flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#4D94FF]">
                            <User size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold">Roky Zhang</span>
                            <span className="text-[11px] text-[#90A4AE]">ID: 67890 · Male · 45Y</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#546E7A]">4D CT Thorax Analysis</span>
                        <span className="text-[10px] text-[#4CAF50] font-bold uppercase tracking-wider">Series: 4D_Gated_Lung</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] rounded-lg border border-[#C8E6C9] text-[#2E7D32]">
                        <Activity size={14} />
                        <span className="text-[11px] font-bold uppercase">Steady Signal</span>
                    </div>
                    <button className="p-2 text-[#90A4AE] hover:text-[#4D94FF] transition-colors">
                        <Settings size={20} />
                    </button>
                    <button className="h-9 px-4 bg-[#FF5252] text-white text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                        CLOSE
                    </button>
                </div>
            </header>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left: Phase List / Navigation (Vertical Strip) */}
                <aside className="w-[120px] bg-white border-r border-[#D1D9E1] flex flex-col shrink-0">
                    <div className="p-3 border-b border-[#F1F5F9] flex flex-col items-center gap-1">
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#FF5252] text-white' : 'bg-[#4D94FF] text-white shadow-lg'}`}
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <span className="text-[9px] font-bold text-[#90A4AE] uppercase tracking-tighter mt-1">4D Playback</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {PHASES.map((phase, idx) => (
                            <button
                                key={phase.id}
                                onClick={() => { setCurrentPhaseIdx(idx); setIsPlaying(false); }}
                                className={`w-full py-2.5 rounded-xl border transition-all flex flex-col items-center gap-0.5 ${
                                    currentPhaseIdx === idx 
                                    ? 'bg-[#E3F2FD] border-[#4D94FF] text-[#1976D2] shadow-sm' 
                                    : 'bg-white border-transparent text-[#90A4AE] hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-[11px] font-black">{phase.label}</span>
                                <span className="text-[9px] font-medium opacity-60">{phase.time}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Center: MPR Viewer Area */}
                <main className="flex-1 flex flex-col bg-[#050A19] relative overflow-hidden">
                    {/* Floating Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 z-10">
                        <button className="p-2 text-white/60 hover:text-white transition-colors"><LayoutGrid size={16} /></button>
                        <button className="p-2 text-white/60 hover:text-white transition-colors"><SlidersHorizontal size={16} /></button>
                        <button className="p-2 text-white/60 hover:text-white transition-colors"><RotateCcw size={16} /></button>
                        <div className="w-px h-4 bg-white/10 mx-1"></div>
                        <button className="p-2 text-white/60 hover:text-white transition-colors"><Maximize2 size={16} /></button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-px bg-[#1A2642]">
                        {/* Axial Panel */}
                        <div className="relative bg-black group overflow-hidden">
                            <div className="absolute top-3 left-4 text-[11px] font-bold text-white/70 tracking-widest uppercase z-10">Axial View</div>
                            <div className="w-full h-full flex items-center justify-center">
                                <img src="/dicom/test/SYNO0160.dcm" alt="axial slice" className="max-w-full max-h-full opacity-60 grayscale filter invert" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-[#4D94FF]/20 font-black text-[120px] select-none pointer-events-none">CT</div>
                                </div>
                            </div>
                            {/* Overlay Info */}
                            <div className="absolute bottom-3 left-4 flex flex-col gap-0.5 text-[10px] text-white/40 font-mono">
                                <div>WL: {wl} / WW: {ww}</div>
                                <div>Slice: {sliceIndex} / 120</div>
                            </div>
                            <div className="absolute bottom-3 right-4 text-[12px] font-black text-[#4CAF50] z-10">
                                {PHASES[currentPhaseIdx].label}
                            </div>
                        </div>

                        {/* Coronal Panel */}
                        <div className="relative bg-black overflow-hidden border-l border-[#1A2642]">
                            <div className="absolute top-3 left-4 text-[11px] font-bold text-white/40 z-10 uppercase">Coronal Reconstruction</div>
                            <div className="w-full h-full bg-[#0A0D14] flex items-center justify-center">
                                <div className="w-[80%] h-px bg-[#4D94FF]/10 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Sagittal Panel */}
                        <div className="relative bg-black overflow-hidden border-t border-[#1A2642]">
                            <div className="absolute top-3 left-4 text-[11px] font-bold text-white/40 z-10 uppercase">Sagittal Reconstruction</div>
                            <div className="w-full h-full bg-[#0A0D14] flex items-center justify-center">
                                <div className="h-[80%] w-px bg-[#4D94FF]/10 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Analysis / Metrics Panel */}
                        <div className="relative bg-[#0A0D14] overflow-hidden border-t border-l border-[#1A2642] p-6 text-white/80">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock size={16} className="text-[#4D94FF]" />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Dynamic Analysis</span>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Max Inhalation Depth</div>
                                    <div className="text-[20px] font-black text-[#4D94FF]">24.8 <span className="text-[12px]">mm</span></div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Cycle Regularity</div>
                                    <div className="text-[20px] font-black text-[#4CAF50]">98.2 <span className="text-[12px]">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right: Parameter Adjustments */}
                <aside className="w-[280px] bg-white border-l border-[#D1D9E1] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="p-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                        <div className="text-[12px] font-black text-[#37474F] uppercase mb-1">Observation Settings</div>
                        <div className="text-[10px] text-[#90A4AE]">Configure viewport & visualization</div>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Phase Timeline Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#546E7A]">4D PHASE STRIP</span>
                                <span className="text-[11px] font-black text-[#4D94FF] bg-[#E3F2FD] px-2 py-0.5 rounded-full">{PHASES[currentPhaseIdx].label}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max={PHASES.length - 1} 
                                value={currentPhaseIdx} 
                                onChange={(e) => { setCurrentPhaseIdx(parseInt(e.target.value)); setIsPlaying(false); }}
                                className="w-full accent-[#4D94FF]" 
                            />
                            <div className="flex justify-between text-[9px] text-[#90A4AE] font-mono">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* Slice Scroll */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#546E7A]">SLICE POSITION</span>
                                <span className="text-[11px] font-black text-[#37474F]">{sliceIndex} / 120</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="119" 
                                value={sliceIndex} 
                                onChange={(e) => setSliceIndex(parseInt(e.target.value))}
                                className="w-full accent-[#546E7A]" 
                            />
                        </div>

                        {/* WW / WL Controls */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#90A4AE] uppercase">Window Width</label>
                                <div className="h-10 px-3 bg-gray-50 border border-[#D1D9E1] rounded-lg flex items-center justify-between">
                                    <span className="text-[13px] font-black text-[#37474F]">{ww}</span>
                                    <div className="flex flex-col">
                                        <button onClick={() => setWw(w => w + 10)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="rotate-90"/></button>
                                        <button onClick={() => setWw(w => w - 10)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="-rotate-90"/></button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#90A4AE] uppercase">Window Level</label>
                                <div className="h-10 px-3 bg-gray-50 border border-[#D1D9E1] rounded-lg flex items-center justify-between">
                                    <span className="text-[13px] font-black text-[#37474F]">{wl}</span>
                                    <div className="flex flex-col">
                                        <button onClick={() => setWl(l => l + 5)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="rotate-90"/></button>
                                        <button onClick={() => setWl(l => l - 5)} className="text-[#90A4AE] hover:text-[#4D94FF]"><ChevronLeft size={10} className="-rotate-90"/></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rendering Info */}
                        <div className="mt-8 p-3 bg-[#F8FAFC] border border-[#E3E8EE] rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-[#90A4AE] font-bold uppercase">Recon Matrix</span>
                                <span className="text-[#546E7A] font-black">512 x 512</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-[#90A4AE] font-bold uppercase">Slice Thick</span>
                                <span className="text-[#546E7A] font-black">2.5 mm</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-[#90A4AE] font-bold uppercase">Kernel</span>
                                <span className="text-[#546E7A] font-black">Soft Tissue</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Global Scrollbar Style */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #DFE3E8;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #C4CDD5;
                }
            `}</style>
        </div>
    );
}
