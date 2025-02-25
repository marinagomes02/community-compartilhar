import { z } from 'zod';

export const createHowToSchema = z.object({
	title: z.string().min(5, { message: 'Title is required' }).max(100),
	description: z.string().min(5, { message: 'Description is required' }).max(500),
	image: z.string().min(1, { message: 'Image is required' }),
	tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
	difficulty: z
		.enum(['easy', 'medium', 'hard'], {
			errorMap: () => ({ message: 'Difficulty is required' }),
		})
		.default('' as 'easy'),
	duration: z
		.enum(['short', 'medium', 'long'], {
			errorMap: () => ({ message: 'Duration is required' }),
		})
		.default('' as 'short'),
	steps: z
		.array(
			z.object({
				title: z.string().min(5, { message: 'Title is required' }).max(100),
				description: z.string().min(5, { message: 'Description is required' }).max(500),
				image: z.string().min(1, { message: 'Image is required' }),
			})
		)
		.min(3, { message: 'At least 3 steps are required' })
		.default([
			{
				title: '',
				description: '',
				image: '',
			},
			{
				title: '',
				description: '',
				image: '',
			},
			{
				title: '',
				description: '',
				image: '',
			},
		]),
});
export type CreateHowToSchema = typeof createHowToSchema;

export const deleteHowToSchema = z.object({
	id: z.string(),
});
export type DeleteHowToSchema = typeof deleteHowToSchema;
