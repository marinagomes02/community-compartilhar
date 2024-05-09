import { z } from 'zod';

const ACCEPTED_FILE_TYPES = "image/png, image/jpeg"

export const editUserProfile = z.object({
    displayName: z.string().min(3),
    email: z.string().email(),
    region: z.string(),
    isLookingForGroup: z.boolean(),
    communicationLink: z.string().url(),
    phoneNumber: z.string().min(3).max(20),
    aboutMe: z.string().max(1000),
    motivation: z.string().max(1000),
    job: z.string().max(100),
    birthDate: z.string().datetime(),
    completedCourse: z.boolean(),
    image: z.instanceof(File).refine((image) => {
        return ACCEPTED_FILE_TYPES.includes(image.type);
    }, 'File must be a a image of type .png or jpeg').optional(),
    imageUrl: z.string().optional()
    // skills, group
})
.refine((data) => data.image || data.imageUrl, {
    message: 'Image is required.',
    path: ['image'],
});;

export type EditUserProfileSchema = typeof editUserProfile;