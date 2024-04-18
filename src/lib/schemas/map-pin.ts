import { z } from 'zod';

export const mapPinSchema = z.object({
	lng: z.number(),
	lat: z.number(),
});

export type MapPinSchema = typeof mapPinSchema;
