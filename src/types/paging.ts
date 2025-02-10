export interface PagingResponse {
    totalPages: number;
    currentPage: number;
}

export interface PagingRequest {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}