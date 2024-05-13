import { z } from 'zod';

const ACCEPTED_FILE_TYPES = "image/png, image/jpeg"

export const editUserProfileSchema = z.object({
    display_name: z.string().min(3).optional(),
    about_me: z.string().max(1000).optional(),
    motivation: z.string().max(1000).optional(),
    image: z.instanceof(File).refine((image) => {
        return ACCEPTED_FILE_TYPES.includes(image.type);
    }, 'File must be a a image of type .png or jpeg').optional(),
    image_url: z.string().optional(),
});

export type EditUserProfileSchema = typeof editUserProfileSchema;