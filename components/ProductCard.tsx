import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group flex flex-col pt-4 overflow-hidden">
            <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-4">
                {/* We use unoptimized for dummy external images. In production, configure next.config.js for valid domains */}
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay button */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                    <button className="bg-primary text-primary-foreground w-full py-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>
            </Link>

            <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start">
                    <Link href={`/product/${product.id}`} className="font-medium text-foreground hover:text-accent transition-colors line-clamp-1">
                        {product.name}
                    </Link>
                    <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
            </div>
        </div>
    );
}
