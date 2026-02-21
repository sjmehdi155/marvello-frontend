"use client";

import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "@/services/product.service";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";

const categories = ["All", "Electronics", "Clothing", "Accessories", "Home", "Beauty"];
const priceRanges = ["All", "Under $50", "$50 to $100", "$100 to $200", "Over $200"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

export default function ShopPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(
        categories.find(c => c.toLowerCase() === initialCategory.toLowerCase()) || "All"
    );
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [sortBy, setSortBy] = useState("Featured");
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Compute filtered & sorted products based on state
    const displayedProducts = products
        .filter((product) => {
            if (selectedCategory !== "All" && product.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;

            if (selectedPrice !== "All") {
                if (selectedPrice === "Under $50" && product.price >= 50) return false;
                if (selectedPrice === "$50 to $100" && (product.price < 50 || product.price > 100)) return false;
                if (selectedPrice === "$100 to $200" && (product.price < 100 || product.price > 200)) return false;
                if (selectedPrice === "Over $200" && product.price <= 200) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            if (sortBy === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0; // Featured (default)
        });

    return (
        <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Shop Collection</h1>
                    <p className="text-gray-500 dark:text-gray-400">Showing {displayedProducts.length} premium products</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md font-medium transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="md:hidden">Filters</span>
                    </button>

                    <div className="relative flex-1 md:flex-none">
                        <button
                            onClick={() => setShowSort(!showSort)}
                            className="w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md font-medium hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                        >
                            <span className="truncate">Sort: {sortBy}</span>
                            <ChevronDown className="w-4 h-4 shrink-0" />
                        </button>

                        {showSort && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-20 py-2">
                                {sortOptions.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => { setSortBy(option); setShowSort(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between text-sm"
                                    >
                                        {option}
                                        {sortBy === option && <Check className="w-4 h-4 text-accent" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="sticky top-24 space-y-8">
                        {/* Category Filter */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">Category</h3>
                            <ul className="space-y-3">
                                {categories.map(category => (
                                    <li key={category}>
                                        <button
                                            onClick={() => setSelectedCategory(category)}
                                            className={`text-sm tracking-wide transition-colors ${selectedCategory === category ? 'text-accent font-semibold flex items-center gap-2' : 'text-gray-600 dark:text-gray-400 hover:text-foreground'}`}
                                        >
                                            {selectedCategory === category && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">Price Range</h3>
                            <ul className="space-y-3">
                                {priceRanges.map(range => (
                                    <li key={range}>
                                        <button
                                            onClick={() => setSelectedPrice(range)}
                                            className={`text-sm tracking-wide transition-colors flex items-center gap-3`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedPrice === range ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {selectedPrice === range && <Check className="w-3 h-3" />}
                                            </div>
                                            <span className={selectedPrice === range ? 'font-medium text-foreground' : 'text-gray-600 dark:text-gray-400 hover:text-foreground'}>
                                                {range}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Clear Filters Button */}
                        {(selectedCategory !== "All" || selectedPrice !== "All") && (
                            <button
                                onClick={() => { setSelectedCategory("All"); setSelectedPrice("All"); }}
                                className="w-full py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                            <h3 className="text-xl font-bold mb-2">No products found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
                            <button
                                onClick={() => { setSelectedCategory("All"); setSelectedPrice("All"); }}
                                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
