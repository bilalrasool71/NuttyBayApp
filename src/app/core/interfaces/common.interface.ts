export interface IListOfValue {
    value: number;
    viewValue: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T | null;
}
