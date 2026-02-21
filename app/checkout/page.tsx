"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, ChevronRight, MapPin, CreditCard, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/store/useAuthStore";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { cartItems, shippingAddress, paymentMethod, saveShippingAddress, savePaymentMethod, clearCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [contactEmail, setContactEmail] = useState(user?.email || "");
    const [formData, setFormData] = useState({
        firstName: shippingAddress?.firstName || user?.firstName || "",
        lastName: shippingAddress?.lastName || user?.lastName || "",
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        postalCode: shippingAddress?.postalCode || "",
        country: shippingAddress?.country || "United States",
    });

    const [paymentType, setPaymentType] = useState(paymentMethod || "Credit Card");
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
        if (step === 3 && paymentType === "Credit Card" && !clientSecret) {
            const getClientSecret = async () => {
                try {
                    const data = await paymentService.createPaymentIntent(totalPrice);
                    setClientSecret(data.clientSecret);
                } catch (err) {
                    setError("Could not initialize payment.");
                }
            };
            getClientSecret();
        }
    }, [step, paymentType, totalPrice, clientSecret]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login?redirect=/checkout");
        }
    }, [isAuthenticated, router]);

    // No local subtotal/shipping/tax/total logic needed anymore as it's in context


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            saveShippingAddress(formData);
            setStep(2);
        } else if (step === 2) {
            savePaymentMethod(paymentType);
            setStep(3);
        }
    };

    const handlePlaceOrder = async (paymentResult?: any) => {
        setLoading(true);
        setError(null);
        try {
            const orderData = {
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item.id,
                })),
                shippingAddress: formData,
                paymentMethod: paymentType,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                paymentResult: paymentResult ? {
                    id: paymentResult.id,
                    status: paymentResult.status,
                    email: paymentResult.receipt_email || user?.email,
                } : null,
            };

            const res = await orderService.createOrder(orderData);
            clearCart();
            router.push(`/orders`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <button onClick={() => router.push('/shop')} className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret || undefined }}>
            <div className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen pb-20">
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
                    <div className="container mx-auto px-4 lg:px-8 flex justify-center">
                        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
                    </div>
                </header>

                <div className="container mx-auto px-4 lg:px-8 mt-8">
                    <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                        <div className="flex-grow lg:max-w-3xl">
                            <div className="flex items-center justify-between mb-8 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-800 z-0"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#0a0a0a] px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                        {step > 1 ? <Check className="w-4 h-4" /> : 1}
                                    </div>
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${step >= 1 ? 'text-accent' : 'text-gray-400'}`}>Shipping</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#0a0a0a] px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                        {step > 2 ? <Check className="w-4 h-4" /> : 2}
                                    </div>
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${step >= 2 ? 'text-accent' : 'text-gray-400'}`}>Payment</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#0a0a0a] px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                        3
                                    </div>
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${step >= 3 ? 'text-accent' : 'text-gray-400'}`}>Review</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {step === 1 && (
                                <form onSubmit={handleNextStep} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="text-accent" />
                                        <h2 className="text-xl font-bold">Shipping Details</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">First Name</label>
                                                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Last Name</label>
                                                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Street Address</label>
                                            <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="123 Main St" />
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="col-span-2 lg:col-span-1">
                                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">City</label>
                                                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Postal Code</label>
                                                <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                            </div>
                                            <div className="col-span-2 lg:col-span-1">
                                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Country</label>
                                                <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <button type="submit" className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleNextStep} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-accent" />
                                        <h2 className="text-xl font-bold">Payment Method</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentType === 'Credit Card' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentType === 'Credit Card' ? 'border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {paymentType === 'Credit Card' && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                                                </div>
                                                <span className="font-medium">Credit or Debit Card</span>
                                            </div>
                                        </label>
                                        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentType === 'PayPal' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentType === 'PayPal' ? 'border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {paymentType === 'PayPal' && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                                                </div>
                                                <span className="font-medium">PayPal</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 text-gray-600 dark:text-gray-400 font-medium hover:text-foreground transition-colors">
                                            Back to Shipping
                                        </button>
                                        <button type="submit" className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                                            Review Order
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
                                    <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShoppingBag className="text-accent" />
                                            <h2 className="text-xl font-bold">Review Your Order</h2>
                                        </div>
                                        <p className="text-gray-500 text-sm">Please verify your details and complete payment.</p>
                                    </div>
                                    <div className="p-6 md:p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="font-bold text-gray-900 dark:text-white">Shipping Address</h3>
                                                    <button onClick={() => setStep(1)} className="text-sm text-accent hover:underline font-medium">Edit</button>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                                    <p className="font-medium text-gray-900 dark:text-white mb-1">{formData.firstName} {formData.lastName}</p>
                                                    <p>{formData.address}</p>
                                                    <p>{formData.city}, {formData.postalCode}</p>
                                                    <p>{formData.country}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="font-bold text-gray-900 dark:text-white">Payment Method</h3>
                                                    <button onClick={() => setStep(2)} className="text-sm text-accent hover:underline font-medium">Edit</button>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-3">
                                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                                    <span className="font-medium text-sm">{paymentType}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                                            {paymentType === "Credit Card" && clientSecret ? (
                                                <StripePaymentForm
                                                    amount={totalPrice}
                                                    clientSecret={clientSecret}
                                                    onSuccess={handlePlaceOrder}
                                                    onError={(err) => setError(err)}
                                                />
                                            ) : (
                                                <div className="flex justify-between">
                                                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3.5 text-gray-600 dark:text-gray-400 font-medium hover:text-foreground transition-colors">
                                                        Back to Payment
                                                    </button>
                                                    <button
                                                        onClick={() => handlePlaceOrder()}
                                                        disabled={loading}
                                                        className="px-10 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center disabled:opacity-70 gap-2"
                                                    >
                                                        {loading ? "Processing..." : "Place Order"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-96 shrink-0 order-first lg:order-last">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm sticky top-24">
                                <h2 className="font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">Order Summary</h2>
                                <div className="max-h-64 overflow-y-auto no-scrollbar space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                                <Image src={item.image || ""} alt={item.name} fill className="object-cover" />
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 text-white flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white dark:border-gray-900 shadow-sm z-10">{item.qty}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
                                                <div className="text-sm font-bold mt-1">${(item.price * item.qty).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-foreground">${itemsPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span className="font-medium text-foreground">{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax</span>
                                        <span className="font-medium text-foreground">${taxPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    );
}
