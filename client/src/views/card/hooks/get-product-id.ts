import { ProductWithId } from "../types/product-with-id";

export function getProductId(p: ProductWithId): string {
    return (p as { _id?: string })._id ?? (p as { id?: string }).id ?? "";
  }
  