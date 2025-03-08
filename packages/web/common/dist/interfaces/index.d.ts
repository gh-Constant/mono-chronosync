export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserCreate {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface IUserLogin {
    email: string;
    password: string;
}
export interface IAuthResponse {
    token: string;
    user: IUser;
}
export interface IAppError extends Error {
    status?: number;
    statusCode?: number;
}
