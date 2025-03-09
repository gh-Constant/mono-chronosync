export * from './interfaces';
export type { IAppError } from './interfaces';
export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare function formatDate(date: Date): string;
export declare const VERSION = "1.0.0";
