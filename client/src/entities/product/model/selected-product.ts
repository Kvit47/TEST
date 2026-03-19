import { create } from "zustand";

interface SelectedProductStore {
    selectedCategory: string | null;
    selectedSubCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    setSelectedSubCategory: (subcategory: string | null) => void;
}

export const useSelectedProductStore = create<SelectedProductStore>((set) => ({
    selectedCategory: null,
    selectedSubCategory: null,
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSelectedSubCategory: (subcategory) => set({ selectedSubCategory: subcategory }),
}));
