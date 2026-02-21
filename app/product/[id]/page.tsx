"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { productService } from "@/services/product.service";
import { useCart } from "@/context/CartContext";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(params.id);
                setProduct(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
                <button onClick={() => router.push('/shop')} className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                    Return to Shop
                </button>
            </div>
        );
    }

    // Simulate multiple images if none exist (placeholder for our schema design)
    const images = product.images || [product.image, product.image, product.image];

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Optional: add a toast notification here
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 py-8 md:py-16">
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

                {/* Product Images */}
                <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
                    <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0">
                        {images.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative w-20 h-24 md:w-full md:h-32 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activeImage === i ? 'border-accent' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <Image
                            src={images[activeImage]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="mb-2 text-sm font-medium text-accent tracking-wider uppercase">
                        {product.brand}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                {product.rating} ({product.numReviews} reviews)
                            </span>
                        </div>
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                    </div>

                    <div className="text-3xl font-bold mb-8">${product.price.toFixed(2)}</div>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6 mb-8 flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-gray-500">Quantity</label>
                            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg w-32 bg-white dark:bg-gray-900">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-foreground transition-colors"
                                    disabled={product.countInStock === 0}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="flex-1 text-center font-bold">
                                    {product.countInStock === 0 ? 0 : quantity}
                                </div>
                                <button
                                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                                    className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-foreground transition-colors"
                                    disabled={product.countInStock === 0}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-[2] flex gap-3 items-end">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className="flex-1 bg-primary text-primary-foreground h-12 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Add to Cart
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-red-500 hover:text-red-500 transition-colors shrink-0">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <ShieldCheck className="w-6 h-6 text-accent mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm">2 Year Warranty</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Full coverage applied automatically.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <Truck className="w-6 h-6 text-accent mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm">Free Express Shipping</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">On orders over $150.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
