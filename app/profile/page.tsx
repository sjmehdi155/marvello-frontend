"use client";

import { User, Settings, CreditCard, LogOut, MapPin, Bell } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!user) return null; // Prevent flicker before redirect

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Menu */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xl font-bold mb-3">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <h2 className="font-bold text-lg cursor-default">{user.firstName} {user.lastName}</h2>
                            <p className="text-sm text-gray-500 cursor-default">{user.email}</p>
                        </div>
                        <nav className="p-3 space-y-1">
                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-foreground">
                                <User className="w-4 h-4" /> Personal Info
                            </Link>
                            <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors">
                                <CreditCard className="w-4 h-4" /> My Orders
                            </Link>
                            {user.isAdmin && (
                                <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium text-red-500 transition-colors">
                                    <Settings className="w-4 h-4" /> Admin Dashboard
                                </Link>
                            )}
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-500 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                        <h1 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">Personal Information</h1>

                        <form className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 line-clamp-1 text-gray-700 dark:text-gray-300">First Name</label>
                                    <input type="text" defaultValue={user.firstName} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Last Name</label>
                                    <input type="text" defaultValue={user.lastName} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 text-gray-500 focus:outline-none cursor-not-allowed" title="Email cannot be changed" />
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button type="button" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
