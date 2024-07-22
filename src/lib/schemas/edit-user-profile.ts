import { z } from 'zod';
import validator from 'validator';

const ACCEPTED_FILE_TYPES = "image/png, image/jpeg"

export const editUserProfileSchema = z.object({
    display_name: z.string().min(3).max(30).optional(),
    about_me: z.string().max(1000).optional(),
    motivation: z.string().max(1000).optional(),
    image: z.instanceof(File).refine((image) => {
        return ACCEPTED_FILE_TYPES.includes(image.type);
    }, 'File must be a a image of type .png or jpeg').optional(),
    image_url: z.string().max(200).optional().nullable(),
    region: z.string().max(30).optional(),
    phone_number: z.string().max(20).startsWith('+').refine(
            validator.isMobilePhone, 
            { message: 'Invalid phone number - can\'t contain symbols, spaces or letter' })
        .optional(),
    job: z.string().max(100).optional(),
    birth_date: z.string().optional().nullable(),
    show_link: z.boolean(),
    completed_course: z.boolean(),
    sponsorship_state: z.enum(['no_group', 'looking_for_group', 'has_group']),
    sponsorship_state_old: z.enum(['no_group', 'looking_for_group', 'has_group']),
    is_profile_filled_before: z.boolean(),
    completed_course_before: z.boolean(),
});

export type EditUserProfileSchema = typeof editUserProfileSchema;