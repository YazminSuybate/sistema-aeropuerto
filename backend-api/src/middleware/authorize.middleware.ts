import type { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from './auth.middleware.js'; 

const prisma = new PrismaClient();

export const authorizeDynamic = (requiredPermissionName: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response> => {
        if (!req.user || !req.user.id_rol) {
            return res.status(403).json({ message: 'Acceso denegado. Información de rol no disponible.' });
        }

        const userRoleId = req.user.id_rol;

        try {
            const hasPermission = await prisma.rol_permiso.findFirst({
                where: {
                    id_rol: userRoleId,
                    permiso: {
                        nombre: requiredPermissionName,
                    },
                },
                select: {
                    id_rol_permiso: true 
                }
            });

            if (hasPermission) {
                next();
            } else {
                return res.status(403).json({
                    message: `Acceso denegado. Requiere el permiso: ${requiredPermissionName}.`
                });
            }

        } catch (error) {
            console.error('Error al verificar permiso dinámico:', error);
            return res.status(500).json({ message: 'Error interno de servidor al verificar permisos.' });
        }
    };
};