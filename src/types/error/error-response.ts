export interface ErrorResponse {
    status: number;
    message: string;
    errors: string | null;
}

export const isErrorResponse = (data: any): data is ErrorResponse => {
    return (
        typeof data === "object" &&
        data !== null &&
        "status" in data &&
        "message" in data &&
        "errors" in data
    );
};
