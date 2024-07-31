import { z } from "zod";


export const enableRadarSchema = z.object({
    radarGameId: z.string(),
    value: z.boolean(),
});

export const captureTargetSchema = z.object({
    weaponGameId: z.string(),
    azimuth: z.number(),
    elevation: z.number(),
    distance: z.number()
})

export const resetTargetSchema = z.object({
    weaponGameId: z.string(),
})

export const fireTargetSchema = z.object({
    weaponGameId: z.string(),
    method: z.string(),
})