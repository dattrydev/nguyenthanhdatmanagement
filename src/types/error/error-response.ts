export interface ErrorResponse {
    status: number;
    message: string;
    errors: string | null;
};

export const isErrorResponse = (data: any): data is ErrorResponse => {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof data.status === "number" &&
        typeof data.message === "string" &&
        (typeof data.errors === "string" || data.errors === null)
    );
};