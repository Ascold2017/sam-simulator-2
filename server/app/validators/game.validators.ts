import { z } from "zod";

export const loadMissionSchema = z.object({
    id: z.number(),
});

export const enableRadarSchema = z.object({
    id: z.number(),
    value: z.boolean(),
});