// HTTP Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User related interfaces
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

// Auth related interfaces
export interface IAuthResponse {
  token: string;
  user: IUser;
}

// Error interfaces
export interface IAppError extends Error {
  status?: number;
  statusCode?: number;
} 