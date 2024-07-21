import { RadarUpdateResponse } from "@shared/models/game.model";
import { Radar, RadarObject, Weapon } from "../../core";

export interface GameRadar {
    id: number;
    entity: Radar;
}

export interface GameWeapon {
    id: number;
    entity: Weapon;
}

export interface EventsMap {
    radarUpdate: RadarUpdateResponse;
}
