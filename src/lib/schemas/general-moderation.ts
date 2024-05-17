import { z } from 'zod';

export const communicationLinkSchema = z.object({
    community_link: z.string().optional()
});

export type CommunicationLinkSchema = typeof communicationLinkSchema;