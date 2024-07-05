import { z } from "zod";

export const setLanguagePreferenceSchema = z.object({
    language: z.string(),
});

export type SetLanguagePreferenceSchema = typeof setLanguagePreferenceSchema;