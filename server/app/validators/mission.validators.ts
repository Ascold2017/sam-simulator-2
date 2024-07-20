import { z } from "zod";

export const createMissionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lat: z.number(),
    lon: z.number(),
    environments: z.array(
        z.object({
            name: z.string().min(1, "Environment name is required"),
            type: z.enum(["radar", "sam"]),
            position: z.object({
                x: z.number(),
                y: z.number(),
                z: z.number(),
            }),
            radarId: z.number().optional(),
            weaponId: z.number().optional(),
        }),
    ),
    tasks: z.array(
        z.object({
            name: z.string().min(1, "Task name is required"),
            delay: z.number().min(0, "Delay must be a positive number"),
            points: z.array(
                z.object({
                    x: z.number(),
                    y: z.number(),
                    z: z.number(),
                    v: z.number(),
                }),
            ),
            flightObjectTypeId: z.number(),
        }),
    ),
});
