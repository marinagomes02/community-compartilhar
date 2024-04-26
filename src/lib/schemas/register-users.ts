import { z } from 'zod';

const ACCEPTED_FILE_TYPES = "text/csv"

export const registerUsersSchema = z.object({
    file: z.instanceof(File).refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
      }, 'File must be a .csv')
});

export type RegisterUsersSchema = typeof registerUsersSchema;
