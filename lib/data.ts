export interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
}

export const PRODUCTS: Product[] = [
    { id: "1", name: "Minimalist Leather Backpack", price: 129.99, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800", description: "A sleek, minimalist backpack crafted from premium full-grain leather. Perfect for your daily commute or weekend getaways." },
    { id: "2", name: "Wireless Noise-Cancelling Headphones", price: 249.50, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800", description: "Experience crystal clear audio with industry-leading noise cancellation. Ergonomic design for all-day comfort." },
    { id: "3", name: "Premium Cotton T-Shirt", price: 35.00, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", description: "Made from 100% organic cotton, this t-shirt offers unparalleled comfort and a classic, flattering fit." },
    { id: "4", name: "Ceramic Coffee Maker", price: 85.00, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800", description: "Brew the perfect cup every time with this elegant, heat-retaining ceramic coffee maker." },
    { id: "5", name: "Classic Wristwatch", price: 195.00, category: "Accessories", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800", description: "A timeless timepiece featuring a genuine leather strap, water-resistant casing, and precision movement." },
    { id: "6", name: "Smart Fitness Watch", price: 199.99, category: "Electronics", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800", description: "Track your workouts, heart rate, and sleep patterns with precision. Stay connected on the go." },
    { id: "7", name: "Polarized Sunglasses", price: 120.00, category: "Accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800", description: "Protect your eyes in style with these premium polarized sunglasses offering 100% UV protection." },
    { id: "8", name: "Ergonomic Office Chair", price: 299.00, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800", description: "Designed for all-day support with adjustable lumbar, armrests, and seating height for your comfort." }
];
