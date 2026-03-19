export type Product = {
    name: {
        az: string;
        en: string;
        ru: string;
    };
    price: number;
    description: {
        az: string;
        en: string;
        ru: string;
    };
    image?: string;
    images?: string[];
    variants?: {
        color: string;
        size: string;
        stock: number;
    }[];
    subcategoryId: string;
    quantity: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    /** Show "pre-order" badge on card */
    preOrder?: boolean;
    /** ISO 4217 currency code for price formatting (e.g. EUR, AZN) */
    currency?: string;
};