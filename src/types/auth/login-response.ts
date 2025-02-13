export type LoginResponse = {
    token: string;
    expiresIn: number;
    user: {
        email: string;
        name: string;
    };
}