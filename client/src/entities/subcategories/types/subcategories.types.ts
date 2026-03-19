export interface SubcategoryName {
  en: string;
  ru: string;
  az: string;
}

export interface Subcategory {
  name: SubcategoryName;
  categoryId: string;
}

export type SubcategoryCreateType = {
  name: SubcategoryName;
  categoryId: string;
}

export type SubcategoryUpdateType = {
  name?: SubcategoryName;
  categoryId?: string;
}
