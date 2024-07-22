
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/errorHandler';

const errorHandlerMiddleware = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error',
        statusCode: error.statusCode || 500,
      });
};

export default errorHandlerMiddleware;