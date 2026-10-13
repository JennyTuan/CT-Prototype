import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArrowBigDown, ArrowBigLeft, ArrowBigRight, ArrowBigUp, BatteryFull, CircleDot, Layers, Monitor, MoveVertical, Server, Siren, Sun, UserRound } from "lucide-react";
import { useMovementText } from "../lib/movementPrototype";
import type { MovementDirection } from "../lib/movementPrototype";

export type MovementPageProps = { onBack?: () => void; onNext?: () => void; initialProgress?: number; verticalMovement?: boolean; sequenceStep?: number };
const arrows = { up: ArrowBigUp, down: ArrowBigDown, left: ArrowBigLeft, right: ArrowBigRight };
const directionLabels = { up: ["前进", "Forward"], down: ["后退", "Backward"], left: ["向左", "Left"], right: ["向右", "Right"] };

export function MovementShell({ step, instruction, children, onBack, onNext, nextDisabled = false, nextLabel, verticalMovement = false, sequenceStep, showStepIndicator = true }: MovementPageProps & {
    step: number; instruction: string; children: ReactNode; nextDisabled?: boolean; nextLabel?: string; showStepIndicator?: boolean;
}) {
    const t = useMovementText();
    return (
        <div className="relative h-[768px] w-[1024px] overflow-hidden bg-[#DCE0ED] text-[#18242D]" style={{ fontFamily: 'Arial, "Microsoft YaHei", sans-serif' }}>
            <div className="absolute left-0 top-0 h-[450px] w-[600px] origin-top-left" style={{ transform: "scale(1.7066666667)" }}>
                <header className="absolute inset-x-0 top-0 flex h-[41px] items-center bg-[#C6CCDA] text-[#626F81]">
                    <div className="ml-[13px] flex h-[34px] w-[89px] items-center gap-1 rounded-[2px] border border-[#9DB7DA] bg-[#D8DEEA] px-1">
                        <UserRound size={23} strokeWidth={1.1} className="text-[#68B6BC]" />
                        <div className="text-center text-[12px] font-bold text-[#233454]">admin<div className="mt-0.5 h-[4px] w-[44px] rounded border border-[#76948D] bg-[#9DC582]" /></div>
                    </div>
                    <div className="ml-[12px] self-start text-center"><div className="text-[27px] font-bold leading-[29px]">13:38</div><div className="text-[7px] leading-none">{t("3月9日 周日", "Mar 9 · Sun")}</div></div>
                    <div className="absolute left-[288px] top-[5px] flex flex-col items-center text-[#162638]"><Sun size={16} className="text-[#689CDA]" /><span className="text-[10px] leading-none">{t("急诊", "ER")}</span></div>
                    <div className="absolute left-[368px] top-[11px] flex items-center gap-[10px] text-[#8793A6]" aria-label="设备状态示意"><Server size={15} /><Monitor size={15} /><Siren size={17} className="text-[#F17068]" /><Sun size={15} /><Layers size={15} /></div>
                    <div className="absolute right-[53px] top-0 flex h-[39px] w-[53px] flex-col items-center justify-center border-x border-[#A2ACBB] text-[8px]"><span className="flex h-[18px] items-center rounded border border-[#A6B6CD] bg-[#EEF5FF] px-1 text-[#568DBE]"><Sun size={11} /> 0%</span><BatteryFull size={23} /></div>
                    <div className="absolute right-[7px] top-[4px] text-[9px] font-bold leading-[16px] text-[#243440]"><div>∠ 0.0°</div><div>↥ 600</div></div>
                </header>
                <h2 className="absolute left-[10px] top-[52px] m-0 text-[14px] font-normal leading-[20px]">{instruction}</h2>
                {children}
                <NavigationArrow direction="left" label={t("上一步", "Previous step")} onClick={onBack} left={8} disabled={!onBack} />
                <NavigationArrow direction="right" label={nextLabel ?? t("下一步", "Next step")} onClick={onNext} left={549} disabled={nextDisabled || !onNext} />
                {showStepIndicator && <div className="absolute inset-x-[65px] bottom-[8px] text-center text-[9px] text-[#66768E]" aria-live="polite">{verticalMovement ? t("垂直移动", "Vertical movement") : t("水平移动", "Parallel movement")} · {sequenceStep ?? step} / {verticalMovement ? 3 : 6} · {t("模拟演示", "Simulation")}</div>}
            </div>
        </div>
    );
}

function NavigationArrow({ direction, label, onClick, left, disabled }: { direction: "left" | "right"; label: string; onClick?: () => void; left: number; disabled: boolean }) {
    const Arrow = arrows[direction];
    return <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="absolute top-[390px] flex h-[44px] w-[44px] items-center justify-center rounded-full border-0 bg-[#C3CCDF] p-0 hover:brightness-105 focus-visible:outline-blue-600 disabled:cursor-default" style={{ left }}><Arrow size={37} strokeWidth={0.8} color={disabled ? "#A7B0BD" : "#88AC64"} fill={disabled ? "#DCE0E5" : "#B8D791"} /></button>;
}

// Keep supplied artwork intact; clip only its illustration region in the layout.
// All text, navigation and interactive controls are rendered separately.
export function MovementArtwork({ source, x, y, width, height, label }: { source: string; x: number; y: number; width: number; height: number; label: string }) {
    return <div role="img" aria-label={label} className="pointer-events-none absolute overflow-hidden" style={{ left: x, top: y, width, height }}><img src={`/movement/${source}.png`} alt="" draggable={false} className="absolute" style={{ width: 600, maxWidth: "none", left: -x, top: -y }} /></div>;
}

