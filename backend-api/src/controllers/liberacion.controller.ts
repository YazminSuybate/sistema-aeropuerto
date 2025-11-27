import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { LiberacionService } from '../services/liberacion.service.js';
import { LiberacionRepository } from '../repositories/liberacion.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';

const liberacionRepository = new LiberacionRepository();
const ticketRepository = new TicketRepository();
const liberacionService = new LiberacionService(liberacionRepository, ticketRepository);

export class LiberacionController {

    // POST /api/liberaciones
    async createLiberacion(req: AuthRequest, res: Response) {
        try {
            const id_usuario_liberador = req.user!.id;
            const data: { id_ticket: number, comentario_liberacion?: string } = req.body;

            const nuevaLiberacion = await liberacionService.createLiberacion(data, id_usuario_liberador);
            return res.status(201).json(nuevaLiberacion);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            if (error instanceof BadRequestError) {
                return res.status(400).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al crear la liberación.');
        }
    }

    // GET /api/liberaciones/ticket/:id_ticket
    async getLiberacionesByTicketId(req: AuthRequest, res: Response) {
        const id_ticket = validateAndGetId(req, res, 'id_ticket');
        if (id_ticket === null) return;

        try {
            const liberaciones = await liberacionService.getLiberacionesByTicketId(id_ticket);
            return res.status(200).json(liberaciones);
        } catch (error: any) {
            return handleControllerError(error, res, 'Error al obtener las liberaciones del ticket.');
        }
    }

    // GET /api/liberaciones (Admin)
    async getAllLiberaciones(_req: AuthRequest, res: Response) {
        try {
            const liberaciones = await liberacionService.getAllLiberaciones();
            return res.status(200).json(liberaciones);
        } catch (error) {
            return handleControllerError(error, res, 'Error al obtener todas las liberaciones.');
        }
    }

    // DELETE /api/liberaciones/:id (Admin)
    async deleteLiberacion(req: AuthRequest, res: Response) {
        const id_liberacion = validateAndGetId(req, res, 'id');
        if (id_liberacion === null) return;

        try {
            await liberacionService.deleteLiberacion(id_liberacion);
            return res.status(204).send();
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            
            return handleControllerError(error, res, 'Error al eliminar la liberación.');
        }
    }
}