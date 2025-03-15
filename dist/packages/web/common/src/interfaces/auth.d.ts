export interface IAuthResponse {
    user: {
        id: number;
        email: string;
        name: string | null;
        image?: string | null;
        createdAt: Date;
    };
    token: string;
}
export interface ILoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface IRegisterCredentials {
    name: string;
    email: string;
    password: string;
}
export interface IJwtPayload {
    id: number;
    email: string;
    name?: string | null;
    iat?: number;
    exp?: number;
}
