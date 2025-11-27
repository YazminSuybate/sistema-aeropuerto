import type { Request, Response } from 'express';
import type { CustomError } from '../errors/custom.error.js';

export function handleControllerError(error: any, res: Response, defaultMessage: string): Response {
    console.error(`Error en el controlador:`, error);

    if (error && error.statusCode) {
        return res.status((error as CustomError).statusCode).json({ message: error.message });
    }

    if (error.code) {
        switch (error.code) {
            case 'P2002':
                const target = error.meta?.target.includes('email') ? 'El email proporcionado ya está registrado.' :
                    error.meta?.target.includes('nombre_area') ? 'Ya existe un área con ese nombre.' :
                        error.meta?.target.includes('nombre_rol') ? 'Ya existe un rol con ese nombre.' :
                            error.meta?.target.includes('nombre_estado') ? 'Ya existe un estado con ese nombre.' :
                                'El recurso ya existe.';
                return res.status(409).json({ message: error.message || target, code: 'P2002' });
            case 'P2003':
                return res.status(409).json({ message: error.message || 'Error de llave foránea. El recurso está en uso.', code: 'P2003' });
        }
    }

    return res.status(500).json({ message: defaultMessage });
};

export function validateAndGetId(req: Request, res: Response, paramName: string = 'id'): number | null {
    const idParam = req.params[paramName];
    if (!idParam) {
        res.status(400).json({ message: `El ID (${paramName}) es obligatorio en la ruta.` });
        return null;
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: `ID (${paramName}) inválido` });
        return null;
    }
    return id;
}