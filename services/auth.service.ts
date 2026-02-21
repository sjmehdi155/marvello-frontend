import api from "./api";

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post("/users/login", credentials);
        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post("/users", userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get("/users/profile");
        return response.data;
    }
};
