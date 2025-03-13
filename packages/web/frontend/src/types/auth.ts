import type { IAuthResponse, ILoginCredentials, IRegisterCredentials } from '@chronosync/common';

export type { IAuthResponse as AuthResponse };
export type { ILoginCredentials as LoginCredentials };
export type { IRegisterCredentials as RegisterCredentials };

// Additional frontend-specific types
export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
} 