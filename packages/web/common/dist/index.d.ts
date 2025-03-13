export * from './interfaces/auth';
export interface IAppError {
    message: string;
    code?: string;
    status?: number;
}
export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare function formatDate(date: Date): string;
export declare const VERSION = "1.0.0";
