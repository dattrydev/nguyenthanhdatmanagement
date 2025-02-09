import {LoginResponse} from "@/types/auth/login-response";
import {UserLogin} from "@/types/auth/user";
import {apiPost} from "@/utils/api-request";

export const loginApi = async (userLogin: UserLogin): Promise<LoginResponse> => {
    return await apiPost("auth/login", userLogin);
};
