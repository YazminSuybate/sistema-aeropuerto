import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';

export const authorizeDynamic = (requiredPermissionName: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
        if (!req.user || !req.user.permisos) {
            return res.status(403).json({ message: 'Acceso denegado. Permisos de usuario no disponibles.' });
        }

        const hasPermission = req.user.permisos.includes(requiredPermissionName);

        if (hasPermission) {
            next();
        } else {
            return res.status(403).json({
                message: `Acceso denegado. Requiere el permiso: ${requiredPermissionName}.`
            });
        }
    };
};