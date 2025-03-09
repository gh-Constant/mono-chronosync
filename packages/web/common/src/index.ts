// Common types and utilities for ChronoSync

// Export interfaces
export * from './interfaces';

// Explicit export of the IAppError interface for better TypeScript resolution
export type { IAppError } from './interfaces';

// Example type definition
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example utility function
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Version info
export const VERSION = '1.0.0'; 