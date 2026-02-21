import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/data"; // Re-using our types

export interface CartItem {
    product: Product;
    quantity: number;
}

interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    firstName?: string;
    lastName?: string;
}

interface CartState {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress | null;
    paymentMethod: string;

    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    saveShippingAddress: (address: ShippingAddress) => void;
    savePaymentMethod: (method: string) => void;

    // Computed values getters will be used dynamically in components
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            shippingAddress: null,
            paymentMethod: "Credit Card",

            addToCart: (product, quantity) => {
                const item = { product, quantity };
                const currentItems = get().cartItems;
                const existItem = currentItems.find(x => x.product.id === product.id || x.product._id === product._id);

                if (existItem) {
                    set({
                        cartItems: currentItems.map(x =>
                            (x.product.id === existItem.product.id || x.product._id === existItem.product._id) ? item : x
                        )
                    });
                } else {
                    set({ cartItems: [...currentItems, item] });
                }
            },

            removeFromCart: (productId) => {
                set({
                    cartItems: get().cartItems.filter(x => x.product.id !== productId && x.product._id !== productId)
                });
            },

            updateQuantity: (productId, quantity) => {
                set({
                    cartItems: get().cartItems.map(x =>
                        (x.product.id === productId || x.product._id === productId)
                            ? { ...x, quantity }
                            : x
                    )
                });
            },

            clearCart: () => set({ cartItems: [] }),

            saveShippingAddress: (address) => set({ shippingAddress: address }),

            savePaymentMethod: (method) => set({ paymentMethod: method }),
        }),
        {
            name: "cart-storage", // local storage key
        }
    )
);
