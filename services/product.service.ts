import api from "./api";

export const productService = {
    getProducts: async () => {
        const response = await api.get("/products");
        return response.data;
    },

    getProductById: async (id: string) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async () => {
        const response = await api.post("/products");
        return response.data;
    },

    updateProduct: async (id: string, product: any) => {
        const response = await api.put(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};
