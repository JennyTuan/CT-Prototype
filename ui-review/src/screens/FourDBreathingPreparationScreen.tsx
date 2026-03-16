import { useEffect, useRef, useState } from "react";
import {
    User,
    Activity,
    Settings,
    ChevronLeft,
    Pause,
    Zap,
    ClipboardList,
    Flame,
    Network,
    Siren,
    ChevronRight,
} from "lucide-react";

export default function FourDBreathingPreparationScreen() {
    const [rpm] = useState(13);
    const [isScanning] = useState(false);
    const [status, setStatus] = useState<"ready" | "waiting" | "scanning">("ready");
    const [waveform, setWaveform] = useState<number[]>([]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const windowRange: [number, number] = [35, 65];

    useEffect(() => {
        let angle = 0;

        const interval = window.setInterval(() => {
            angle += 0.06;
            const baseValue = Math.sin(angle) * 35 + 50;
            const noise = (Math.random() - 0.5) * 4;
            const newValue = baseValue + noise;

            setWaveform((prev) => {
                const next = [...prev, newValue];
                if (next.length > 280) return next.slice(1);
                return next;
            });

            if (isScanning) {
                if (newValue > windowRange[0] && newValue < windowRange[1]) {
                    setStatus("scanning");
                } else {
                    setStatus("waiting");
                }
            } else {
                setStatus("ready");
            }
        }, 40);

        return () => window.clearInterval(interval);
    }, [isScanning]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
        const winYBottom = height - (windowRange[0] / 100) * height;
        const winYTop = height - (windowRange[1] / 100) * height;
        ctx.fillRect(0, winYTop, width, winYBottom - winYTop);

        ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, winYTop);
        ctx.lineTo(width, winYTop);
        ctx.moveTo(0, winYBottom);
        ctx.lineTo(width, winYBottom);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";

        waveform.forEach((val, i) => {
            const x = (i / 280) * width;
            const y = height - (val / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        const lastVal = waveform[waveform.length - 1] ?? 0;
        const inWindow = lastVal > windowRange[0] && lastVal < windowRange[1];

        ctx.strokeStyle = isScanning && inWindow ? "#F97316" : "#3B82F6";
        ctx.stroke();

        if (waveform.length > 0) {
            const x = ((waveform.length - 1) / 280) * width;
            const y = height - (lastVal / 100) * height;
            ctx.fillStyle = isScanning && inWindow ? "#F97316" : "#3B82F6";
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }, [waveform, isScanning]);

    return (
        <div className="relative mx-auto flex h-[768px] w-[1024px] flex-col overflow-hidden rounded-md border border-[#B0C4DE] bg-[#EEF2F9] font-sans text-[#37474F] shadow-2xl">
            <header className="z-10 flex h-[80px] flex-shrink-0 items-center justify-between border-b border-[#B0C4DE] bg-[#E8EAF1] px-4">
                <div className="flex items-center gap-3">
                    <div className="flex min-w-[210px] items-center gap-3 rounded-sm border border-[#B0C4DE] bg-[#DCE6F2] px-4 py-1.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#4A6982] text-white opacity-90">
                            <User size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] font-bold text-[#37474F]">Roky Zhang</span>
                            <span className="mt-0.5 text-[12px] font-medium leading-none text-[#546E7A]">ID: 67890</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                        <div className="text-[9px] font-bold italic">? 0</div>
                        <div className="text-[9px] font-bold">? 0</div>
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                            <Flame size={14} />
                            <span>0%</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[28px] font-bold leading-none tracking-tight text-[#37474F]">13:52</div>
                    <div className="mt-1 text-[12px] font-medium uppercase text-[#546E7A] opacity-80">2026年2月26日 周四</div>
                </div>

                <div className="flex items-center gap-5 pr-2">
                    <div className="cursor-pointer p-1 text-[#D32F2F] hover:opacity-70">
                        <Siren size={30} strokeWidth={1.8} />
                    </div>
                    <div className="relative cursor-pointer p-1 text-[#546E7A] hover:opacity-70">
                        <Network size={24} />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#D32F2F] text-[9px] font-bold text-white">
                            5
                        </span>
                    </div>
                    <div className="relative cursor-pointer p-1 text-[#546E7A] hover:opacity-70">
                        <Activity size={24} />
                    </div>
                    <div className="relative cursor-pointer p-1 text-[#546E7A] hover:opacity-70">
                        <Settings size={24} />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#D32F2F] text-[9px] font-bold text-white">
                            10
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 gap-2 overflow-hidden p-2">
                <section className="flex w-[240px] flex-col overflow-hidden rounded-lg border border-[#B0C4DE] bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-[#EEF2F9] bg-[#F8FAFC] px-4 py-3 text-[#37474F]">
                        <ClipboardList size={16} className="text-[#4D94FF]" />
                        <span className="text-[13px] font-black uppercase tracking-[0.08em]">扫描流程</span>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
                        <div className="border-b border-[#EEF2F9] p-3">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="h-3 w-1.5 rounded-full bg-[#66BB6A]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#546E7A]">Scout</span>
                            </div>
                            <div className="ml-3 border-l border-[#CFE3D6] pl-4">
                                <div className="flex items-center gap-2 py-1.5">
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#66BB6A]" />
                                    </div>
                                    <span className="text-[12px] font-bold text-[#2E7D32]">定位像已完成</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="h-3 w-1.5 rounded-full bg-[#4D94FF]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#546E7A]">Helical Scan</span>
                            </div>
                            <div className="ml-3 border-l border-[#B0C4DE] pl-4">
                                <div className="flex items-center gap-2 py-1.5">
                                    <div className="h-3.5 w-3.5 rounded-full border border-[#B0C4DE] bg-white" />
                                    <span className="text-[12px] font-bold text-[#78909C]">确认参数</span>
                                </div>
                                <div className="flex items-center gap-2 py-1.5">
                                    <div className="h-3.5 w-3.5 rounded-full border-2 border-[#4D94FF] bg-white shadow-[0_0_8px_rgba(77,148,255,0.25)]" />
                                    <span className="text-[12px] font-black text-[#37474F]">呼吸准备</span>
                                </div>
                                <div className="flex items-center gap-2 py-1.5">
                                    <div className="h-3.5 w-3.5 rounded-full border border-[#B0C4DE] bg-white" />
                                    <span className="text-[12px] font-bold text-[#78909C]">执行扫描</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#EEF2F9] p-3">
                            <div className="mb-2 flex items-center gap-2">
                                <div className="h-3 w-1.5 rounded-full bg-[#4D94FF]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#546E7A]">参数信息</span>
                            </div>
                            <div className="rounded-md bg-white px-3 py-2">
                                <div className="border-b border-[#EEF2F9] pb-2">
                                    <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#90A4AE]">PROTOCOL</div>
                                    <div className="mt-1 text-[13px] font-black text-[#37474F]">脑部轴位0-18m</div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                                    <div className="flex items-baseline justify-between border-b border-[#F1F5F9] pb-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">KV</span>
                                        <span className="text-[13px] font-black text-[#37474F]">120</span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-[#F1F5F9] pb-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">MAS</span>
                                        <span className="text-[13px] font-black text-[#37474F]">192</span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-[#F1F5F9] pb-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">ROT</span>
                                        <span className="text-[13px] font-black text-[#37474F]">1.0s</span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-[#F1F5F9] pb-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">LEN</span>
                                        <span className="text-[13px] font-black text-[#37474F]">135mm</span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-[#F1F5F9] pb-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">INC</span>
                                        <span className="text-[13px] font-black text-[#37474F]">19.2mm</span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-[#F1F5F9] pb-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">CYC</span>
                                        <span className="text-[13px] font-black text-[#37474F]">7</span>
                                    </div>
                                    <div className="col-span-2 flex items-baseline justify-between pt-1">
                                        <span className="text-[10px] font-bold text-[#90A4AE]">DIRECTION</span>
                                        <span className="text-[13px] font-black text-[#4D94FF]">OUT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-1 flex-col gap-4">
                    <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="z-10 border-b border-slate-50 bg-white px-6 py-4">
                            <div className="grid grid-cols-4 gap-3">
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">RPM</div>
                                    <div className="mt-1 text-[30px] font-mono font-black leading-none tracking-tighter text-blue-600">{rpm}</div>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">波幅一致性</span>
                                        <span className="text-[11px] font-black text-[#2E7D32]">优</span>
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-[#EEF2F9]">
                                        <div className="h-full rounded-full bg-[#66BB6A]" style={{ width: "94%" }} />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">频率变异度</span>
                                        <span className="text-[11px] font-black text-[#4D94FF]">极低</span>
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-[#EEF2F9]">
                                        <div className="h-full rounded-full bg-[#4D94FF]" style={{ width: "12%" }} />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">同步状态</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-[18px] font-black uppercase tracking-tight text-green-500">Synced</span>
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                    <div className="mt-1 text-[11px] font-bold text-slate-500">Baseline Stable</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-1 flex-col p-5">
                            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
                                <div className="relative flex-1">
                                    <canvas ref={canvasRef} width={680} height={320} className="h-full w-full" />

                                    {isScanning && (
                                        <div
                                            className={`absolute right-6 top-6 flex items-center rounded-full border px-6 py-3 shadow-xl backdrop-blur-md transition-all ${
                                                status === "scanning"
                                                    ? "scale-105 border-orange-400 bg-orange-500 text-white"
                                                    : "border-slate-700 bg-slate-900 text-slate-300"
                                            }`}
                                        >
                                            {status === "scanning" ? (
                                                <Zap size={20} className="mr-2.5 animate-bounce" fill="currentColor" />
                                            ) : (
                                                <Pause size={20} className="mr-2.5" />
                                            )}
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">
                                                {status === "scanning" ? "X-Ray On" : "Waiting Signal"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="z-10 flex h-[80px] flex-shrink-0 items-center border-t border-[#B0C4DE] bg-[#E8EAF1] px-8">
                <div className="flex-1">
                    <button className="flex h-[52px] items-center gap-2 rounded-md border-2 border-[#4D94FF] bg-white px-10 text-[13px] font-bold uppercase text-[#4D94FF] shadow-sm transition-all active:scale-95">
                        <ChevronLeft size={20} /> 上一步
                    </button>
                </div>

                <div className="flex flex-1 justify-center" />

                <div className="flex flex-1 justify-end">
                    <button className="flex h-[52px] items-center gap-2 rounded-md bg-[#4D94FF] px-10 text-[13px] font-bold uppercase text-white shadow-lg transition-all active:scale-95">
                        断层扫描 <ChevronRight size={20} />
                    </button>
                </div>
            </footer>
        </div>
    );
}
