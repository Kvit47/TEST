import { create } from "zustand";
import { Product } from "../types/product.types";
import productApi from "../service/product.api";

export type ProductWithId = Product & { _id?: string };

function isError(e: unknown): e is { message: string } {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    typeof (e as { message: string }).message === "string"
  );
}

function getProductId(p: ProductWithId | null): string | null {
  return p?._id ?? null;
}

type ProductState = {
  // --- API state ---
  products: ProductWithId[];
  isLoading: boolean;
  error: string | null;
  selectedProduct: ProductWithId | null;
  fetchProducts: (subcategoryId?: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (
    product: Omit<Product, "createdAt" | "updatedAt">
  ) => Promise<ProductWithId | undefined>;
  updateProduct: (
    id: string,
    update: Partial<Product>
  ) => Promise<ProductWithId | undefined>;
  deleteProduct: (id: string) => Promise<boolean>;
  clearSelectedProduct: () => void;

  // --- UI state ---
  product: ProductWithId | null;
  setProduct: (product: ProductWithId | null) => void;

  wishlistedByProductId: Record<string, boolean>;
  setWishlisted: (productId: string, value: boolean) => void;
  toggleWishlisted: (productId: string) => void;

  selectedColorIndexByProductId: Record<string, number>;
  setSelectedColorIndex: (productId: string, index: number) => void;

  selectedSizeIndexByProductId: Record<string, number>;
  setSelectedSizeIndex: (productId: string, index: number) => void;

  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;

  resetProductUI: () => void;
};

export const useProductStore = create<ProductState>((set) => ({
  // --- API state ---
  products: [],
  isLoading: false,
  error: null,
  selectedProduct: null,

  fetchProducts: async (subcategoryId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const products = (await productApi.getAllProducts(subcategoryId)) as ProductWithId[];
      set({ products, isLoading: false });
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = (await productApi.getProductById(id)) as ProductWithId;
      set({ selectedProduct: product, isLoading: false });
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to fetch product",
        isLoading: false,
      });
    }
  },

  createProduct: async (product: Omit<Product, "createdAt" | "updatedAt">) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = (await productApi.createProduct(product)) as ProductWithId;
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
      return newProduct;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to create product",
        isLoading: false,
      });
    }
  },

  updateProduct: async (id: string, update: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = (await productApi.updateProduct(id, update)) as ProductWithId;
      set((state) => ({
        products: state.products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        ),
        isLoading: false,
      }));
      return updatedProduct;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to update product",
        isLoading: false,
      });
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error: unknown) {
      set({
        error: isError(error) ? error.message : "Failed to delete product",
        isLoading: false,
      });
      return false;
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),

  // --- UI state ---
  product: null,
  setProduct: (product) =>
    set((state) => ({
      product,
      selectedImageIndex:
        getProductId(product) !== getProductId(state.product)
          ? 0
          : state.selectedImageIndex,
    })),

  wishlistedByProductId: {},
  setWishlisted: (productId, value) =>
    set((state) => ({
      wishlistedByProductId: {
        ...state.wishlistedByProductId,
        [productId]: value,
      },
    })),
  toggleWishlisted: (productId) =>
    set((state) => ({
      wishlistedByProductId: {
        ...state.wishlistedByProductId,
        [productId]: !state.wishlistedByProductId[productId],
      },
    })),

  selectedColorIndexByProductId: {},
  setSelectedColorIndex: (productId, index) =>
    set((state) => ({
      selectedColorIndexByProductId: {
        ...state.selectedColorIndexByProductId,
        [productId]: index,
      },
      // reset size selection when color changes — available sizes differ per color
      selectedSizeIndexByProductId: {
        ...state.selectedSizeIndexByProductId,
        [productId]: 0,
      },
    })),

  selectedSizeIndexByProductId: {},
  setSelectedSizeIndex: (productId, index) =>
    set((state) => ({
      selectedSizeIndexByProductId: {
        ...state.selectedSizeIndexByProductId,
        [productId]: index,
      },
    })),

  selectedImageIndex: 0,
  setSelectedImageIndex: (index) => set({ selectedImageIndex: index }),

  resetProductUI: () => set({ selectedImageIndex: 0 }),
}));
