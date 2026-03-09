import { useEffect, useMemo, useRef, useState } from "react";
import {
    User,
    Settings,
    Sun,
    ChevronLeft,
    ChevronRight,
    Monitor,
    UserCheck,
    Layers3,
    SlidersHorizontal,
    ZoomIn,
    ZoomOut,
    Hand,
    Ruler,
    Pencil,
    CircleDot,
    Maximize,
    RefreshCw,
    Play,
    Pause,
} from "lucide-react";
import * as dicomParser from "dicom-parser";

type ImageItem = { id: string; name: string };
type Series = {
    id: string;
    name: string;
    count: number;
    kernel: string;
    thickness: string;
    kV: string;
    mAs: string;
    fov: string;
    matrix: string;
    images: ImageItem[];
};
type Study = {
    id: string;
    name: string;
    series: Series[];
};
type DrawRect = { x: number; y: number; w: number; h: number };
type ScreenMeasure = {
    id: string;
    slice: number;
    sx1: number;
    sy1: number;
    sx2: number;
    sy2: number;
};
type TextAnnotation = {
    id: string;
    kind: "text";
    slice: number;
    x: number;
    y: number;
    text: string;
};
type Annotation = TextAnnotation;

const formatPersonName = (value?: string) => (value ? value.replace(/\^/g, " ").trim() : "N/A");

