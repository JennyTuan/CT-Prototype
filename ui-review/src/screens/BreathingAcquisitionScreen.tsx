import ScoutScanScreen from "./ScoutScanScreen";

const BreathingAcquisitionScreen = () => {
    return (
        <ScoutScanScreen
            firstStepLabel={String.fromCharCode(0x547c, 0x5438, 0x91c7, 0x96c6)}
            bottomPanelMode="breathing"
            viewportBgClassName="bg-white"
            breathingWorkflowVariant="acquisition"
        />
    );
};

export default BreathingAcquisitionScreen;
