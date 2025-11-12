import type { Request, Response } from 'express';
import { HistorialTicketsService } from '../services/historialtickets.service.js';
import { HistorialTicketRepository } from '../repositories/historialtickets.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { CustomError } from '../errors/custom.error.js';

// Instanciamos repositorios y el servicio
const historialTicketRepository = new HistorialTicketRepository();
const ticketRepository = new TicketRepository();
const usuarioRepository = new UsuarioRepository();
const historialService = new HistorialTicketsService(
    historialTicketRepository, 
    ticketRepository, 
    usuarioRepository
);

// Función genérica para manejar errores del controlador
function handleControllerError(error: any, res: Response, defaultMessage: string): Response | void {
    console.error(`Error en el controlador de HistorialTickets:`, error);

    if (error && error.statusCode) {
        return res.status((error as CustomError).statusCode).json({ message: error.message });
    }

    if (error.code) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: error.message || 'El recurso ya existe.', code: 'P2002' });
            case 'P2003':
                return res.status(400).json({ message: error.message || 'Error de llave foránea. Recurso asociado inválido.', code: 'P2003' });
        }
    }

    return res.status(500).json({ message: defaultMessage });
};

// Función para validar y obtener el ID de los parámetros
function validateAndGetId(req: Request, res: Response): number | null {
    const idParam = req.params.id;

    if (!idParam) {
        res.status(400).json({ message: 'El ID de historial es obligatorio en la ruta.' });
        return null;
    }

    const id_historial = parseInt(idParam, 10);

    if (isNaN(id_historial)) {
        res.status(400).json({ message: 'ID de historial inválido' });
        return null;
    }

    return id_historial;
}


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
        const id_historial = validateAndGetId(req, res);
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
        // Basado en el diagrama de BD
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
        const id_historial = validateAndGetId(req, res);
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
        const id_historial = validateAndGetId(req, res);
        if (id_historial === null) return;

        try {
            await historialService.deleteHistorialTicket(id_historial);
            res.status(204).send(); // No content
        } catch (error: any) {
            handleControllerError(error, res, 'Error al eliminar la entrada de historial.');
        }
    }
}