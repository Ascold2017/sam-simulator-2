export interface Mission {
    id: number;
    name: string;
    map256: string;
    map1024: string;
}

export type GetMissionsResponse = Mission[]
export type GetMissionResponse = Mission;
