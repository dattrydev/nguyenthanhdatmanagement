import {apiGet} from "@/utils/api-request";

export const validate = async (): Promise<boolean> => {
    return await apiGet("auth/validate");
};