const formatDicomDate = (value?: string) => {
    if (!value || value.length < 8) return "N/A";
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

const formatDicomTime = (value?: string) => {
    if (!value || value.length < 6) return "N/A";
    return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4, 6)}`;
};

const cleanOverlayText = (value?: string) => {
    if (!value) return "N/A";
    const normalized = value
        .replace(/[^\x20-\x7E\u4E00-\u9FFF]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return normalized || "N/A";
};

const ViewScreen = () => {
    const [selectedSeriesId, setSelectedSeriesId] = useState("series-soft");
    const [imageMode, setImageMode] = useState<"2D" | "3D">("2D");
    const [sliceIndex, setSliceIndex] = useState(159);
    const [toolMode, setToolMode] = useState<"pan" | "wl" | "measure" | "annotate">("pan");
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [invert, setInvert] = useState(false);
    const [ww, setWw] = useState(350);
    const [wl, setWl] = useState(45);
    const [isPlaying, setIsPlaying] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const viewportRef = useRef<HTMLElement | null>(null);
    const dragRef = useRef<{ dragging: boolean; x: number; y: number }>({ dragging: false, x: 0, y: 0 });
    const measureStartRef = useRef<{ x: number; y: number } | null>(null);
    const huDataRef = useRef<Float32Array | null>(null);
    const imgSizeRef = useRef({ rows: 0, cols: 0 });
    const defaultWindowRef = useRef({ ww: 350, wl: 45 });
    const drawRectRef = useRef<DrawRect>({ x: 0, y: 0, w: 1, h: 1 });
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [measures, setMeasures] = useState<ScreenMeasure[]>([]);
    const [draftMeasure, setDraftMeasure] = useState<{
        sx1: number;
        sy1: number;
        sx2: number;
        sy2: number;
        slice: number;
    } | null>(null);
    const [renderTick, setRenderTick] = useState(0);
    const [meta, setMeta] = useState({
        patientName: "N/A",
        patientId: "N/A",
        patientSex: "N/A",
        patientAge: "N/A",
        modality: "CT",
        studyDate: "N/A",
        studyTime: "N/A",
        institution: "N/A",
        manufacturer: "N/A",
        seriesDescription: "N/A",
        seriesNumber: "N/A",
        instanceNumber: "N/A",
        pixelSpacing: "N/A",
        sliceLocation: "N/A",
        kvp: "N/A",
        mas: "N/A",
        ww: 350,
        wl: 45,
        thickness: "N/A",
        rows: 0,
        cols: 0,
        count: 320,
    });

    const studyTree = useMemo<Study[]>(
        () => [
            {
                id: "study-1",
                name: "Head_FacialBoneVolume",
                series: [
                    {
                        id: "series-scout",
                        name: "定位像 (Scout)",
                        count: 2,
                        kernel: "Scout",
                        thickness: "5.0 mm",
                        kV: "100",
                        mAs: "20",
                        fov: "300 mm",
                        matrix: "1024",
                        images: Array.from({ length: 2 }).map((_, i) => ({
                            id: `img-s-${i + 1}`,
                            name: `Scout ${i + 1}`
                        }))
                    },
                    {
                        id: "series-soft",
                        name: "Axial Soft Tissue",
                        count: 128,
                        kernel: "Standard",
                        thickness: "1.25 mm",
                        kV: "120",
                        mAs: "180",
                        fov: "250 mm",
                        matrix: "512",
                        images: Array.from({ length: 6 }).map((_, i) => ({
                            id: `img-${i + 1}`,
                            name: `Image ${i + 1}`
                        }))
                    },
                    {
                        id: "series-bone",
                        name: "Axial Bone",
                        count: 96,
                        kernel: "Bone",
                        thickness: "0.625 mm",
                        kV: "120",
                        mAs: "220",
                        fov: "220 mm",
                        matrix: "512",
                        images: Array.from({ length: 6 }).map((_, i) => ({
                            id: `img-b-${i + 1}`,
                            name: `Bone ${i + 1}`
                        }))
                    }
                ]
            }
        ],
        []
    );

    const seriesList = studyTree.flatMap((study) => study.series);
    const selectedSeries = seriesList.find((s) => s.id === selectedSeriesId) ?? seriesList[0];
    const totalSlices = 320;
    const pixelSpacingValue = (() => {
        const raw = meta.pixelSpacing.split("/")[0]?.trim() ?? "";
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    })();
    const handleResetAll = () => {
        setRotation(0);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setInvert(false);
        setWw(defaultWindowRef.current.ww);
        setWl(defaultWindowRef.current.wl);
        setToolMode("pan");
        setMeasures([]);
        setAnnotations([]);
        setDraftMeasure(null);
        measureStartRef.current = null;
        dragRef.current = { dragging: false, x: 0, y: 0 };
    };

    const screenToImage = (clientX: number, clientY: number) => {
        const viewport = viewportRef.current;
        const { rows, cols } = imgSizeRef.current;
        if (!viewport || rows === 0 || cols === 0) return null;
        const drawRect = drawRectRef.current;
        const rect = viewport.getBoundingClientRect();
        const sx = clientX - rect.left;
        const sy = clientY - rect.top;
        const rectW = Math.max(drawRect.w, 1);
        const rectH = Math.max(drawRect.h, 1);
        const nx = Math.min(1, Math.max(0, (sx - drawRect.x) / rectW));
        const ny = Math.min(1, Math.max(0, (sy - drawRect.y) / rectH));
        return {
            x: nx * cols,
            y: ny * rows,
        };
    };

    const imageToScreen = (x: number, y: number) => {
        const { rows, cols } = imgSizeRef.current;
        if (rows === 0 || cols === 0) return { x: 0, y: 0 };
        const drawRect = drawRectRef.current;
        return {
            x: drawRect.x + (x / cols) * drawRect.w,
            y: drawRect.y + (y / rows) * drawRect.h,
        };
    };

    const screenPointInViewport = (clientX: number, clientY: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return null;
        const rect = viewport.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    useEffect(() => {
        const loadSlice = async () => {
            try {
                const fileName = `SYNO${String(sliceIndex + 1).padStart(4, "0")}.dcm`;
                const url = `/dicom/test/${fileName}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${fileName}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                const byteArray = new Uint8Array(arrayBuffer);
                const dataSet = dicomParser.parseDicom(byteArray);

                const rows = dataSet.uint16("x00280010") ?? 0;
                const cols = dataSet.uint16("x00280011") ?? 0;
                const bitsAllocated = dataSet.uint16("x00280100") ?? 16;
                const pixelRepresentation = dataSet.uint16("x00280103") ?? 0;
                const intercept = Number(dataSet.string("x00281052") ?? "0");
                const slope = Number(dataSet.string("x00281053") ?? "1");
                const wcFromTag = Number(dataSet.string("x00281050") ?? "45");
                const wwFromTag = Number(dataSet.string("x00281051") ?? "350");
                const patientName = cleanOverlayText(formatPersonName(dataSet.string("x00100010")));
                const patientId = cleanOverlayText(dataSet.string("x00100020"));
                const patientSex = cleanOverlayText(dataSet.string("x00100040"));
                const patientAge = cleanOverlayText(dataSet.string("x00101010"));
                const modality = cleanOverlayText(dataSet.string("x00080060") ?? "CT");
                const studyDate = formatDicomDate(dataSet.string("x00080020"));
                const studyTime = formatDicomTime(dataSet.string("x00080030"));
                const institution = cleanOverlayText(dataSet.string("x00080080"));
                const manufacturer = cleanOverlayText(dataSet.string("x00080070"));
                const seriesDescription = cleanOverlayText(dataSet.string("x0008103e") ?? selectedSeries.name);
                const seriesNumber = cleanOverlayText(dataSet.string("x00200011"));
                const instanceNumber = cleanOverlayText(dataSet.string("x00200013") ?? String(sliceIndex + 1));
                const pixelSpacing = cleanOverlayText((dataSet.string("x00280030") ?? "N/A").replace("\\", " / "));
                const sliceLocation = cleanOverlayText(dataSet.string("x00201041"));
                const kvp = cleanOverlayText(dataSet.string("x00180060"));
                const mas = cleanOverlayText(dataSet.string("x00181152"));
                const thickness = dataSet.string("x00180050") ?? "N/A";

                const pixelDataElement = dataSet.elements.x7fe00010;
                if (!pixelDataElement || !canvasRef.current || rows === 0 || cols === 0) return;

                const pixelDataOffset = pixelDataElement.dataOffset;
                const pixelDataLength = pixelDataElement.length;
                const pixelData = byteArray.slice(pixelDataOffset, pixelDataOffset + pixelDataLength);
                const pixelBuffer = pixelData.buffer.slice(
                    pixelData.byteOffset,
                    pixelData.byteOffset + pixelData.byteLength
                );

                let values: Int16Array | Uint16Array;
                if (bitsAllocated === 16) {
                    values = pixelRepresentation === 1 ? new Int16Array(pixelBuffer) : new Uint16Array(pixelBuffer);
                } else {
                    values = new Uint16Array(pixelBuffer);
                }

                const parsedWw = Number.isFinite(wwFromTag) && wwFromTag > 1 ? wwFromTag : 350;
                const parsedWl = Number.isFinite(wcFromTag) ? wcFromTag : 45;
                defaultWindowRef.current = { ww: parsedWw, wl: parsedWl };
                if (sliceIndex === 159) {
                    setWw(parsedWw);
                    setWl(parsedWl);
                }

                const huValues = new Float32Array(values.length);
                for (let i = 0; i < values.length; i += 1) {
                    huValues[i] = values[i] * slope + intercept;
                }
                huDataRef.current = huValues;
                imgSizeRef.current = { rows, cols };
                setRenderTick((n) => n + 1);

                setMeta({
                    patientName,
                    patientId,
                    patientSex,
                    patientAge,
                    modality,
                    studyDate,
                    studyTime,
                    institution,
                    manufacturer,
                    seriesDescription,
                    seriesNumber,
                    instanceNumber,
                    pixelSpacing,
                    sliceLocation,
                    kvp,
                    mas,
                    ww: parsedWw,
                    wl: parsedWl,
                    thickness: thickness === "N/A" ? thickness : `${thickness} mm`,
                    rows,
                    cols,
                    count: totalSlices,
                });
            } catch (error) {
                // Keep UI alive if one slice fails.
                console.error(error);
            }
        };

        loadSlice();
    }, [sliceIndex, selectedSeriesId, selectedSeries.name]);

    useEffect(() => {
        const renderCurrentSlice = () => {
            const canvas = canvasRef.current;
            const viewport = viewportRef.current;
            const huValues = huDataRef.current;
            const { rows, cols } = imgSizeRef.current;
            if (!canvas || !viewport || !huValues || rows === 0 || cols === 0) return;

            const viewW = Math.max(1, Math.floor(viewport.clientWidth));
            const viewH = Math.max(1, Math.floor(viewport.clientHeight));
            if (canvas.width !== viewW || canvas.height !== viewH) {
                canvas.width = viewW;
                canvas.height = viewH;
            }
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const offscreen = document.createElement("canvas");
            offscreen.width = cols;
            offscreen.height = rows;
            const offCtx = offscreen.getContext("2d");
            if (!offCtx) return;

            const imageData = offCtx.createImageData(cols, rows);
            const out = imageData.data;
            const minVal = wl - ww / 2;
            const maxVal = wl + ww / 2;
            const range = Math.max(maxVal - minVal, 1);

            for (let i = 0; i < huValues.length; i += 1) {
                const normalized = Math.min(1, Math.max(0, (huValues[i] - minVal) / range));
                const gray = Math.round(normalized * 255);
                const pixel = invert ? 255 - gray : gray;
                const j = i * 4;
                out[j] = pixel;
                out[j + 1] = pixel;
                out[j + 2] = pixel;
                out[j + 3] = 255;
            }
            offCtx.putImageData(imageData, 0, 0);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, viewW, viewH);

            const fitScale = Math.min(viewW / cols, viewH / rows);
            const drawScale = fitScale * zoom;
            const drawW = cols * drawScale;
            const drawH = rows * drawScale;
            const x = (viewW - drawW) / 2 + pan.x;
            const y = (viewH - drawH) / 2 + pan.y;
            drawRectRef.current = { x, y, w: drawW, h: drawH };

            ctx.imageSmoothingEnabled = true;
            ctx.save();
            if (rotation !== 0) {
                const cx = x + drawW / 2;
                const cy = y + drawH / 2;
                ctx.translate(cx, cy);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.translate(-cx, -cy);
            }
            ctx.drawImage(offscreen, x, y, drawW, drawH);
            ctx.restore();
        };

        renderCurrentSlice();
    }, [renderTick, ww, wl, zoom, pan, invert, rotation]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") {
                setSliceIndex((prev) => Math.min(totalSlices - 1, prev + 1));
            }
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                setSliceIndex((prev) => Math.max(0, prev - 1));
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = window.setInterval(() => {
            setSliceIndex((prev) => (prev >= totalSlices - 1 ? 0 : prev + 1));
        }, 250);
        return () => window.clearInterval(timer);
    }, [isPlaying, totalSlices]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (toolMode !== "measure" || !measureStartRef.current) return;
            const point = screenPointInViewport(e.clientX, e.clientY);
            if (!point) return;
            setDraftMeasure((prev) => (prev ? { ...prev, sx2: point.x, sy2: point.y } : null));
        };
        const onUp = () => {
            if (toolMode !== "measure" || !draftMeasure) return;
            const distPx = Math.hypot(draftMeasure.sx2 - draftMeasure.sx1, draftMeasure.sy2 - draftMeasure.sy1);
            const pxPerImagePixel = Math.max(drawRectRef.current.w / Math.max(imgSizeRef.current.cols, 1), 0.0001);
            const dist = (distPx / pxPerImagePixel) * pixelSpacingValue;
            if (dist > 1) {
                setMeasures((prev) => [
                    ...prev,
                    {
                        id: `measure-${Date.now()}-${Math.random()}`,
                        slice: draftMeasure.slice,
                        sx1: draftMeasure.sx1,
                        sy1: draftMeasure.sy1,
                        sx2: draftMeasure.sx2,
                        sy2: draftMeasure.sy2,
                    },
                ]);
            }
            setDraftMeasure(null);
            measureStartRef.current = null;
            dragRef.current.dragging = false;
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [toolMode, draftMeasure, pixelSpacingValue]);

    return (
        <div className="flex flex-col w-[1024px] h-[768px] bg-[#EEF2F9] overflow-hidden rounded-md border border-[#B0C4DE] shadow-2xl">
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
                            <div className="ml-auto flex flex-col gap-0.5 text-[#546E7A] opacity-60">
                                <div className="text-[9px] font-bold italic">⊥ 0</div>
                                <div className="text-[9px] font-bold">∠ 0</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-[28px] font-bold tracking-tight text-[#37474F] leading-none">13:52</div>
                        <div className="text-[12px] text-[#546E7A] font-medium mt-1 uppercase opacity-80">View</div>
                    </div>

                    <div className="flex items-center gap-5 pr-2">
                        <div className="p-1 text-[#D32F2F] cursor-pointer hover:opacity-70"><UserCheck size={32} strokeWidth={1.5} /></div>
                        <div className="p-1 text-[#546E7A] cursor-pointer hover:opacity-70 relative">
                            <Monitor size={24} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">9</span>
                        </div>
                        <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                            <Sun size={24} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">5</span>
                        </div>
                        <div className="relative p-1 text-[#546E7A] cursor-pointer hover:opacity-70">
                            <Settings size={24} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D32F2F] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">10</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden p-2 gap-2">
                    <aside className="w-[240px] bg-white rounded-lg border border-[#B0C4DE] shadow-sm flex flex-col overflow-hidden shrink-0">
                        <div className="h-[44px] bg-[#F8FAFC] border-b border-[#EEF2F9] px-3 flex items-center gap-2">
                            <Layers3 size={14} className="text-[#4D94FF]" />
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#37474F]">图像序列</span>
                        </div>

                        <div className="h-[220px] overflow-y-auto p-2 border-b border-[#EEF2F9]">
                            {studyTree.map((study) => (
                                <div key={study.id} className="mb-2">
                                    <div className="px-2 py-1.5 text-[11px] font-black text-[#546E7A] uppercase tracking-wide">
                                        {study.name}
                                    </div>
                                    <div className="pl-2 border-l border-[#DCE6F2] ml-2">
                                        {study.series.map((series) => {
                                            const active = series.id === selectedSeriesId;
                                            return (
                                                <button
                                                    key={series.id}
                                                    onClick={() => {
                                                        setSelectedSeriesId(series.id);
                                                    }}
                                                    className={`w-full text-left mb-1.5 rounded-md border px-3 py-2 transition-all ${active
                                                        ? "bg-[#E3F2FD] border-[#90CAF9]"
                                                        : "bg-white border-[#DCE6F2] hover:bg-[#F8FAFC]"
                                                        }`}
                                                >
                                                    <div className={`text-[12px] font-bold ${active ? "text-[#1565C0]" : "text-[#37474F]"}`}>{series.name}</div>
                                                    <div className="text-[10px] text-[#78909C] mt-0.5">{series.count} images</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-[44px] bg-[#F8FAFC] border-b border-t border-[#EEF2F9] px-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-[#4D94FF]" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#37474F]">图像参数</span>
                            </div>
                            <div className="flex items-center gap-1 rounded-md border border-[#DCE6F2] bg-white p-[2px] shadow-sm">
                                {(["2D", "3D"] as const).map((mode) => {
                                    const active = imageMode === mode;
                                    return (
                                        <button
                                            key={mode}
                                            onClick={() => setImageMode(mode)}
                                            className={`min-w-[34px] h-[22px] px-2 rounded text-[10px] font-black transition-all ${active
                                                ? "bg-[#4D94FF] text-white"
                                                : "text-[#78909C] hover:bg-[#F1F5F9]"
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-1 bg-[#F8FAFC] overflow-hidden flex flex-col">
                            <div className="flex-1 p-3 grid grid-cols-2 gap-2 overflow-y-auto">
                                {imageMode === "2D" ? (
                                    <>
                                        <Param label="Kernel" value={selectedSeries.kernel} />
                                        <Param label="Slice" value={selectedSeries.thickness} />
                                        <Param label="kV" value={selectedSeries.kV} />
                                        <Param label="mAs" value={selectedSeries.mAs} />
                                        <Param label="FOV" value={selectedSeries.fov} />
                                        <Param label="Matrix" value={selectedSeries.matrix} />
                                    </>
                                ) : (
                                    <>
                                        <Param label="Render" value="Volume" />
                                        <Param label="Preset" value="Bone" />
                                        <Param label="Slab" value="18 mm" />
                                        <Param label="Opacity" value="72%" />
                                        <Param label="Lighting" value="On" />
                                        <Param label="Threshold" value="180 HU" />
                                    </>
                                )}
                            </div>
                            <div className="px-3 pb-3">
                                <button className="h-[32px] w-full bg-white border border-[#B0C4DE] rounded-md text-[10px] font-bold text-[#4D94FF] hover:bg-blue-50 transition-all shadow-sm">
                                    详情
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 flex gap-[2px] min-w-0">
                    <section
                        ref={viewportRef}
                        className={`flex-1 min-w-0 m-[2px] bg-black rounded-lg border border-[#B0C4DE] shadow-sm overflow-hidden relative ${toolMode === "measure" ? "cursor-crosshair" : toolMode === "annotate" ? "cursor-cell" : toolMode === "pan" ? "cursor-grab" : "cursor-default"}`}
                        onWheel={(e) => {
                            e.preventDefault();
                            if (e.ctrlKey) {
                                setZoom((prev) => Math.min(4, Math.max(0.3, prev + (e.deltaY > 0 ? -0.05 : 0.05))));
                            } else {
                                setSliceIndex((prev) => {
                                    const next = e.deltaY > 0 ? prev + 1 : prev - 1;
                                    return Math.max(0, Math.min(totalSlices - 1, next));
                                });
                            }
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                if (e.button !== 0) return;
                                if (toolMode === "measure") {
                                    const point = screenPointInViewport(e.clientX, e.clientY);
                                    if (!point) return;
                                    measureStartRef.current = point;
                                    setDraftMeasure({
                                        sx1: point.x,
                                        sy1: point.y,
                                        sx2: point.x,
                                        sy2: point.y,
                                        slice: sliceIndex,
                                    });
                                    return;
                                }
                                if (toolMode === "annotate") {
                                    const point = screenToImage(e.clientX, e.clientY);
                                    if (!point) return;
                                    const noteCount = annotations.filter((a) => a.slice === sliceIndex && a.kind === "text").length;
                                    setAnnotations((prev) => [
                                        ...prev,
                                        {
                                            id: `anno-text-${Date.now()}-${Math.random()}`,
                                            kind: "text",
                                            slice: sliceIndex,
                                            x: point.x,
                                            y: point.y,
                                            text: `Note ${noteCount + 1}`,
                                        },
                                    ]);
                                    return;
                                }
                                dragRef.current = { dragging: true, x: e.clientX, y: e.clientY };
                            }}
                            onMouseMove={(e) => {
                                e.stopPropagation();
                                if (toolMode === "measure" && measureStartRef.current) {
                                    const point = screenPointInViewport(e.clientX, e.clientY);
                                    if (!point) return;
                                    setDraftMeasure((prev) => (prev ? { ...prev, sx2: point.x, sy2: point.y } : null));
                                    return;
                                }
                                if (!dragRef.current.dragging) return;
                                const dx = e.clientX - dragRef.current.x;
                                const dy = e.clientY - dragRef.current.y;
                                dragRef.current = { dragging: true, x: e.clientX, y: e.clientY };
                                if (toolMode === "pan") {
                                    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
                                } else if (toolMode === "wl") {
                                    setWl((prev) => prev + dx * 0.8);
                                    setWw((prev) => Math.max(1, prev + dy * 1.2));
                                }
                            }}
                            onMouseUp={(e) => {
                                e.stopPropagation();
                                if (toolMode === "measure" && draftMeasure) {
                                    const distPx = Math.hypot(draftMeasure.sx2 - draftMeasure.sx1, draftMeasure.sy2 - draftMeasure.sy1);
                                    const pxPerImagePixel = Math.max(drawRectRef.current.w / Math.max(imgSizeRef.current.cols, 1), 0.0001);
                                    const dist = (distPx / pxPerImagePixel) * pixelSpacingValue;
                                    if (dist > 1) {
                                        setMeasures((prev) => [
                                            ...prev,
                                            {
                                                id: `measure-${Date.now()}-${Math.random()}`,
                                                slice: draftMeasure.slice,
                                                sx1: draftMeasure.sx1,
                                                sy1: draftMeasure.sy1,
                                                sx2: draftMeasure.sx2,
                                                sy2: draftMeasure.sy2,
                                            },
                                        ]);
                                    }
                                    setDraftMeasure(null);
                                    measureStartRef.current = null;
                                    return;
                                }
                                dragRef.current.dragging = false;
                            }}
                            onMouseLeave={(e) => {
                                e.stopPropagation();
                                if (toolMode === "measure" && draftMeasure) {
                                    const distPx = Math.hypot(draftMeasure.sx2 - draftMeasure.sx1, draftMeasure.sy2 - draftMeasure.sy1);
                                    const pxPerImagePixel = Math.max(drawRectRef.current.w / Math.max(imgSizeRef.current.cols, 1), 0.0001);
                                    const dist = (distPx / pxPerImagePixel) * pixelSpacingValue;
                                    if (dist > 1) {
                                        setMeasures((prev) => [
                                            ...prev,
                                            {
                                                id: `measure-${Date.now()}-${Math.random()}`,
                                                slice: draftMeasure.slice,
                                                sx1: draftMeasure.sx1,
                                                sy1: draftMeasure.sy1,
                                                sx2: draftMeasure.sx2,
                                                sy2: draftMeasure.sy2,
                                            },
                                        ]);
                                    }
                                    setDraftMeasure(null);
                                    measureStartRef.current = null;
                                }
                                dragRef.current.dragging = false;
                            }}
                        />
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {measures
                                .filter((a) => a.slice === sliceIndex)
                                .map((a) => {
                                    const mx = (a.sx1 + a.sx2) / 2;
                                    const my = (a.sy1 + a.sy2) / 2;
                                    const distPx = Math.hypot(a.sx2 - a.sx1, a.sy2 - a.sy1);
                                    const pxPerImagePixel = Math.max(drawRectRef.current.w / Math.max(imgSizeRef.current.cols, 1), 0.0001);
                                    const mm = (distPx / pxPerImagePixel) * pixelSpacingValue;
                                    return (
                                        <g key={a.id}>
                                            <line x1={a.sx1} y1={a.sy1} x2={a.sx2} y2={a.sy2} stroke="#FF4D4F" strokeWidth="2" />
                                            <circle cx={a.sx1} cy={a.sy1} r="2.8" fill="#FF4D4F" />
                                            <circle cx={a.sx2} cy={a.sy2} r="2.8" fill="#FF4D4F" />
                                            <rect x={mx - 26} y={my - 13} width="52" height="15" rx="3" fill="rgba(0,0,0,0.72)" />
                                            <text x={mx} y={my - 2} fill="#FFEAEA" fontSize="10" fontFamily="monospace" textAnchor="middle">
                                                {mm.toFixed(1)} mm
                                            </text>
                                        </g>
                                    );
                                })}
                            {annotations
                                .filter((a): a is TextAnnotation => a.slice === sliceIndex && a.kind === "text")
                                .map((a) => {
                                    const p = imageToScreen(a.x, a.y);
                                    return (
                                        <g key={a.id}>
                                            <circle cx={p.x} cy={p.y} r="3" fill="#FFD54F" />
                                            <rect x={p.x + 6} y={p.y - 12} width="58" height="16" rx="3" fill="rgba(0,0,0,0.75)" />
                                            <text x={p.x + 35} y={p.y - 1} fill="#FFF8E1" fontSize="10" fontFamily="monospace" textAnchor="middle">
                                                {a.text}
                                            </text>
                                        </g>
                                    );
                                })}
                            {draftMeasure && (() => {
                                const distPx = Math.hypot(draftMeasure.sx2 - draftMeasure.sx1, draftMeasure.sy2 - draftMeasure.sy1);
                                const pxPerImagePixel = Math.max(drawRectRef.current.w / Math.max(imgSizeRef.current.cols, 1), 0.0001);
                                const mm = (distPx / pxPerImagePixel) * pixelSpacingValue;
                                return (
                                    <g>
                                        <line x1={draftMeasure.sx1} y1={draftMeasure.sy1} x2={draftMeasure.sx2} y2={draftMeasure.sy2} stroke="#FF4D4F" strokeWidth="2" strokeDasharray="4 3" />
                                        <text x={(draftMeasure.sx1 + draftMeasure.sx2) / 2} y={(draftMeasure.sy1 + draftMeasure.sy2) / 2 - 6} fill="#FFEAEA" fontSize="10" fontFamily="monospace" textAnchor="middle">
                                            {mm.toFixed(1)} mm
                                        </text>
                                    </g>
                                );
                            })()}
                        </svg>
                        <div className="absolute top-2 left-2 text-[10px] text-[#CFD8DC] font-mono leading-[1.35] pointer-events-none">
                            <div className="font-bold">{meta.patientName}</div>
                            <div>ID {meta.patientId} | {meta.patientSex} {meta.patientAge}</div>
                            <div>{meta.modality} | {meta.studyDate} {meta.studyTime}</div>
                        </div>
                        <div className="absolute top-2 right-2 text-[10px] text-[#CFD8DC] font-mono text-right leading-[1.35] pointer-events-none">
                            <div className="font-bold">{meta.seriesDescription}</div>
                            <div>Image {sliceIndex + 1}/{meta.count}</div>
                            <div>KV {meta.kvp} | mAs {meta.mas}</div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] text-[#CFD8DC] font-mono leading-[1.35] pointer-events-none">
                            <div>WW/WL {Math.round(ww)} / {Math.round(wl)}</div>
                            <div>Spacing {meta.pixelSpacing}</div>
                            <div>{meta.rows} x {meta.cols} | Zoom {zoom.toFixed(2)}x</div>
                        </div>
                        <div className="absolute bottom-2 right-2 text-[10px] text-[#CFD8DC] font-mono text-right leading-[1.35] pointer-events-none">
                            <div>Slice {sliceIndex + 1}/{meta.count} | Thick {meta.thickness}</div>
                            <div>Location {meta.sliceLocation}</div>
                            <div>{meta.institution} | {meta.manufacturer}</div>
                        </div>
                    </section>
                    <aside className="w-[72px] bg-[#111827] rounded-lg border border-[#B0C4DE] shadow-sm overflow-hidden shrink-0 flex flex-col">
                        <div className="h-[44px] bg-[#0F172A] border-b border-white/10 flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#CBD5E1]">Tools</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1 p-2" onPointerDown={(e) => e.stopPropagation()}>
                            {(["pan", "wl", "measure", "annotate"] as const).map((mode, i) => {
                                const icons = [
                                    <Hand size={20} strokeWidth={1.5} key="hand" />,
                                    <CircleDot size={20} strokeWidth={1.5} key="circle" />,
                                    <Ruler size={20} strokeWidth={1.5} key="ruler" />,
                                    <Pencil size={20} strokeWidth={1.5} key="pencil" />,
                                ];
                                const titles = ["Pan", "WW/WL", "Measure", "Annotate"];
                                const active = toolMode === mode;
                                return (
                                    <button
                                        key={mode}
                                        title={titles[i]}
                                        onClick={() => setToolMode(mode)}
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            borderRadius: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "none",
                                            cursor: "pointer",
                                            transition: "all 0.15s ease",
                                            background: active ? "#3B82F6" : "transparent",
                                            color: active ? "#ffffff" : "#94A3B8",
                                            boxShadow: active ? "0 0 15px rgba(59,130,246,0.55)" : "none",
                                        }}
                                    >
                                        {icons[i]}
                                    </button>
                                );
                            })}

                            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "4px 4px" }} />

                            {[
                                { title: "Zoom In", icon: <ZoomIn size={20} strokeWidth={1.5} />, action: () => setZoom((z) => Math.min(4, z + 0.1)) },
                                { title: "Zoom Out", icon: <ZoomOut size={20} strokeWidth={1.5} />, action: () => setZoom((z) => Math.max(0.3, z - 0.1)) },
                                {
                                    title: "Fit to Screen", icon: <Maximize size={20} strokeWidth={1.5} />, action: () => {
                                        setZoom(1);
                                        setPan({ x: 0, y: 0 });
                                    }
                                },
                                {
                                    title: "Reset", icon: <RefreshCw size={20} strokeWidth={1.5} />, action: () => {
                                        handleResetAll();
                                    }
                                },
                                {
                                    title: isPlaying ? "Pause" : "Play",
                                    icon: isPlaying ? <Pause size={20} strokeWidth={1.5} /> : <Play size={20} strokeWidth={1.5} />,
                                    action: () => {
                                        setIsPlaying((prev) => !prev);
                                    },
                                    active: isPlaying,
                                },
                            ].map(({ title, icon, action, active }) => (
                                <button
                                    key={title}
                                    title={title}
                                    onClick={action}
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        background: active ? "#3B82F6" : "transparent",
                                        color: active ? "#ffffff" : "#94A3B8",
                                        boxShadow: active ? "0 0 15px rgba(59,130,246,0.55)" : "none",
                                    }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </aside>
                    </div>
                </main>

                <footer className="h-[80px] bg-[#E8EAF1] border-t border-[#B0C4DE] flex items-center shrink-0 px-8 z-10">
                    <div className="flex-1">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-white text-[#4D94FF] font-bold rounded-md border-2 border-[#4D94FF] hover:bg-solid shadow-sm transition-all uppercase text-[13px] active:scale-95">
                            <ChevronLeft size={20} /> 高级处理
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button className="flex items-center gap-2 px-10 h-[52px] bg-[#4D94FF] text-white font-bold rounded-md shadow-lg hover:bg-blue-600 transition-all uppercase text-[13px] active:scale-95">
                            结束检查 <ChevronRight size={20} />
                        </button>
                    </div>
                </footer>
            </div>
    );
};

const Param = ({ label, value }: { label: string; value: string }) => (
    <div className="p-2 bg-white border border-[#B0C4DE]/30 rounded-md flex flex-col items-center justify-center shadow-sm min-h-[56px]">
        <span className="text-[8px] font-black uppercase text-[#90A4AE] tracking-tighter">{label}</span>
        <span className="text-[13px] font-black text-[#37474F] mt-1">{value}</span>
    </div>
);

export default ViewScreen;
