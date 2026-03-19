import { create } from "zustand";

import { Category, CategoryCreateType, CategoryUpdateType } from "../types/categories.type";
import categoryApi from "../service/categories.api";

type CategoryWithId = Category & { _id?: string };

type CategoryState = {
  categories: CategoryWithId[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: CategoryWithId | null;
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  createCategory: (category: CategoryCreateType) => Promise<CategoryWithId | undefined>;
  updateCategory: (id: string, update: CategoryUpdateType) => Promise<CategoryWithId | undefined>;
  deleteCategory: (id: string) => Promise<boolean>;
  clearSelectedCategory: () => void;
};

function isError(e: unknown): e is { message: string } {
  return typeof e === "object" && e !== null && "message" in e && typeof (e as { message: string }).message === "string";
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryApi.getAllCategories();
      set({ categories, isLoading: false });
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  fetchCategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoryApi.getCategoryById(id);
      set({ selectedCategory: category, isLoading: false });
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to fetch category",
        isLoading: false,
      });
    }
  },

  createCategory: async (category: CategoryCreateType) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryApi.createCategory(category);
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
      return newCategory;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to create category",
        isLoading: false,
      });
    }
  },

  updateCategory: async (id: string, update: CategoryUpdateType) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryApi.updateCategory(id, update);
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === updatedCategory._id ? updatedCategory : c
        ),
        isLoading: false,
      }));
      return updatedCategory;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to update category",
        isLoading: false,
      });
    }
  },

  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await categoryApi.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to delete category",
        isLoading: false,
      });
      return false;
    }
  },

  clearSelectedCategory: () => {
    set({ selectedCategory: null });
  },
}));
