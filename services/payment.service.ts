import api from "./api";

export const paymentService = {
    createPaymentIntent: async (amount: number) => {
        const response = await api.post("/payments/intent", { amount });
        return response.data;
    },
};
