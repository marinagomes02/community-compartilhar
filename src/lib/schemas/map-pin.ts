import { z } from 'zod';

export const mapPinSchema = z.object({
	lng: z.number(),
	lat: z.number(),
	owner_type:  z.enum(['user', 'group', 'another'])
				.default('' as 'user'),
});

export type MapPinSchema = typeof mapPinSchema;
