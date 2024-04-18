import { z } from 'zod';

export const createEventSchema = z.object({
	title: z.string().min(5, { message: 'Title is required' }).max(100),
	description: z.string().min(5, { message: 'Description is required' }).max(500),
	image: z.string().min(1, { message: 'Image is required' }),
	tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
	date: z
		.string()
		.datetime({ message: 'Date is required' })
		// we're setting it optional so the user can clear the date and we don't run into
		// type issues, but we refine it to make sure it's not undefined
		.optional()
		.refine((date) => (date === undefined ? false : true), 'Please select a valid date.'),
	location: z.string().min(1, { message: 'Location is required' }),
});

export type CreateEventSchema = typeof createEventSchema;

export const deleteEventSchema = z.object({
	id: z.string(),
});

export type DeleteEventSchema = typeof deleteEventSchema;
