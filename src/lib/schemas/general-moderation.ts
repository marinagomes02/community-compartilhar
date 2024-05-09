import { z } from 'zod';

export const communicationLinkSchema = z.object({
    link: z.string().min(5, { message: 'Link is required'})
});

export type CommunicationLinkSchema = typeof communicationLinkSchema;