"use client";

import Link from "next/link";
import { User, Settings, CreditCard, LogOut, Package, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import Loader from "@/components/Loader";

export default function OrdersPage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login?redirect=/orders");
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!isAuthenticated) return null;

    return (
        <div className="container mx-auto px-4 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Menu */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent text-xl font-bold mb-3">
                                {user?.firstName[0]}{user?.lastName[0]}
                            </div>
                            <h2 className="font-bold text-lg cursor-default">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-sm text-gray-500 cursor-default">{user?.email}</p>
                        </div>
                        <nav className="p-3 space-y-1">
                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors">
                                <User className="w-4 h-4" /> Personal Info
                            </Link>
                            <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-foreground transition-colors">
                                <CreditCard className="w-4 h-4" /> My Orders
                            </Link>
                            {user?.isAdmin && (
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

                {/* content */}
                <div className="flex-grow">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                        <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <h1 className="text-2xl font-bold">Order History</h1>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <RefreshCw className="w-8 h-8 text-accent animate-spin mb-4" />
                                <p className="text-gray-500">Loading your orders...</p>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-center">
                                {error}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't made your first purchase.</p>
                                <Link href="/shop" className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order._id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                                        {/* Order Header */}
                                        <div className="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800">
                                            <div className="flex flex-wrap gap-x-8 gap-y-2">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Order Placed</p>
                                                    <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Total Amount</p>
                                                    <p className="font-medium text-sm">${order.totalPrice.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Order ID</p>
                                                    <p className="font-medium text-sm text-gray-600 dark:text-gray-400">#{order._id.substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isPaid ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400'}`}>
                                                    {order.isPaid ? `Paid • ${new Date(order.paidAt).toLocaleDateString()}` : 'Payment Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Body */}
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                                        {order.isDelivered ? (
                                                            <><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Delivered</>
                                                        ) : (
                                                            <><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Processing</>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {order.isDelivered
                                                            ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                                                            : "We are preparing your order for shipment."}
                                                    </p>
                                                </div>

                                                <Link href={`#`} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                                                    View Invoice <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>

                                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {order.orderItems.map((item: any) => (
                                                    <div key={item._id || item.product} className="py-4 flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-sm hover:underline cursor-pointer truncate">
                                                                <Link href={`/product/${item.product}`}>{item.name}</Link>
                                                            </h4>
                                                            <p className="text-sm text-gray-500 mt-1">Qty: {item.qty} &times; ${item.price.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
