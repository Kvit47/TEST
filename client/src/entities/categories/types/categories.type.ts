export interface CategoryName {
    az: string;
    en: string;
    ru: string;
}

export interface Category {
    _id: string;
    name: CategoryName;
    image: string;
}

export type CategoryCreateType = {
    name: CategoryName;
    image: string;
};

export type CategoryUpdateType = {
    name?: CategoryName;
    image?: string;
};