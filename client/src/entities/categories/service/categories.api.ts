

import { api } from "@/src/shared/api/api-instanse";
import { Category, CategoryCreateType, CategoryUpdateType } from "../types/categories.type";

const categoryApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: CategoryCreateType): Promise<Category> => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },

  updateCategory: async (id: string, update: CategoryUpdateType): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, update);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<string> => {
    const response = await api.delete<{ message: string }>(`/categories/${id}`);
    return response.data.message;
  },
};

export default categoryApi;
