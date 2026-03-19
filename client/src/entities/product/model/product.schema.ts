import { z } from "zod";

const localizedStringSchema = z.object({
  az: z.string().min(1, "Required"),
  en: z.string().min(1, "Required"),
  ru: z.string().min(1, "Required"),
});

const variantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  stock: z.number().min(0, "Stock must be 0 or more"),
});

export const productSchema = z.object({
  name: localizedStringSchema,
  price: z.number().min(0, "Price must be 0 or more"),
  description: localizedStringSchema,
  image: z.string().min(1, "Main image URL is required"),
  images: z.array(z.object({ url: z.string().min(1, "URL is required") })).optional(),
  variants: z.array(variantSchema).optional(),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  preOrder: z.boolean().optional(),
  currency: z.string().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
