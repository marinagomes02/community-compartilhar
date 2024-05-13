import { z } from 'zod';
import validator from 'validator';

const ACCEPTED_FILE_TYPES = "image/png, image/jpeg"

export const editUserProfileSchema = z.object({
    display_name: z.string().min(3).optional(),
    about_me: z.string().max(1000).optional(),
    motivation: z.string().max(1000).optional(),
    image: z.instanceof(File).refine((image) => {
        return ACCEPTED_FILE_TYPES.includes(image.type);
    }, 'File must be a a image of type .png or jpeg').optional(),
    image_url: z.string().optional(),
    region: z.string().optional().nullable(),
    phone_number: z.string().startsWith('+').refine(
            validator.isMobilePhone, 
            { message: 'Invalid phone number - can\'t contain symbols, spaces or letter' })
        .optional().nullable(),
    job: z.string().max(100).optional(),
    birth_date: z.string().optional(),
    show_link: z.boolean(),
    completed_course: z.boolean(),
    looking_for_group: z.boolean(),
});

export type EditUserProfileSchema = typeof editUserProfileSchema;