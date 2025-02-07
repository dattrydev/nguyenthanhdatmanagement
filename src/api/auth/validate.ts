import axiosInstance from "@/config/axiosConfig";
import {LoginResponse} from "@/types/auth/login-response";

export const validate = async (): Promise<boolean> => {
    try {
        const response = await axiosInstance.get<LoginResponse>("/auth/validate");

        return response.status === 200;
    } catch (error) {
        console.log("Error logging in:", error);

        return false;
    }
};
