"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {UserInfo} from "@/types/auth/user";
import {validate} from "@/api/auth/validate";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: UserInfo | null;
    setUser: (user: UserInfo | null) => void;
    isLoading: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const setTokenState = useCallback((newToken: string | null) => {
        if (newToken) {
            Cookies.set("token", newToken, {expires: 7});
            setToken(newToken);
        } else {
            Cookies.remove("token");
            setToken(null);
        }
    }, []);

    const setUserState = useCallback((newUser: UserInfo | null) => {
        if (newUser) {
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
            setUser(null);
        }
    }, []);

    const logout = useCallback(() => {
        setTokenState(null);
        setUserState(null);
        router.push("/login");
    }, [router, setTokenState, setUserState]);


    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            if (!token) {
                setIsLoading(false);
                logout();
                router.push("/login");
                return;
            }

            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }

            try {
                const isValid = await validate();
                if (!isValid) {
                    logout();
                    router.push("/login");
                }
            } catch (error) {
                console.log("Error validating token:", error);
                logout();
            }


            setIsLoading(false);
        };

        checkAuth();
    }, [logout, router, token]);

    return (
        <AuthContext.Provider value={{token, setToken: setTokenState, user, setUser: setUserState, isLoading, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
