import { RadarEnabledResponse, RadarUpdateResponse, WeaponCaptureResponse, WeaponUnselectedResponse, WeaponLaunchedResponse, WeaponMoveCursorResponse } from "@shared/models/game.model";


export interface EventsMap {
    radarUpdate: RadarUpdateResponse;
    radarEnabled: RadarEnabledResponse;
    targetCaptured: WeaponCaptureResponse;
    targetUnselected: WeaponUnselectedResponse;
    weaponLaunched: WeaponLaunchedResponse;
    moveCursor: WeaponMoveCursorResponse
}
