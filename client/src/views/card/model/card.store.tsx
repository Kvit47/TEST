import { Product } from "@/src/entities/product/types/product.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import cartAPI from "../service/card.api";

/** Product with id from API (Mongo _id) */
type ProductWithId = Product & { _id?: string };

function getProductId(p: ProductWithId): string {
  return (p as { _id?: string })._id ?? (p as { id?: string }).id ?? "";
}

export interface CartItem {
  product: ProductWithId;
  quantity: number;
}

interface CartState {
    items: CartItem[];
    isSyncing: boolean;
    isLoading: boolean;
    userId: string | null;

    addItem: (product: Product, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    syncWithServer: () => Promise<void>;
    loadFromServer: (userId: string) => Promise<void>;
    loadAndMergeFromServer: (userId: string) => Promise<void>;
    clearForLogout: () => void;
    clearForUserSwitch: () => void;
    clearCompletely: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isSyncing: false,
            isLoading: false,
            userId: null,

            addItem: async (product, quantity) => {
                const id = getProductId(product as ProductWithId);
                set((state) => {
                    const existing = state.items.find(i => getProductId(i.product as ProductWithId) === id);
                    if (existing) {
                        return {
                            items: state.items.map(i =>
                                getProductId(i.product as ProductWithId) === id
                                  ? { ...i, quantity: i.quantity + quantity }
                                  : i
                            ),
                        };
                    }
                    return { items: [...state.items, { product: product as ProductWithId, quantity }] };
                });
                await get().syncWithServer();
            },

            removeItem: async (productId) => {
                set((state) => ({
                    items: state.items.filter(i => getProductId(i.product as ProductWithId) !== productId),
                }));
                await get().syncWithServer();
            },

            updateQuantity: async (productId, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map(i =>
                        getProductId(i.product as ProductWithId) === productId ? { ...i, quantity } : i
                    ),
                }));
                await get().syncWithServer();
            },

            clearCart: async () => {
                set({ items: [] });
                const token = localStorage.getItem("token");
                if (token) {
                    try { await cartAPI.clearCart(); }
                    catch (error) { console.error("Failed to clear cart on server:", error); }
                }
            },

            getTotalPrice: () => get().items.reduce((total, i) => total + i.product.price * i.quantity, 0),
            getTotalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),

            syncWithServer: async () => {
                const token = localStorage.getItem("token");
                const userId = get().userId;
                if (!token || !userId || get().isSyncing) return;

                try {
                    set({ isSyncing: true });
                    await cartAPI.updateCart(get().items);
                } catch (error) {
                    console.error("Failed to sync cart with server:", error);
                } finally {
                    set({ isSyncing: false });
                }
            },

            loadFromServer: async (userId: string) => {
                set({ isLoading: true });
                try {
                    const response = await cartAPI.getCart();
                    const cartItems: CartItem[] = (response.data || [])
                        .filter((i) => i.productData)
                        .map((i) => ({
                            product: i.productData as ProductWithId,
                            quantity: i.quantity,
                        }));
                    set({ items: cartItems, userId });
                } catch (error) {
                    console.error("Failed to load cart from server:", error);
                    set({ items: [], userId: null });
                } finally {
                    set({ isLoading: false });
                }
            },

            loadAndMergeFromServer: async (userId: string) => {
                set({ isLoading: true });
                try {
                    const localItems = get().items;
                    const response = await cartAPI.getCart();
                    const serverItems: CartItem[] = (response.data || [])
                        .filter((i) => i.productData)
                        .map((i) => ({
                            product: i.productData as ProductWithId,
                            quantity: i.quantity,
                        }));

                    const mergedItems = [...serverItems];

                    for (const localItem of localItems) {
                        const localId = getProductId(localItem.product as ProductWithId);
                        const existingIndex = mergedItems.findIndex(
                            (item) => getProductId(item.product as ProductWithId) === localId
                        );
                        if (existingIndex >= 0) {
                            mergedItems[existingIndex] = {
                                ...mergedItems[existingIndex],
                                quantity: mergedItems[existingIndex].quantity + localItem.quantity,
                            };
                        } else {
                            mergedItems.push(localItem);
                        }
                    }

                    set({ items: mergedItems, userId });
                    if (mergedItems.length > 0) {
                        await cartAPI.updateCart(mergedItems);
                    }
                } catch (error) {
                    console.error("Failed to merge cart with server:", error);
                    set({ userId });
                } finally {
                    set({ isLoading: false });
                }
            },


            clearForLogout: () => set({ items: [], userId: null, isSyncing: false, isLoading: false }),
            clearForUserSwitch: () => set({ items: [], userId: null, isSyncing: false, isLoading: false }),
            clearCompletely: () => {
                set({ items: [], userId: null, isSyncing: false, isLoading: false });
                localStorage.removeItem('cart-storage');
            },
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({ items: state.items, userId: state.userId }),
            version: 1,
        }
    )
);
