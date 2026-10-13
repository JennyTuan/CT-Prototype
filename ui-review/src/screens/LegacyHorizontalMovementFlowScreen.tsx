import { useState } from "react";
import { Check } from "lucide-react";
import LegacyVerticalCTHomeScreen from "./LegacyVerticalCTHomeScreen";
import LegacyHorizontalMovementDisconnectScreen from "./LegacyHorizontalMovementDisconnectScreen";
import LegacyHorizontalMovementRotateScreen from "./LegacyHorizontalMovementRotateScreen";
import LegacyHorizontalMovementCableScreen from "./LegacyHorizontalMovementCableScreen";
import LegacyHorizontalMovementRaiseScreen from "./LegacyHorizontalMovementRaiseScreen";
import LegacyHorizontalMovementDriveScreen from "./LegacyHorizontalMovementDriveScreen";
import LegacyHorizontalMovementLowerScreen from "./LegacyHorizontalMovementLowerScreen";
import { MovementDialog } from "./legacyMovementShared";
import { MovementLanguageContext } from "../lib/movementPrototype";
import type { MovementLanguage } from "../lib/movementPrototype";

const pages = [LegacyHorizontalMovementDisconnectScreen, LegacyHorizontalMovementRotateScreen, LegacyHorizontalMovementCableScreen, LegacyHorizontalMovementRaiseScreen, LegacyHorizontalMovementDriveScreen, LegacyHorizontalMovementLowerScreen];
const verticalSteps = [1, 4, 5];
const secondaryButton = "min-w-[86px] rounded-[3px] border border-[#A8B0BC] bg-[linear-gradient(#F8F9FB,#DDE1E7)] px-5 py-2 text-[14px] text-[#4E5662]";
const primaryButton = "min-w-[86px] rounded-[3px] border border-[#75AA61] bg-[linear-gradient(#A5D78A,#82BA69)] px-5 py-2 text-[14px] font-semibold text-white";
type Props = { initialStep?: number; initialDialog?: "mode" | "continue"; language?: MovementLanguage; onHome?: () => void };

