import axios from "axios";
import type { CartItem } from "../model/card.store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ServerCartItem {
  product: string;
  quantity: number;
  productData?: unknown;
}

const cartAPI = {
  // Get user's cart from server (card module)
  getCart: async () => {
    const response = await axiosInstance.get<{ data: ServerCartItem[] }>("/cart");
    return response.data;
  },

  // Update user's cart on server
  updateCart: async (items: CartItem[]) => {
    const serverCart = items.map(item => ({
      product: (item.product as unknown as { _id: string })._id,
      quantity: item.quantity,
      productData: item.product
    }));
    const response = await axiosInstance.put<{ data: ServerCartItem[] }>("/cart", { cart: serverCart });
    return response.data;
  },

  // Clear user's cart on server
  clearCart: async () => {
    const response = await axiosInstance.delete<{ data: ServerCartItem[] }>("/cart");
    return response.data;
  },

  // Add a single item to cart (optional: use for optimistic add without full sync)
  addItem: async (productId: string, quantity: number, productData?: unknown) => {
    const response = await axiosInstance.post<{ data: ServerCartItem[] }>("/cart/item", {
      product: productId,
      quantity,
      productData,
    });
    return response.data;
  },
};

export default cartAPI;

