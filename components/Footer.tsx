"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
            <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="text-2xl font-bold tracking-tighter mb-4 block">
                            MARVELLO
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            Premium quality goods delivered to your doorstep. Experience modern e-commerce.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-foreground">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
                            <li><Link href="/shop?category=new" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop?category=sale" className="hover:text-accent transition-colors">Sale</Link></li>
                            <li><Link href="/cart" className="hover:text-accent transition-colors">Your Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-foreground">Account</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/login" className="hover:text-accent transition-colors">Login</Link></li>
                            <li><Link href="/signup" className="hover:text-accent transition-colors">Sign Up</Link></li>
                            <li><Link href="/profile" className="hover:text-accent transition-colors">Profile</Link></li>
                            <li><Link href="/orders" className="hover:text-accent transition-colors">Orders</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-foreground">Newsletter</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Subscribe to get special offers, free giveaways, and updates.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent flex-grow text-sm"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-r-md hover:bg-primary/90 transition-colors"
                                onClick={(e) => e.preventDefault()}
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Marvello. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