function MovementActionImage({ action }: { action: "lower" | "vertical" }) {
    return <span className="relative block h-[208px] w-[230px] shrink-0 overflow-hidden" aria-hidden="true">
        <img
            src={action === "lower" ? "/movement/lower-entry-reference.jpg" : "/movement-mode-vertical-device.png"}
            alt=""
            draggable={false}
            className={action === "lower"
                ? "absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                : "absolute -left-[46px] -top-[22px] h-[250px] w-[322px] max-w-none"}
        />
    </span>;
}

export default function LegacyHorizontalMovementFlowScreen({ initialStep = -1, initialDialog, language = "zh", onHome }: Props) {
    const [step, setStep] = useState(initialDialog === "continue" ? 4 : initialStep);
    const [dialog, setDialog] = useState<"mode" | "continue" | "complete" | null>(initialDialog ?? null);
    const [mode, setMode] = useState<"horizontal" | "vertical">("horizontal");
    const [verticalMovement, setVerticalMovement] = useState(false);
    const t = (zh: string, en: string) => language === "en" ? en : zh;
    const Page = pages[step];
    const returnHome = () => { setDialog(null); setVerticalMovement(false); setMode("horizontal"); if (onHome) onHome(); else setStep(-1); };
    const goBack = () => {
        if (verticalMovement && step === 1) {
            setVerticalMovement(false);
            setStep(4);
            setDialog("continue");
        } else if (verticalMovement) {
            setStep(verticalSteps[verticalSteps.indexOf(step) - 1]);
        } else if (step === 5) {
            setStep(4);
            setDialog("continue");
        } else if (step === 0) returnHome();
        else setStep(step - 1);
    };
    const goNext = () => {
        if (step === 0) { setMode("horizontal"); setDialog("mode"); }
        else if (step === 4 && !verticalMovement) setDialog("continue");
        else if (step === 5) setDialog("complete");
        else if (verticalMovement) setStep(verticalSteps[verticalSteps.indexOf(step) + 1]);
        else setStep(step + 1);
    };

    return <MovementLanguageContext.Provider value={language}>
        <div className="relative h-[768px] w-[1024px]" lang={language === "en" ? "en" : "zh-CN"}>
            {step === -1 ? <LegacyVerticalCTHomeScreen language={language} onOpenMovement={() => setStep(0)} /> : <Page verticalMovement={verticalMovement} sequenceStep={verticalMovement ? verticalSteps.indexOf(step) + 1 : undefined} onBack={goBack} onNext={goNext} />}
            {dialog === "continue" && <MovementDialog title={t("选择下一步", "Choose next action")} onClose={() => setDialog(null)}>
                <div className="grid grid-cols-2 gap-5">
                    {(["lower", "vertical"] as const).map((action) => <button
                        key={action}
                        type="button"
                        onClick={() => {
                            setDialog(null);
                            if (action === "lower") setStep(5);
                            else { setVerticalMovement(true); setStep(1); }
                        }}
                        className="flex h-[280px] flex-col items-center justify-center gap-4 rounded-[6px] border border-[#ACBCD1] bg-[linear-gradient(#FFFFFF,#F1F4F8)] px-3 py-4 text-[#384F70] shadow-[inset_0_1px_0_#FFFFFF] transition-colors hover:border-[#668FCC] hover:bg-[linear-gradient(#FFFFFF,#E4EDF9)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#4778B9] active:bg-[#D9E6F7]"
                    >
                        <MovementActionImage action={action} />
                        <span className="text-[18px] font-semibold leading-6">{action === "lower" ? t("机架落地", "Lower gantry") : t("进入垂直移动", "Vertical movement")}</span>
                    </button>)}
                </div>
            </MovementDialog>}
            {dialog === "complete" && <MovementDialog title={verticalMovement ? t("垂直移动完成", "Vertical movement complete") : t("移动完成", "Movement complete")} onClose={() => setDialog(null)}>
                <p className="text-[18px] leading-relaxed text-[#384A66]">{t("机架已落地，移动模拟流程已完成。", "The gantry is lowered. The movement simulation is complete.")}</p>
                <div className="mt-7 flex justify-end"><button type="button" className={primaryButton} onClick={returnHome}>{t("返回首页", "Return home")}</button></div>
            </MovementDialog>}
            {dialog === "mode" && <MovementDialog wide title={t("选择行走模式", "Select movement mode")} onClose={() => setDialog(step === 5 ? "continue" : null)}>
                <p className="mb-5 text-[18px] leading-relaxed text-[#657487]">{t("请确认扫描环与底部轨道的相对位置，并选择本次行走方式。", "Confirm the scan ring’s position relative to the base rail, then select a movement mode.")}</p>
                <div className="flex gap-4">
                    {(["horizontal", "vertical"] as const).map((option) => {
                        const selected = mode === option;
                        return <button key={option} type="button" aria-pressed={selected} onClick={() => setMode(option)} className="relative flex h-[294px] flex-1 flex-col items-center justify-center rounded-[5px] border p-3" style={{ borderColor: selected ? "#7A9FE2" : "#B1B9C8", color: selected ? "#3569AD" : "#566273", background: selected ? "linear-gradient(#E5EDFA,#D0DDF3)" : "linear-gradient(#F4F5F7,#DFE2E8)" }}>
                            <span className="absolute right-3 top-3 flex h-[18px] w-[18px] items-center justify-center rounded-full border" style={{ background: selected ? "#729DDD" : "#F8FAFC", borderColor: selected ? "#729DDD" : "#B6C1D2" }}>{selected && <Check size={13} strokeWidth={3} className="text-white" />}</span>
                            <span aria-hidden="true" className="relative mb-3 block h-[168px] w-[240px] shrink-0 overflow-hidden">
                                <img
                                    src={option === "horizontal" ? "/movement/mode-parallel-transparent.png" : "/movement-mode-vertical-device.png"}
                                    alt=""
                                    draggable={false}
                                    className={option === "horizontal"
                                        ? "absolute inset-0 h-full w-full object-contain"
                                        : "absolute -top-[16px] left-0 h-auto w-[240px] max-w-none"}
                                />
                            </span>
                            <span className="text-[24px] font-semibold">{option === "horizontal" ? t("平行移动", "Parallel movement") : t("垂直移动", "Vertical movement")}</span>
                            <span className="mt-2 text-center text-[16px] leading-snug text-[#7B8798]">{option === "horizontal" ? t("扫描环与底部轨道平行", "Scan ring parallel to the base rail") : t("扫描环与底部轨道垂直（90°）", "Scan ring perpendicular to the base rail (90°)")}</span>
                        </button>;
                    })}
                </div>
                {mode === "vertical" && <p className="mt-3 text-[12px] text-[#737F91]">{t("仅演示模式选择，确认后返回首页。", "Mode selection preview only. Confirm to return home.")}</p>}
                <div className="mt-5 flex justify-end gap-2"><button type="button" className={secondaryButton} onClick={() => setDialog(step === 5 ? "continue" : null)}>{t("取消", "Cancel")}</button><button type="button" className={primaryButton} onClick={() => { if (mode === "vertical") returnHome(); else { setDialog(null); setStep(1); } }}>{t("确认", "Confirm")}</button></div>
            </MovementDialog>}
        </div>
    </MovementLanguageContext.Provider>;
}
