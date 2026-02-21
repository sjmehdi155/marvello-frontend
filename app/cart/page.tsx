"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();

    return (
        <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium collection.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                    {/* Cart Items List */}
                    <div className="flex-grow">
                        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-3 text-right">Total</div>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {cartItems.map((item) => (
                                <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                                    {/* Product Info */}
                                    <div className="col-span-6 flex items-center gap-4 w-full">
                                        <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 leading-tight">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-sm text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity Control (Mobile + Desktop) */}
                                    <div className="col-span-3 flex justify-between md:justify-center items-center w-full md:w-auto mt-4 md:mt-0">
                                        <span className="md:hidden font-medium text-gray-500">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                                                className="w-8 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <div className="w-10 text-center font-bold text-sm">
                                                {item.qty}
                                            </div>
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.min(item.countInStock, item.qty + 1))}
                                                className="w-8 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                disabled={item.qty >= item.countInStock}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Total */}
                                    <div className="col-span-3 flex justify-between md:justify-end items-center w-full md:w-auto mt-2 md:mt-0">
                                        <span className="md:hidden font-medium text-gray-500">Subtotal:</span>
                                        <span className="font-bold text-lg">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-foreground">${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="font-medium text-foreground">{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Estimated Tax</span>
                                    <span className="font-medium text-foreground">${taxPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl">${totalPrice.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">USD inclusive of applicable taxes</p>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg group"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                                <svg className="w-8 h-8 opacity-50" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#222"></rect><path d="M14 6H10V10H14V6Z" fill="white"></path></svg>
                                <svg className="w-8 h-8 opacity-50" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#E61C24"></rect><path d="M19 12C19 15.3137 16.3137 18 13 18C9.68629 18 7 15.3137 7 12C7 8.68629 9.68629 6 13 6C16.3137 6 19 8.68629 19 12Z" fill="#FF9E1B"></path><path d="M25 18C28.3137 18 31 15.3137 31 12C31 8.68629 28.3137 6 25 6C21.6863 6 19 8.68629 19 12C19 15.3137 21.6863 18 25 18Z" fill="#F79E1B"></path></svg>
                                <svg className="w-8 h-8 opacity-50" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#005C9E"></rect><path d="M19 12L13 18L7 12L13 6L19 12Z" fill="white"></path></svg>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
