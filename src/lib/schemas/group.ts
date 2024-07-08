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
    completed_state_old: z.boolean(),
})

export const groupSearchRequestSchema = z.object({
    max_dist:z.string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Distância deve ser um número inteiro maior que 0"
    }),
    region: z.string(),
    available_period: z.string()
        .refine((val) => !Number.isNaN(parseInt(val, 10)), {
            message: "Período deve ser um número inteiro maior que 0"
        }),
    responsibilities: z.array(z.string()).min(1),
})

export const editGroupSearchRequestSchema = z.object({
    id: z.string(),
    max_dist:z.string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Distância deve ser um número inteiro maior que 0"
    }),
    region: z.string(),
    available_period: z.string()
        .refine((val) => !Number.isNaN(parseInt(val, 10)), {
            message: "Período deve ser um número inteiro maior que 0"
        }),
    responsibilities: z.array(z.string()).min(1),
    possible_group_id: z.string().nullable(),
})

export const deleteGroupSearchRequestSchema = z.object({
    request_id: z.string(),
    possible_group_id: z.string(),
});

export type CreateGroupSchema = typeof createGroupSchema;
export type EditGroupSchema = typeof editGroupSchema;
export type GroupSearchRequestSchema = typeof groupSearchRequestSchema;
export type EditGroupSearchRequestSchema = typeof editGroupSearchRequestSchema;
export type DeleteGroupSearchRequestSchema = typeof deleteGroupSearchRequestSchema;