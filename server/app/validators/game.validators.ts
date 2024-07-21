import { z } from "zod";


export const enableRadarSchema = z.object({
    radarId: z.number(),
    value: z.boolean(),
});