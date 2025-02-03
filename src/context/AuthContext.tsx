"use client";

import {createContext, useState, ReactNode, useEffect} from "react";
import Cookies from "js-cookie";
import {UserInfo} from "@/types/auth/user";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: UserInfo | null;
    setUser: (user: UserInfo | null) => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const setUserState = (newUser: UserInfo | null) => {
        if (newUser) {
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser)); // Lưu vào localStorage
        } else {
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{token, setToken, user, setUser: setUserState, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

