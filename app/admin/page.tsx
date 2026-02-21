"use client";

import { User, Settings, LogOut, PackageSearch, CreditCard, Activity, DollarSign, LayoutDashboard, Users, UserPlus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";

export default function AdminDashboardPage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'overview' | 'products' | 'users'>('overview');

    // Add/Edit Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [ordersData, productsData] = await Promise.all([
                orderService.getAllOrders(),
                productService.getProducts()
            ]);
            setOrders(ordersData);
            setProducts(productsData);
        } catch (err) {
            console.error("Admin error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (user && !user.isAdmin) {
            router.push("/profile");
            return;
        }

        fetchAllData();
    }, [isAuthenticated, user, router]);

    const handleCreateProduct = async () => {
        try {
            await productService.createProduct();
            fetchAllData();
        } catch (err) {
            alert("Error creating product");
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(id);
                fetchAllData();
            } catch (err) {
                alert("Error deleting product");
            }
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productService.updateProduct(editingProduct._id || editingProduct.id, editingProduct);
            setIsProductModalOpen(false);
            setEditingProduct(null);
            fetchAllData();
        } catch (err) {
            alert("Error updating product");
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Prevent flicker for unauthorized users
    if (!isAuthenticated || !user?.isAdmin) return null;

    // KPIs
    const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
    const totalOrders = orders.length;

    return (
        <div className="container mx-auto px-4 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Menu */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 text-xl font-bold mb-3">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                {user.firstName} {user.lastName} <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 rounded text-xs">ADMIN</span>
                            </h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <nav className="p-3 space-y-1">
                            <button
                                onClick={() => setView('overview')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'overview' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> Overview
                            </button>
                            <button
                                onClick={() => setView('products')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'products' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                <PackageSearch className="w-4 h-4" /> Manage Products
                            </button>
                            <button
                                onClick={() => setView('users')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'users' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                <Users className="w-4 h-4" /> Manage Users
                            </button>
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

                {/* Content Area */}
                <div className="flex-grow space-y-8">

                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Admin Workspace</h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold">${totalRevenue.toFixed(2)}</h3>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                <h3 className="text-3xl font-bold">{totalOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Active Users</p>
                                <h3 className="text-3xl font-bold">2,408</h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {view === 'overview' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-lg font-bold">Recent Store Orders</h2>
                                <button className="text-sm text-accent font-medium hover:underline">View All</button>
                            </div>

                            {loading ? (
                                <div className="p-10 text-center text-gray-500">Loading comprehensive logs...</div>
                            ) : orders.length === 0 ? (
                                <div className="p-10 text-center text-gray-500">Store has no orders logged.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                                                <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Order ID</th>
                                                <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Customer</th>
                                                <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Date</th>
                                                <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Amount</th>
                                                <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {orders.slice(0, 5).map((order) => (
                                                <tr key={order._id || order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                                                        {(order._id || order.id).substring(0, 8)}
                                                    </td>
                                                    <td className="p-4 font-medium uppercase text-xs tracking-wider">
                                                        {order.user?.firstName} {order.user?.lastName}
                                                    </td>
                                                    <td className="p-4 text-gray-600 dark:text-gray-400">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 font-medium">
                                                        ${order.totalPrice.toFixed(2)}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${order.isDelivered ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                                                            }`}>
                                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'products' && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-lg font-bold">Product Catalog</h2>
                                <button
                                    onClick={handleCreateProduct}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Product
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                                            <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Product</th>
                                            <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Price</th>
                                            <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Stock</th>
                                            <th className="font-medium p-4 border-b border-gray-200 dark:border-gray-800">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {products.map((p) => (
                                            <tr key={p._id || p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded relative overflow-hidden shrink-0">
                                                            <img src={p.image} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium">${p.price.toFixed(2)}</td>
                                                <td className="p-4">{p.countInStock}</td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }}
                                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p._id || p.id)}
                                                            className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded text-xs transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Edit Product Modal */}
            {isProductModalOpen && editingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Edit Product</h2>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Product Name</label>
                                    <input required type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Price ($)</label>
                                    <input required type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Stock Count</label>
                                    <input required type="number" value={editingProduct.countInStock} onChange={(e) => setEditingProduct({ ...editingProduct, countInStock: parseInt(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Image URL</label>
                                    <input required type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Description</label>
                                    <textarea required rows={3} value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-2 px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
