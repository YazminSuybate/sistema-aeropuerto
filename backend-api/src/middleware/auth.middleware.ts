import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';
import { env } from 'prisma/config';


// ESTA ES LA LÍNEA QUE ARREGLA EL PROBLEMA
const { TokenExpiredError } = jwt;

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        id_rol: number;
        id_area: number;
        permisos: string[];
    };
}

const JWT_SECRET_VALUE = env("JWT_SECRET");
if (!JWT_SECRET_VALUE) {
    throw new Error("FATAL ERROR: JWT_SECRET no está definido.");
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void | Response => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado, token no encontrado.' });
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET_VALUE as Secret) as {
                id: number,
                email: string,
                id_rol: number,
                id_area: number,
                permisos: string[]
            };

        req.user = decoded;

        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Error al verificar token: TokenExpiredError: jwt expired');
            return res.status(401).json({
                message: 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.',
                code: 'TOKEN_EXPIRED',
                expiredAt: error.expiredAt
            });
        }

        console.error('Error al verificar token:', error);
        return res.status(401).json({
            message: 'Token inválido o faltante.',
            code: 'INVALID_TOKEN'
        });
    }
};