import { z } from 'zod';

export const acceptGroupRequestSchema = z.object({
  group_id: z.string(),
});

export const rejectGroupRequestSchema = z.object({
  group_id: z.string(),
});

export type AcceptGroupRequestForm = typeof acceptGroupRequestSchema;
export type RejectGroupRequestForm = typeof rejectGroupRequestSchema;
