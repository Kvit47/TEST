import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters" }),
    bio: z.string().max(200, { message: "Bio must be at most 200 characters" }).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    sosialLinks: z.object({
        facebook: z.string().url({ message: "Enter a valid URL" }).or(z.literal("")).optional(),
        twitter: z.string().url({ message: "Enter a valid URL" }).or(z.literal("")).optional(),
        instagram: z.string().url({ message: "Enter a valid URL" }).or(z.literal("")).optional(),
    }).optional(),
});

export type UserSchema = z.infer<typeof userSchema>;