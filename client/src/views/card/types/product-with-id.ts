import { Product } from "@/src/entities/product/types/product.types";

export type ProductWithId = Product & { _id?: string; id?: string };
