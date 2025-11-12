import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { LiberacionService } from '../services/liberacion.service.js';
import { LiberacionRepository } from '../repositories/liberacion.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
// ---- FIX 1: Eliminamos 'UnauthorizedError' de la importación ----
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';

// Instanciar repositorios y servicio
const liberacionRepository = new LiberacionRepository();
const ticketRepository = new TicketRepository(); // Necesario para el servicio
const liberacionService = new LiberacionService(liberacionRepository, ticketRepository);

// Helper para validar IDs
function validateAndGetId(req: AuthRequest, res: Response, paramName: string = 'id'): number | null {
    const id_param = req.params[paramName];
    if (!id_param) {
        res.status(400).json({ message: `Parámetro ID '${paramName}' faltante.` });
        return null;
    }
    const id = parseInt(id_param, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: `ID '${paramName}' inválido.` });
        return null;
    }
    return id;
}

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
                // El 'BadRequestError' (No puedes liberar un ticket que no te pertenece)
                // se atrapará aquí, devolviendo un 400.
                return res.status(400).json({ message: error.message });
            }
            
            // ---- FIX 2: Eliminamos el bloque 'if (error instanceof UnauthorizedError)' ----
            
            console.error('Error en createLiberacion:', error);
            return res.status(500).json({ message: error.message || 'Error al crear la liberación.' });
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
            console.error('Error en getLiberacionesByTicketId:', error);
            return res.status(500).json({ message: 'Error al obtener liberaciones.' });
        }
    }

    // GET /api/liberaciones (Admin)
    async getAllLiberaciones(_req: AuthRequest, res: Response) {
        try {
            const liberaciones = await liberacionService.getAllLiberaciones();
            return res.status(200).json(liberaciones);
        } catch (error) {
            console.error('Error en getAllLiberaciones:', error);
            return res.status(500).json({ message: 'Error interno.' });
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
            console.error('Error en deleteLiberacion:', error);
            return res.status(500).json({ message: 'Error al eliminar la liberación.' });
        }
    }
}