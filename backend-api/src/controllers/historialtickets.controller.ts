import type { Request, Response } from 'express';
import { HistorialTicketsService } from '../services/historialtickets.service.js';
import { HistorialTicketRepository } from '../repositories/historialtickets.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const historialTicketRepository = new HistorialTicketRepository();
const ticketRepository = new TicketRepository();
const usuarioRepository = new UsuarioRepository();
const historialService = new HistorialTicketsService(
    historialTicketRepository,
    ticketRepository,
    usuarioRepository
);

export class HistorialTicketsController {
    // GET api/historialtickets
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const historial = await historialService.getAllHistorialTickets();
            res.status(200).json(historial);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener historial de tickets');
        }
    }

    // GET api/historialtickets/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_historial = validateAndGetId(req, res, 'id_historial');
        if (id_historial === null) return;

        try {
            const historialEntry = await historialService.getHistorialTicketById(id_historial);
            res.status(200).json(historialEntry);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener la entrada de historial');
        }
    }


    // POST api/historialtickets
    async create(req: Request, res: Response): Promise<void> {
        const { tipo_cambio, valor_anterior, valor_nuevo, id_ticket, id_usuario } = req.body;

        try {
            const data = {
                tipo_cambio,
                valor_anterior,
                valor_nuevo,
                id_ticket: Number(id_ticket),
                id_usuario: Number(id_usuario)
            };
            const newEntry = await historialService.createHistorialTicket(data);
            res.status(201).json(newEntry);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear entrada de historial.');
        }
    }

    // PUT api/historialtickets/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_historial = validateAndGetId(req, res, 'id_historial');
        if (id_historial === null) return;

        const data = req.body;

        try {
            const updatedEntry = await historialService.updateHistorialTicket(id_historial, data);
            res.status(200).json(updatedEntry);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar la entrada de historial.');
        }
    }

    // DELETE api/historialtickets/:id
    async remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> {
        const id_historial = validateAndGetId(req, res, 'id_historial');
        if (id_historial === null) return;

        try {
            await historialService.deleteHistorialTicket(id_historial);
            res.status(204).send();
        } catch (error: any) {
            handleControllerError(error, res, 'Error al eliminar la entrada de historial.');
        }
    }
}