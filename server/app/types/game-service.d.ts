import { RadarUpdateResponse,  WeaponUpdateResponse } from "@shared/models/game.model";


export interface EventsMap {
    radarUpdate: RadarUpdateResponse;
    weaponUpdate: WeaponUpdateResponse;
}
