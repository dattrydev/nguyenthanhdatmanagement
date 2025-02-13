import {z} from "zod";

export interface User {
    email: string;
    name: string;
    password: string;
}

export type UserLogin = Pick<User, "email" | "password">;

export type UserInfo = Pick<User, "email" | "name">;

export const userLoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
