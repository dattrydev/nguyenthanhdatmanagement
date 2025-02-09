import axios from "axios";
import CookieHelper from "./cookie-helper";
import {toast} from "@/hooks/use-toast";

export const API_HOST = process.env.NEXT_PUBLIC_API_URL;

export const getFormData = (data: { [name: string]: any }): FormData => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
        } else if (typeof value != "undefined") {
            formData.append(key, value);
        }
    });
    return formData;
};

const getRequestHeaders = async (isFormData?: boolean): Promise<any> => {
    const token = CookieHelper.getItem("token");

    const headers: any = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};

const apiRequest = async (method: string, query: string, body?: any, isFormData?: boolean) => {
    try {
        const headers = await getRequestHeaders(isFormData);

        const response = await axios({
            method: method,
            url: `${API_HOST}${query}`,
            data: isFormData ? body : JSON.stringify(body),
            headers: headers,
            params: method === "GET" ? body : undefined,
        });

        return response.data;
    } catch (error) {
        console.log("API request failed:", error);
        toast({
            title: "Error",
            description: "An error occurred while processing the request.",
            variant: "destructive",
        })
    }
};

export const apiPost = async (query: string, body: any) => {
    const isFormData = body instanceof FormData;
    return await apiRequest("POST", query, body, isFormData);
};

export const apiGet = async (query: string, body?: any) => {
    return await apiRequest("GET", query, body);
};

export const apiPut = async (query: string, body: any) => {
    const isFormData = body instanceof FormData;
    return await apiRequest("PUT", query, body, isFormData);
};

export const apiDelete = async (query: string, body?: any) => {
    const isFormData = body instanceof FormData;
    return await apiRequest("DELETE", query, body, isFormData);
};

export const apiPatch = async (query: string, body: any) => {
    const isFormData = body instanceof FormData;
    return await apiRequest("PATCH", query, body, isFormData);
};
