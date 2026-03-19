import { Product } from "../types/product.types";
import { api } from "@/src/shared/api/api-instanse";

type ProductType = Omit<Product, '_id'>

const productApi = {
    // Fetch all products, optionally filtered by subcategoryId
    getAllProducts: async (subcategoryId?: string) => {
        const params = subcategoryId ? { params: { subcategoryId } } : {};
        const response = await api.get<{ data: ProductType[] }>('/products', params);
        return response.data.data;
    },

    // Fetch a product by its id
    getProductById: async (id: string) => {
        const response = await api.get<{ data: ProductType }>(`/products/${id}`);
        return response.data.data;
    },

    // Create a new product (expects all required fields as per backend)
    createProduct: async (
        product: Omit<Product, "createdAt" | "updatedAt">
    ) => {
        const response = await api.post<{ data: ProductType }>('/products', product);
        return response.data.data;
    },

    // Update a product by id (partial update allowed)
    updateProduct: async (id: string, update: Partial<Product>) => {
        const response = await api.put<{ data: ProductType }>(`/products/${id}`, update);
        return response.data.data;
    },

    // Delete a product by id
    deleteProduct: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/products/${id}`);
        return response.data.message;
    },
}

export default productApi;