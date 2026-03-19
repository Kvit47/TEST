import { create } from "zustand";
import { Subcategory, SubcategoryCreateType, SubcategoryUpdateType } from "../types/subcategories.types";
import subcategoriesAPI from "../service/subcategories.api";

type SubcategoryWithId = Subcategory & { _id?: string };

type SubcategoryState = {
  subcategories: SubcategoryWithId[];
  isLoading: boolean;
  error: string | null;
  selectedSubcategory: SubcategoryWithId | null;
  fetchSubcategories: (categoryId?: string) => Promise<void>;
  fetchSubcategoryById: (id: string) => Promise<void>;
  createSubcategory: (subcategory: SubcategoryCreateType) => Promise<SubcategoryWithId | undefined>;
  updateSubcategory: (id: string, update: SubcategoryUpdateType) => Promise<SubcategoryWithId | undefined>;
  deleteSubcategory: (id: string) => Promise<boolean>;
  clearSelectedSubcategory: () => void;
};

function isError(e: unknown): e is { message: string } {
  return typeof e === "object" && e !== null && "message" in e && typeof (e as { message: string }).message === "string";
}

export const useSubcategoryStore = create<SubcategoryState>((set) => ({
  subcategories: [],
  isLoading: false,
  error: null,
  selectedSubcategory: null,

  fetchSubcategories: async (categoryId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const subcategories = await subcategoriesAPI.getAllSubcategories(categoryId);
      set({ subcategories, isLoading: false });
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to fetch subcategories",
        isLoading: false,
      });
    }
  },

  fetchSubcategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const subcategory = await subcategoriesAPI.getSubcategoryById(id);
      set({ selectedSubcategory: subcategory, isLoading: false });
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to fetch subcategory",
        isLoading: false,
      });
    }
  },

  createSubcategory: async (subcategory: SubcategoryCreateType) => {
    set({ isLoading: true, error: null });
    try {
      const newSubcategory = await subcategoriesAPI.createSubcategory(subcategory);
      set((state) => ({
        subcategories: [...state.subcategories, newSubcategory],
        isLoading: false,
      }));
      return newSubcategory;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to create subcategory",
        isLoading: false,
      });
    }
  },

  updateSubcategory: async (id: string, update: SubcategoryUpdateType) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSubcategory = await subcategoriesAPI.updateSubcategory(id, update);
      set((state) => ({
        subcategories: state.subcategories.map((s) =>
          s._id === updatedSubcategory._id ? updatedSubcategory : s
        ),
        isLoading: false,
      }));
      return updatedSubcategory;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to update subcategory",
        isLoading: false,
      });
    }
  },

  deleteSubcategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await subcategoriesAPI.deleteSubcategory(id);
      set((state) => ({
        subcategories: state.subcategories.filter((s) => s._id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to delete subcategory",
        isLoading: false,
      });
      return false;
    }
  },

  clearSelectedSubcategory: () => {
    set({ selectedSubcategory: null });
  },
}));
