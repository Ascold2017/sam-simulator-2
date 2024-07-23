import { RadarEnabledResponse, RadarUpdateResponse } from "@shared/models/game.model";


export interface EventsMap {
    radarUpdate: RadarUpdateResponse;
    radarEnabled: RadarEnabledResponse;
}
