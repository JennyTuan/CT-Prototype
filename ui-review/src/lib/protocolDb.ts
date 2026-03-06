import Dexie, { type Table } from "dexie";

export type RawProtocol = {
    id: string;
    name: string;
    region: string;
    scanLocationLabel: string;
    supportedPositions: string[];
    supportedModes: string[];
};

export type RawRecon = {
    id: string;
    name: string;
    params: Record<string, string | number | boolean>;
};

export type RawSequence = {
    id: string;
    name: string;
    sequenceType: string;
    mode: string;
    scanParams: Record<string, string | number | boolean>;
    reconstructionParams: RawRecon[];
};

export type RawProtocolCase = {
    protocol: RawProtocol;
    sequences: RawSequence[];
};

type ProtocolRow = {
    id?: number;
    protocolId: string;
    name: string;
    region: string;
    scanLocationLabel: string;
    supportedPositionsJson: string;
    supportedModesJson: string;
};

type SequenceRow = {
    id?: number;
    protocolId: string;
    sequenceId: string;
    name: string;
    sequenceType: string;
    mode: string;
    scanParamsJson: string;
};

type ReconstructionRow = {
    id?: number;
    protocolId: string;
    sequenceId: string;
    reconId: string;
    name: string;
    paramsJson: string;
};

class ProtocolDb extends Dexie {
    protocols!: Table<ProtocolRow, number>;
    sequences!: Table<SequenceRow, number>;
    reconstructions!: Table<ReconstructionRow, number>;

    constructor() {
        super("ct_protocol_db");
        this.version(1).stores({
            protocols: "++id,&protocolId,name,region",
            sequences: "++id,[protocolId+sequenceId],protocolId,sequenceId,mode",
            reconstructions: "++id,[protocolId+sequenceId+reconId],protocolId,sequenceId,reconId",
        });
    }
}

export const protocolDb = new ProtocolDb();

export const seedProtocolCasesIfEmpty = async (cases: RawProtocolCase[]): Promise<void> => {
    const count = await protocolDb.protocols.count();
    if (count > 0) return;

    await protocolDb.transaction("rw", protocolDb.protocols, protocolDb.sequences, protocolDb.reconstructions, async () => {
        const protocolRows: ProtocolRow[] = cases.map(({ protocol }) => ({
            protocolId: protocol.id,
            name: protocol.name,
            region: protocol.region,
            scanLocationLabel: protocol.scanLocationLabel,
            supportedPositionsJson: JSON.stringify(protocol.supportedPositions),
            supportedModesJson: JSON.stringify(protocol.supportedModes),
        }));
        await protocolDb.protocols.bulkAdd(protocolRows);

        const sequenceRows: SequenceRow[] = [];
        const reconRows: ReconstructionRow[] = [];
        for (const protocolCase of cases) {
            for (const sequence of protocolCase.sequences) {
                sequenceRows.push({
                    protocolId: protocolCase.protocol.id,
                    sequenceId: sequence.id,
                    name: sequence.name,
                    sequenceType: sequence.sequenceType,
                    mode: sequence.mode,
                    scanParamsJson: JSON.stringify(sequence.scanParams),
                });

                for (const recon of sequence.reconstructionParams) {
                    reconRows.push({
                        protocolId: protocolCase.protocol.id,
                        sequenceId: sequence.id,
                        reconId: recon.id,
                        name: recon.name,
                        paramsJson: JSON.stringify(recon.params),
                    });
                }
            }
        }

        if (sequenceRows.length > 0) {
            await protocolDb.sequences.bulkAdd(sequenceRows);
        }
        if (reconRows.length > 0) {
            await protocolDb.reconstructions.bulkAdd(reconRows);
        }
    });
};

