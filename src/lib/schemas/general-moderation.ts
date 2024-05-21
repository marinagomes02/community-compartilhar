import { z } from 'zod';

export const communicationLinkSchema = z.object({
    community_link: z.string().url().max(100).optional()
});

export type CommunicationLinkSchema = typeof communicationLinkSchema;