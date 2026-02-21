"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { cartItems } = useCart();

    const cartQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button className="lg:hidden p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    MARVELLO
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
                        Home
                    </Link>
                    <Link href="/shop" className="text-sm font-medium hover:text-accent transition-colors">
                        Shop
                    </Link>
                    {isAuthenticated && (
                        <Link href="/orders" className="text-sm font-medium hover:text-accent transition-colors">
                            Orders
                        </Link>
                    )}
                    {user?.isAdmin && (
                        <Link href="/admin" className="text-sm font-medium hover:text-accent transition-colors text-red-500">
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <button className="hidden lg:block p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link href="/profile" className="text-sm font-bold bg-accent/10 px-3 py-1.5 rounded-full text-accent hover:bg-accent/20 transition-colors">
                                {user?.firstName}
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                    )}

                    <Link href="/cart" className="p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                        {cartQuantity > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-accent-foreground rounded-full text-[10px] font-bold flex justify-center items-center">
                                {cartQuantity}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
