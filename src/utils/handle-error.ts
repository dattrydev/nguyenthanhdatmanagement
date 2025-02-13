import {ErrorResponse} from "@/types/error/error-response";

export const handleError = (
    error: any
): ErrorResponse => {
    return {
        status: error?.status || 500,
        message: error?.message || "An error occurred",
        errors: error?.errors || {},
    }
};
