import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js'; // Importamos el logger TS
import { CustomError } from '../errors/custom.error.js'; // Importamos tu clase de error

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    // 1. Determinar el código de estado
    // Si es uno de tus errores personalizados, usa su statusCode. Si no, 500.
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || 'Error Interno del Servidor';

    // 2. Loguear con Winston
    // Si es un error 500 (no controlado), lo logueamos como 'error' (rojo/grave)
    // Si es un error operativo (400, 404), lo logueamos como 'warn' (amarillo)
    if (statusCode >= 500) {
        logger.error(
            `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - Stack: ${err.stack}`
        );
    } else {
        logger.warn(
            `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
    }

    // 3. Responder al Cliente
    res.status(statusCode).json({
        status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
        message,
        code: err instanceof CustomError ? err.code : undefined, // Tu propiedad opcional 'code'
        // Stack trace solo en desarrollo por seguridad
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};