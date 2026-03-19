import { z } from "zod";

export const subcategorySchema = z.object({
    name: z.object({
        en: z.string().min(1),
        az: z.string().min(1),
        ru: z.string().min(1),
    }),
    category: z.string().min(1),
});

export type SubcategoryForm = z.infer<typeof subcategorySchema>;