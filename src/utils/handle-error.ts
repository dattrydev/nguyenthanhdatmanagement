import {ErrorResponse} from "@/types/error/error-response";
import axios from "axios";

export const handleError = (
    error: unknown,
    customMessage?: string
): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const responseError = error.response.data as ErrorResponse;

            switch (error.response.status) {
                case 400:
                    return {
                        message: customMessage || responseError.message || "Bad Request",
                        status: 400,
                        errors: responseError.errors
                    };
                case 401:
                    return {
                        message: customMessage || responseError.message || "Unauthorized",
                        status: 401,
                        errors: responseError.errors
                    };
                case 403:
                    return {
                        message: customMessage || responseError.message || "Forbidden",
                        status: 403,
                        errors: responseError.errors
                    };
                case 404:
                    return {
                        message: customMessage || responseError.message || "Not Found",
                        status: 404,
                        errors: responseError.errors
                    };
                case 500:
                    return {
                        message: customMessage || responseError.message || "Internal Server Error",
                        status: 500,
                        errors: responseError.errors
                    };
                default:
                    return {
                        message: customMessage || responseError.message || "An error occurred",
                        status: error.response.status,
                        errors: responseError.errors
                    };
            }
        } else if (error.request) {
            return {message: customMessage || "No response from server", status: 500, errors: ""};
        } else {
            return {message: customMessage || error.message, status: 500, errors: ""};
        }
    } else {
        return {message: customMessage || "An unexpected error occurred", status: 500, errors: ""};
    }
};
