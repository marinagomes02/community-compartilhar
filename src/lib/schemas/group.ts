import { z } from "zod";

export const createGroupSchema = z.object({
    name: z.string().min(3).max(30),
    members: z.array(z.string()),
    leader: z.string(),
    is_complete: z.boolean(),
    is_current_sponsor: z.boolean(),
    region: z.string().max(30),
})

export const editGroupSchema = z.object({
    id: z.string(),
    name: z.string().min(3).max(30),
    members: z.array(z.string()).min(1),
    leader: z.string(),
    is_complete: z.boolean(),
    is_current_sponsor: z.boolean(),
    region: z.string().max(30),
    current_members: z.array(z.string()),
    completed_state_old: z.boolean(),
    leader_old: z.string(),
    is_current_sponsor_old: z.boolean(),
})

export const searchUserSchema = z.object({
    filter: z.string().min(3),
});

export type CreateGroupSchema = typeof createGroupSchema;
export type EditGroupSchema = typeof editGroupSchema;
export type SearchUserSchema = typeof searchUserSchema;