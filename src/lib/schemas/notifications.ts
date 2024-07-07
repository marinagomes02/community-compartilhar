import { z } from "zod";

export const markAsReadSchema = z.object({
    notification_ids: z.array(z.string())
});

export type MarkAsReadSchema = typeof markAsReadSchema;