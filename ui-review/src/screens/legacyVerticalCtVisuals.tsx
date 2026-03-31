import {
    Accessibility,
    Cpu,
    MoveVertical,
    ScanLine,
    Settings2,
    ShieldAlert,
    UserRound,
    Wrench,
} from "lucide-react";

type ToolbarKind = "emergency" | "laser" | "machine" | "system";

const toolbarIconMap = {
    emergency: ShieldAlert,
    laser: ScanLine,
    machine: Cpu,
    system: Settings2,
} satisfies Record<ToolbarKind, React.ElementType>;

export function LegacyToolbarIcon({
    kind,
    alt,
    left,
}: {
    kind: ToolbarKind;
    alt: string;
    left: number;
}) {
    const Icon = toolbarIconMap[kind];

    return (
        <div
            className="absolute top-[16px] flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#AAB9D3] bg-[linear-gradient(180deg,#EEF2FA_0%,#D5DEEF_100%)] text-[#5874A2] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_2px_4px_rgba(93,108,136,0.15)]"
            style={{ left }}
            aria-label={alt}
            title={alt}
        >
            <Icon size={19} strokeWidth={2.1} />
        </div>
    );
}

export function LegacyPatientAvatar({ alt }: { alt: string }) {
    return (
        <div className="absolute left-[4px] top-[8px] flex h-[29.818px] w-[31.552px] items-center justify-center rounded-[10px] border border-[#A7B8D7] bg-[linear-gradient(180deg,#F4F7FD_0%,#DCE4F3_100%)] text-[#627EA9] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <UserRound size={18} strokeWidth={2} aria-label={alt} />
        </div>
    );
}

export function LegacyHorizontalModeIllustration() {
    return (
        <div className="absolute left-[96px] top-[30px] h-[120px] w-[140px]">
            <div className="absolute left-[8px] top-[4px] h-[22px] w-[124px] rounded-[10px] border border-[#D8E3F7] bg-[linear-gradient(180deg,#F7FBFF_0%,#DDE8FA_100%)] shadow-[0_4px_10px_rgba(41,78,145,0.12)]" />
            <div className="absolute left-[22px] top-[26px] h-[72px] w-[16px] rounded-full bg-[linear-gradient(180deg,#B8C9E8_0%,#6B83B0_100%)]" />
            <div className="absolute right-[22px] top-[26px] h-[72px] w-[16px] rounded-full bg-[linear-gradient(180deg,#B8C9E8_0%,#6B83B0_100%)]" />
            <div className="absolute left-[34px] top-[56px] h-[20px] w-[72px] rounded-full bg-[linear-gradient(180deg,#D6DEEB_0%,#A7B4CA_100%)] shadow-[0_8px_14px_rgba(69,83,109,0.2)]" />
            <div className="absolute left-[59px] top-[63px] h-[10px] w-[30px] rounded-full bg-[linear-gradient(180deg,#8F9CB2_0%,#68758C_100%)]" />
        </div>
    );
}

export function LegacyVerticalModeIllustration() {
    return (
        <div className="absolute left-[116px] top-[28px] flex h-[110px] w-[100px] items-center justify-center rounded-[18px] border border-[#D8E3F7] bg-[linear-gradient(180deg,#F8FBFF_0%,#DCE6F6_100%)] text-[#5471A0] shadow-[0_8px_20px_rgba(53,89,150,0.12)]">
            <MoveVertical size={44} strokeWidth={2.1} />
        </div>
    );
}

export function LegacyServiceModeIllustration() {
    return (
        <div className="absolute left-[116px] top-[28px] flex h-[110px] w-[100px] items-center justify-center rounded-[18px] border border-[#D8E3F7] bg-[linear-gradient(180deg,#F8FBFF_0%,#DCE6F6_100%)] text-[#5B6F93] shadow-[0_8px_20px_rgba(53,89,150,0.12)]">
            <Wrench size={42} strokeWidth={2.1} />
        </div>
    );
}

export function LegacyPoseIllustrationCard({ label }: { label: string }) {
    return (
        <div className="relative flex h-[176px] w-[260px] items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-[#AEB7C7] bg-[linear-gradient(180deg,#E5E9F2_0%,#D7DCE7_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]">
            <div className="flex h-[72px] w-[128px] items-center justify-center rounded-[8px] border border-[#C2CAD8] bg-[rgba(248,250,255,0.82)] text-[12px] font-semibold tracking-[0.08em] text-[#77829A]">
                {label}
            </div>
            <Accessibility size={40} className="absolute right-[18px] top-[18px] text-[#90A0B8]" strokeWidth={1.8} />
        </div>
    );
}
