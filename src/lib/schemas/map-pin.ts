import { z } from 'zod';

export const mapPinSchema = z.object({
	lng: z.number(),
	lat: z.number(),
	owner_type:  z.enum(['user', 'group', 'another'])
				.default('' as 'user'),
	has_pin: z.boolean()
});

export const removeMapPinSchema = z.object({
	owner_type: z.enum(['user', 'group', 'another']),
});

export const mapGroupPinSchema = z.object({
	lng: z.number(),
	lat: z.number(),
	group_id: z.string().nullable(),
	has_pin: z.boolean().default(false),
});

export const removeMapGroupPinSchema = z.object({
	group_id: z.string().nullable(),
});

export type MapPinSchema = typeof mapPinSchema;
export type RemoveMapPinSchema = typeof removeMapPinSchema;
export type MapGroupPinSchema = typeof mapGroupPinSchema;
export type RemoveMapGroupPinSchema = typeof removeMapGroupPinSchema;
