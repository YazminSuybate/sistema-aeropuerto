import type { Request, Response } from 'express';
import { EstadoService } from '../services/estado.service.js';
import { EstadoRepository } from '../repositories/estado.repository.js';
import type { CustomError } from '../errors/custom.error.js';

const estadoRepository = new EstadoRepository();
const estadoService = new EstadoService(estadoRepository);

function handleControllerError(error: any, res: Response, defaultMessage: string): Response | void {
    console.error(`Error en el controlador de Estado:`, error);

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
        res.status(400).json({ message: 'El ID de estado es obligatorio en la ruta.' });
        return null;
    }

    const id_estado = parseInt(idParam, 10);

    if (isNaN(id_estado)) {
        res.status(400).json({ message: 'ID de estado inválido' });
        return null;
    }

    return id_estado;
}


export class EstadoController {
    // GET api/estados
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const estados = await estadoService.getAllEstados();
            res.status(200).json(estados);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener estados');
        }
    }

    // GET api/estados/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_estado = validateAndGetId(req, res);
        if (id_estado === null) return;

        try {
            const estado = await estadoService.getEstadoById(id_estado);
            res.status(200).json(estado);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener el estado');
        }
    }


    // POST api/estados
    async create(req: Request, res: Response): Promise<void> {
        const { nombre_estado, descripcion } = req.body;

        try {
            const data = { nombre_estado, descripcion };
            const newEstado = await estadoService.createEstado(data);
            res.status(201).json(newEstado);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear estado.');
        }
    }

    // PUT api/estados/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_estado = validateAndGetId(req, res);
        if (id_estado === null) return;

        const data = req.body;

        try {
            const updatedEstado = await estadoService.updateEstado(id_estado, data);
            res.status(200).json(updatedEstado);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar el estado.');
        }
    }

    // DELETE api/estados/:id
    async remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> {
        const id_estado = validateAndGetId(req, res);
        if (id_estado === null) return;

        try {
            await estadoService.deleteEstado(id_estado);
            res.status(204).send();
        } catch (error: any) {
            if (error.code === 'P2003') {
                return res.status(409).json({
                    message: `No se puede eliminar el estado con ID ${id_estado} porque tiene tickets asociados.`,
                    code: 'P2003'
                });
            }
            handleControllerError(error, res, 'Error al eliminar el estado.');
        }
    }
}