function HoldArrow({ direction, label, enabled, onHeldChange }: { direction: MovementDirection; label: string; enabled: boolean; onHeldChange: (held: boolean) => void }) {
    const Arrow = arrows[direction];
    const positions = { up: { left: 51, top: 172 }, down: { left: 51, top: 244 }, left: { left: 17, top: 208 }, right: { left: 85, top: 208 } };
    const t = useMovementText();
    return <button type="button" aria-label={label} title={enabled ? t(`按住${label}（模拟）`, `Hold: ${label} (simulation)`) : label} disabled={!enabled}
        onPointerDown={(event) => { if (event.button !== 0) return; event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); onHeldChange(true); }}
        onPointerUp={() => onHeldChange(false)} onPointerCancel={() => onHeldChange(false)} onLostPointerCapture={() => onHeldChange(false)} onBlur={() => onHeldChange(false)}
        onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); if (!event.repeat) onHeldChange(true); } }}
        onKeyUp={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); onHeldChange(false); } }}
        className="absolute flex h-[43px] w-[43px] touch-none select-none items-center justify-center rounded-full border border-[#A0AEC5] bg-[#C5CDDE] p-0 shadow-[inset_0_1px_2px_#E9EEF7] disabled:cursor-default"
        style={positions[direction]}><Arrow size={37} strokeWidth={0.9} color={enabled ? "#89AA64" : "#A8B0BE"} fill={enabled ? "#BBD88E" : "#DFE3E8"} /></button>;
}

export function MovementRemote({ mode, activeDirection, onDirectionChange, complete = false }: { mode: "raise" | "drive" | "lower"; activeDirection: MovementDirection | null; onDirectionChange: (direction: MovementDirection | null) => void; complete?: boolean }) {
    const t = useMovementText();
    useEffect(() => {
        const release = () => onDirectionChange(null);
        const onVisibility = () => { if (document.hidden) release(); };
        window.addEventListener("blur", release);
        document.addEventListener("visibilitychange", onVisibility);
        return () => { window.removeEventListener("blur", release); document.removeEventListener("visibilitychange", onVisibility); };
    }, [onDirectionChange]);
    return <div className="absolute left-[450px] top-[70px] h-[308px] w-[151px] overflow-hidden rounded-tl-[50px] rounded-bl-[62px] border border-[#F1F4FB] bg-[#BCC6DF]" style={{ clipPath: "polygon(0 8%, 100% 0, 100% 100%, 36% 100%, 0 84%)" }}>
        <div className="absolute left-[40px] top-[40px] flex h-[64px] w-[64px] items-center justify-center rounded-full border-[4px] border-double border-[#9EACC7] text-[13px] text-[#58657B]" aria-live="polite">{activeDirection ? "Active" : "Inactive"}</div>
        <div className="absolute left-[21px] top-[112px] h-[59px] w-[104px] -rotate-[20deg] rounded-full border border-[#9BAAC5] bg-[#AAB8D3]">
            <div className="absolute left-[6px] top-[10px] flex h-[41px] w-[41px] rotate-[20deg] items-center justify-center rounded-full bg-[linear-gradient(#F9FAFD,#CBD4E5)] text-[#9AAAC7]"><MoveVertical size={23} /></div>
            <div className="absolute right-[6px] top-[7px] flex h-[41px] w-[41px] rotate-[20deg] items-center justify-center rounded-full bg-[linear-gradient(#F9FAFD,#CBD4E5)] text-[#9AAAC7]"><CircleDot size={24} /></div>
        </div>
        {(Object.keys(arrows) as MovementDirection[]).map((direction) => <HoldArrow key={direction} direction={direction}
            enabled={!complete && (mode === "drive" || direction === (mode === "raise" ? "up" : "down"))}
            label={mode === "raise" && direction === "up" ? t("抬起机架", "Raise gantry") : mode === "lower" && direction === "down" ? t("机架落地", "Lower gantry") : t(directionLabels[direction][0], directionLabels[direction][1])}
            onHeldChange={(held) => { if (held) onDirectionChange(direction); else if (activeDirection === direction) onDirectionChange(null); }} />)}
    </div>;
}

export function MovementProgress({ value, down = false }: { value: number; down?: boolean }) {
    const t = useMovementText();
    return <div role="progressbar" aria-label={down ? t("机架落地模拟进度", "Lowering simulation progress") : t("机架抬起模拟进度", "Raising simulation progress")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className="absolute left-[29px] top-[98px] h-[235px] w-[47px] overflow-hidden rounded-[5px] border border-[#87928D] bg-[#838684]">
        <div className="absolute inset-x-0 bg-[#8FCB7C]" style={{ height: `${Math.max(7, value)}%`, ...(down ? { top: 0 } : { bottom: 0 }) }} />
        <span className={`absolute inset-x-0 text-center text-[10px] font-bold text-white ${down ? "top-0" : "bottom-0"}`}>{value}%</span>
    </div>;
}

export function MovementDialog({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const previous = document.activeElement;
        ref.current?.focus();
        return () => { if (previous instanceof HTMLElement) previous.focus(); };
    }, []);
    return <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#343B49]/40">
        <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} onKeyDown={(event) => {
            if (event.key === "Escape") { event.stopPropagation(); onClose(); }
            if (event.key !== "Tab") return;
            const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
            const first = buttons[0]; const last = buttons.at(-1);
            if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { event.preventDefault(); first?.focus(); }
        }} style={{ width: wide ? 820 : 600 }} className="overflow-hidden rounded-[7px] border border-[#8B99B1] bg-[#E5E8EE] text-[#343A45] shadow-xl outline-none">
            <h2 className="m-0 border-b border-[#A8B1C0] bg-[linear-gradient(#F4F5F7,#D4D9E2)] px-5 py-3 text-[20px] font-semibold">{title}</h2>
            <div className={wide ? "p-8" : "p-6"}>{children}</div>
        </div>
    </div>;
}