export const loadProtocolCasesFromDb = async (): Promise<RawProtocolCase[]> => {
    const [protocolRows, sequenceRows, reconRows] = await Promise.all([
        protocolDb.protocols.toArray(),
        protocolDb.sequences.toArray(),
        protocolDb.reconstructions.toArray(),
    ]);

    return protocolRows.map((protocolRow) => {
        const protocolSequences = sequenceRows.filter((row) => row.protocolId === protocolRow.protocolId);

        const sequences: RawSequence[] = protocolSequences.map((sequenceRow) => {
            const reconstructions = reconRows
                .filter((row) => row.protocolId === sequenceRow.protocolId && row.sequenceId === sequenceRow.sequenceId)
                .map((row) => ({
                    id: row.reconId,
                    name: row.name,
                    params: JSON.parse(row.paramsJson) as Record<string, string | number | boolean>,
                }));

            return {
                id: sequenceRow.sequenceId,
                name: sequenceRow.name,
                sequenceType: sequenceRow.sequenceType,
                mode: sequenceRow.mode,
                scanParams: JSON.parse(sequenceRow.scanParamsJson) as Record<string, string | number | boolean>,
                reconstructionParams: reconstructions,
            };
        });

        return {
            protocol: {
                id: protocolRow.protocolId,
                name: protocolRow.name,
                region: protocolRow.region,
                scanLocationLabel: protocolRow.scanLocationLabel,
                supportedPositions: JSON.parse(protocolRow.supportedPositionsJson) as string[],
                supportedModes: JSON.parse(protocolRow.supportedModesJson) as string[],
            },
            sequences,
        };
    });
};

export const createProtocolCase = async (protocolCase: RawProtocolCase): Promise<void> => {
    await protocolDb.transaction("rw", protocolDb.protocols, protocolDb.sequences, protocolDb.reconstructions, async () => {
        await protocolDb.protocols.add({
            protocolId: protocolCase.protocol.id,
            name: protocolCase.protocol.name,
            region: protocolCase.protocol.region,
            scanLocationLabel: protocolCase.protocol.scanLocationLabel,
            supportedPositionsJson: JSON.stringify(protocolCase.protocol.supportedPositions),
            supportedModesJson: JSON.stringify(protocolCase.protocol.supportedModes),
        });

        if (protocolCase.sequences.length > 0) {
            await protocolDb.sequences.bulkAdd(
                protocolCase.sequences.map((sequence) => ({
                    protocolId: protocolCase.protocol.id,
                    sequenceId: sequence.id,
                    name: sequence.name,
                    sequenceType: sequence.sequenceType,
                    mode: sequence.mode,
                    scanParamsJson: JSON.stringify(sequence.scanParams),
                }))
            );

            const reconRows: ReconstructionRow[] = [];
            for (const sequence of protocolCase.sequences) {
                for (const recon of sequence.reconstructionParams) {
                    reconRows.push({
                        protocolId: protocolCase.protocol.id,
                        sequenceId: sequence.id,
                        reconId: recon.id,
                        name: recon.name,
                        paramsJson: JSON.stringify(recon.params),
                    });
                }
            }
            if (reconRows.length > 0) {
                await protocolDb.reconstructions.bulkAdd(reconRows);
            }
        }
    });
};

export const updateProtocolMeta = async (
    protocolId: string,
    patch: Partial<Pick<RawProtocol, "name" | "region" | "scanLocationLabel" | "supportedPositions" | "supportedModes">>
): Promise<void> => {
    const row = await protocolDb.protocols.where("protocolId").equals(protocolId).first();
    if (!row || row.id === undefined) return;

    await protocolDb.protocols.update(row.id, {
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.region !== undefined ? { region: patch.region } : {}),
        ...(patch.scanLocationLabel !== undefined ? { scanLocationLabel: patch.scanLocationLabel } : {}),
        ...(patch.supportedPositions !== undefined ? { supportedPositionsJson: JSON.stringify(patch.supportedPositions) } : {}),
        ...(patch.supportedModes !== undefined ? { supportedModesJson: JSON.stringify(patch.supportedModes) } : {}),
    });
};

export const deleteProtocolCase = async (protocolId: string): Promise<void> => {
    await protocolDb.transaction("rw", protocolDb.protocols, protocolDb.sequences, protocolDb.reconstructions, async () => {
        await protocolDb.protocols.where("protocolId").equals(protocolId).delete();
        await protocolDb.sequences.where("protocolId").equals(protocolId).delete();
        await protocolDb.reconstructions.where("protocolId").equals(protocolId).delete();
    });
};
