import { z } from 'zod';

export const acceptPossibleGroupSchema = z.object({
  possible_group_id: z.string(),
});

export const rejectPossibleGroupSchema = z.object({
  possible_group_id: z.string(),
});

export type AcceptPossibleGroupSchema = typeof acceptPossibleGroupSchema;
export type RejectPossibleGroupSchema = typeof rejectPossibleGroupSchema;