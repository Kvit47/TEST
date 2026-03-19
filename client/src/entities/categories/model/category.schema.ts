import { z } from "zod";

export const categorySchema = z.object({
    name: z.object({
        en: z.string().min(1, { message: "Name is required" }),
        az: z.string().min(1, { message: "Name is required" }),
        ru: z.string().min(1, { message: "Name is required" }),
    }),
    image: z.string().min(1, { message: "Image is required" }),
});

export type CategoryForm = z.infer<typeof categorySchema>;