import { z } from "zod";


export const enableRadarSchema = z.object({
    radarGameId: z.string(),
    value: z.boolean(),
});