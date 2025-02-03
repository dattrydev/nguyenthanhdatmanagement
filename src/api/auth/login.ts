import axiosInstance from "@/config/axiosConfig";
import { LoginResponse } from "@/types/auth/login-response";
import { ErrorResponse } from "@/types/error/error-response";
import { UserLogin } from "@/types/auth/user";
import axios from "axios";

export const loginApi = async (userLogin: UserLogin): Promise<LoginResponse | ErrorResponse> => {
    try {
        const response = await axiosInstance.post<LoginResponse>("/auth/login", userLogin);
        return response.data;
    } catch (error) {
        console.log("Error logging in:", error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                return error.response.data as ErrorResponse;
            } else if (error.request) {
                return { message: "No response from server", status: 500, errors: "" };
            } else {
                return { message: error.message, status: 500, errors: "" };
            }
        } else {
            return { message: "An unexpected error occurred", status: 500, errors: "" };
        }
    }
};
