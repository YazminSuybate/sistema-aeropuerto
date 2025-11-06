import type { Request, Response } from 'express';
import { PasajeroService } from '../services/pasajero.service.js';
import { PasajeroRepository } from '../repositories/pasajero.repository.js';
import type { CustomError } from '../errors/custom.error.js';

const pasajeroRepository = new PasajeroRepository();
const pasajeroService = new PasajeroService(pasajeroRepository);

function handleControllerError(error: any, res: Response, defaultMessage: string): Response | void {
    console.error(`Error en el controlador de Pasajero:`, error);

    if (error && error.statusCode) {
        return res.status((error as CustomError).statusCode).json({ message: error.message });
    }

    if (error.code) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: error.message || 'El recurso ya existe.', code: 'P2002' });
            case 'P2003':
                return res.status(409).json({ message: error.message || 'Error de llave foránea. Recurso asociado inválido.', code: 'P2003' });
        }
    }

    return res.status(500).json({ message: defaultMessage });
};


function validateAndGetId(req: Request, res: Response): number | null {
    const idParam = req.params.id;

    if (!idParam) {
        res.status(400).json({ message: 'El ID de pasajero es obligatorio en la ruta.' });
        return null;
    }

    const id_pasajero = parseInt(idParam, 10);

    if (isNaN(id_pasajero)) {
        res.status(400).json({ message: 'ID de pasajero inválido' });
        return null;
    }

    return id_pasajero;
}


export class PasajeroController {
    // GET api/pasajeros
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const pasajeros = await pasajeroService.getAllPasajeros();
            res.status(200).json(pasajeros);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener pasajeros');
        }
    }

    // GET api/pasajeros/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_pasajero = validateAndGetId(req, res);
        if (id_pasajero === null) return;

        try {
            const pasajero = await pasajeroService.getPasajeroById(id_pasajero);
            res.status(200).json(pasajero);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener el pasajero');
        }
    }


    // POST api/pasajeros
    async create(req: Request, res: Response): Promise<void> {
        const { nombre, documento_id, info_contacto } = req.body;

        try {
            const data = { nombre, documento_id, info_contacto };
            const newPasajero = await pasajeroService.createPasajero(data);
            res.status(201).json(newPasajero);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear pasajero.');
        }
    }

    // PUT api/pasajeros/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_pasajero = validateAndGetId(req, res);
        if (id_pasajero === null) return;

        const data = req.body;

        try {
            const updatedPasajero = await pasajeroService.updatePasajero(id_pasajero, data);
            res.status(200).json(updatedPasajero);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar el pasajero.');
        }
    }

    // DELETE api/pasajeros/:id
    async remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> {
        const id_pasajero = validateAndGetId(req, res);
        if (id_pasajero === null) return;

        try {
            await pasajeroService.deletePasajero(id_pasajero);
            res.status(204).send();
        } catch (error: any) {
            if (error.code === 'P2003') {
                return res.status(409).json({
                    message: `No se puede eliminar el pasajero con ID ${id_pasajero} porque tiene tickets asociados.`,
                    code: 'P2003'
                });
            }
            handleControllerError(error, res, 'Error al eliminar el pasajero.');
        }
    }
}