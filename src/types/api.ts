export interface PagingResponse {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
}

export interface PagingRequest {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}