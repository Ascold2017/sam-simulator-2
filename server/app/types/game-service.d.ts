import { Radar, RadarObject, Weapon } from "../../core";
import { RadarObjectDTO } from "../dto/radarObject.dto";

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
    radarObjects: RadarObjectDTO[];
}

export interface EventsMap {
    radarUpdate: RadarUpdatePayload;
}
