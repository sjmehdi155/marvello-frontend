"use client";

import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import Loader from "@/components/Loader";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data.slice(0, 4)); // Get first 4 for featured
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000')" }}
        >
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-white font-medium tracking-wider uppercase text-sm mb-4">New Collection {new Date().getFullYear()}</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Elevate Your <br className="hidden md:block" /> Everyday Polish.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light">
            Discover our curated selection of premium goods designed to bring both beauty and utility to your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?category=sale"
              className="px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Explore Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400">Find exactly what you are looking for.</p>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-1 text-accent font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Accessories", "Electronics", "Clothing"].map((category, i) => (
            <Link href={`/shop?category=${category}`} key={i} className="group relative h-64 md:h-80 rounded-xl overflow-hidden bg-gray-100 flex items-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-${i === 0 ? '1492707892479-7bc8d5a4ee93' : i === 1 ? '1498049794561-7780e7231661' : '1515886657613-9f3515b0c78f'}?auto=format&fit=crop&q=80&w=800')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 p-6 w-full flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">{category}</h3>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Trending Now</h2>
              <p className="text-gray-500 dark:text-gray-400">Our most popular products this week.</p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Why Choose Marvello?</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
          We pride ourselves on providing the highest quality products with exceptional customer service. Our commitment to excellence is reflected in every item we offer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-semibold text-lg mb-2">Premium Quality</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Every product is crafted with superior materials and attention to detail.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-lg mb-2">Fast Shipping</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get your items quickly with our expedited shipping options worldwide.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h4 className="font-semibold text-lg mb-2">Secure Payments</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your transactions are protected with enterprise-grade encryption.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
