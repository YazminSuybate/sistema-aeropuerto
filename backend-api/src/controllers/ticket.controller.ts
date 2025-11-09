import type { Response } from 'express';
// Importamos la interfaz AuthRequest que creaste en tu auth.middleware
import type { AuthRequest } from '../middleware/auth.middleware.js'; 

// Importamos todos los repositorios y servicios necesarios
import { TicketRepository } from '../repositories/ticket.repository.js';
import { CategoriaRepository } from '../repositories/categoria.repository.js';
import { EstadoRepository } from '../repositories/estado.repository.js';
import { TicketService } from '../services/ticket.service.js';

// Instanciamos todo siguiendo tu patrón
// (Asumimos que tienes CategoriaRepository y EstadoRepository creados)
const ticketRepository = new TicketRepository();
const categoriaRepository = new CategoriaRepository(); 
const estadoRepository = new EstadoRepository(); 
const ticketService = new TicketService(ticketRepository, categoriaRepository, estadoRepository);

// Helper de validación de ID (igual al tuyo)
function validateAndGetId(req: AuthRequest, res: Response): number | null {
    const id_param = req.params.id;
    if (!id_param) {
        res.status(400).json({ message: 'ID de ticket faltante.' });
        return null;
    }
    const id_ticket = parseInt(id_param, 10);
    if (isNaN(id_ticket)) {
        res.status(400).json({ message: 'ID de ticket inválido.' });
        return null;
    }
    return id_ticket;
}

export class TicketController {
    
    // GET /api/tickets
    async getAllTickets(_req: AuthRequest, res: Response) {
        try {
            const tickets = await ticketService.getAllTickets();
            return res.status(200).json(tickets);
        } catch (error) {
            console.error('Error en getAllTickets:', error);
            return res.status(500).json({ message: 'Error interno al obtener tickets.' });
        }
    }

    // GET /api/tickets/:id
    async getTicketById(req: AuthRequest, res: Response) {
        const id_ticket = validateAndGetId(req, res);
        if (id_ticket === null) return; 

        try {
            const ticket = await ticketService.getTicketById(id_ticket);
            return res.status(200).json(ticket);
        } catch (error: any) {
            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            console.error('Error en getTicketById:', error);
            return res.status(500).json({ message: 'Error al obtener el ticket.' });
        }
    }

    // POST /api/tickets
    async createTicket(req: AuthRequest, res: Response) {
        try {
            // El ID del creador viene del token (middleware 'protect')
            const id_usuario_creador = req.user!.id; 
            const data = req.body;

            const nuevoTicket = await ticketService.createTicket(data, id_usuario_creador);
            return res.status(201).json(nuevoTicket);
        } catch (error: any) {
            console.error('Error en createTicket:', error);
            if (error.message?.includes('obligatorio')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message?.includes('no encontrada')) {
                return res.status(404).json({ message: 'La categoría o pasajero especificado no existe.' });
            }
            return res.status(500).json({ message: 'Error al crear el ticket.' });
        }
    }

    // PUT /api/tickets/:id (Actualización de detalles)
    async updateTicketDetails(req: AuthRequest, res: Response) {
        const id_ticket = validateAndGetId(req, res);
        if (id_ticket === null) return;

        try {
            const data = req.body;
            const ticketActualizado = await ticketService.updateTicketDetails(id_ticket, data);
            return res.status(200).json(ticketActualizado);
        } catch (error: any) {
            console.error('Error en updateTicketDetails:', error);
            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message?.includes('proporcionar al menos')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Error al actualizar el ticket.' });
        }
    }

    // DELETE /api/tickets/:id
    async deleteTicket(req: AuthRequest, res: Response) {
        const id_ticket = validateAndGetId(req, res);
        if (id_ticket === null) return;

        try {
            await ticketService.deleteTicket(id_ticket);
            return res.status(204).send(); // 204 No Content
        } catch (error: any) {
            console.error('Error en deleteTicket:', error);
            
            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            
            // Error de FK de Prisma (Copiado de tu 'area.controller')
            if (error.code === 'P2003') {
                return res.status(409).json({ 
                    message: `No se puede eliminar el ticket ${id_ticket} porque tiene comentarios, historial u otras entidades asociadas.`,
                    code: 'P2003'
                });
            }
            return res.status(500).json({ message: 'Error al eliminar el ticket.' });
        }
    }
}