import { Request, Response, NextFunction } from 'express';
import { config } from '@/config';
import { IAppError } from '@chronosync/common';

export const errorHandler = (
  err: IAppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error in development
  if (config.isDevelopment) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      ...(config.isDevelopment && { stack: err.stack }),
    },
  });
}; 