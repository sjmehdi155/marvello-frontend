"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
    const router = useRouter();

    // Clear errors when mounting
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Redirect if logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/profile");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !firstName || !lastName) return;

        try {
            await register({ firstName, lastName, email, password });
            // Redirection is handled by the useEffect above
        } catch (err) {
            // Error handled by Zustand state
        }
    };

    return (
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-4 my-10">
            <div className="w-full max-w-[480px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400">Join Marvello to unlock premium experiences</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-6 text-sm flex items-center gap-2 border border-red-200 dark:border-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-sm"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-sm"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-sm"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-accent transition-colors text-sm"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md mt-6 group disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span>Creating Account...</span>
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                        By registering, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-foreground font-semibold hover:text-accent transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
