import { api } from "@/src/shared/api/api-instanse";
import { SubcategoryCreateType, SubcategoryUpdateType } from "../types/subcategories.types";

export const subcategoriesAPI = {
  getAllSubcategories: async (categoryId?: string) => {
    const response = await api.get("/subcategories", {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data;
  },
  getSubcategoryById: async (id: string) => {
    const response = await api.get(`/subcategories/${id}`);
    return response.data;
  },
  createSubcategory: async (subcategory: SubcategoryCreateType) => {
    const response = await api.post("/subcategories", subcategory);
    return response.data;
  },
  updateSubcategory: async (id: string, subcategory: SubcategoryUpdateType) => {
    const response = await api.put(`/subcategories/${id}`, subcategory);
    return response.data;
  },
  deleteSubcategory: async (id: string) => {
    const response = await api.delete(`/subcategories/${id}`);
    return response.data;
  },
};

export default subcategoriesAPI;