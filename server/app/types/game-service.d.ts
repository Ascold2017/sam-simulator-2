import { Radar, RadarObject, Weapon } from "../../core";

export interface GameRadar {
    id: number;
    entity: Radar;
}

export interface GameWeapon {
    id: number;
    entity: Weapon;
}

export interface RadarUpdatePayload {
    radarId: number;
    radarName: string;
    radarObjects: RadarObject[];
}

export interface EventsMap {
    radarUpdate: RadarUpdatePayload;
}
