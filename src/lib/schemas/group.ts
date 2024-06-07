import { z } from "zod";

export const createGroupSchema = z.object({
    name: z.string().min(3).max(30),
    members: z.string(),
    leader: z.string().email("Leader email is incorrect"),
    is_complete: z.boolean(),
    is_current_sponsor: z.boolean(),
    region: z.string().max(30),
})

export const editGroupSchema = z.object({
    id: z.string(),
    name: z.string().min(3).max(30),
    members: z.string(),
    leader: z.string().email("Leader email is incorrect"),
    is_complete: z.boolean(),
    is_current_sponsor: z.boolean(),
    region: z.string().max(30),
    current_members: z.string(),
})

export type CreateGroupSchema = typeof createGroupSchema;
export type EditGroupSchema = typeof editGroupSchema;