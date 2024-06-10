import { z } from 'zod';

export const acceptGroupRequestSchema = z.object({
  groupId: z.string(),
});

export const rejectGroupRequestSchema = z.object({
  groupId: z.string(),
});

export type AcceptGroupRequestForm = typeof acceptGroupRequestSchema;
export type RejectGroupRequestForm = typeof rejectGroupRequestSchema;
