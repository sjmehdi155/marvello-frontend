"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    qty: number;
    countInStock: number;
}

interface CartContextType {
    cartItems: CartItem[];
    shippingAddress: any;
    paymentMethod: string;
    addToCart: (product: any, qty: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    saveShippingAddress: (data: any) => void;
    savePaymentMethod: (data: string) => void;
    clearCart: () => void;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [shippingAddress, setShippingAddress] = useState<any>({});
    const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) setCartItems(JSON.parse(savedCart));

        const savedAddress = localStorage.getItem('shippingAddress');
        if (savedAddress) setShippingAddress(JSON.parse(savedAddress));

        const savedPayment = localStorage.getItem('paymentMethod');
        if (savedPayment) setPaymentMethod(JSON.parse(savedPayment));
    }, []);

    // Save to localStorage whenever states change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    useEffect(() => {
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    }, [paymentMethod]);

    const saveShippingAddress = (data: any) => {
        setShippingAddress(data);
    };

    const savePaymentMethod = (data: string) => {
        setPaymentMethod(data);
    };

    const addToCart = (product: any, qty: number) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x.id === (product.id || product._id));

            if (existItem) {
                return prevItems.map((x) =>
                    x.id === existItem.id ? { ...existItem, qty: existItem.qty + qty } : x
                );
            } else {
                return [...prevItems, {
                    id: product.id || product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty,
                    countInStock: product.countInStock
                }];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((x) => x.id !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        setCartItems((prevItems) =>
            prevItems.map((x) => (x.id === id ? { ...x, qty } : x))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Calculations
    const addDecimals = (num: number) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                shippingAddress,
                paymentMethod,
                addToCart,
                removeFromCart,
                updateQuantity,
                saveShippingAddress,
                savePaymentMethod,
                clearCart,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
