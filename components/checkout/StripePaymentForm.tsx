"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { ShieldCheck } from "lucide-react";

interface StripePaymentFormProps {
    amount: number;
    clientSecret: string;
    onSuccess: (paymentIntent: any) => void;
    onError: (error: string) => void;
}

export default function StripePaymentForm({ amount, clientSecret, onSuccess, onError }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });

        if (error) {
            onError(error.message || "Payment failed");
            setLoading(false);
        } else if (paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Transactions are secure and encrypted.
                </p>
                <div className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-accent transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                    backgroundColor: 'transparent',
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center disabled:opacity-70 gap-2"
            >
                {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
}
