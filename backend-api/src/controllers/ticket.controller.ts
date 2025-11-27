import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import { TicketRepository } from "../repositories/ticket.repository.js";
import { CategoriaRepository } from "../repositories/categoria.repository.js";
import { EstadoRepository } from "../repositories/estado.repository.js";
import { TicketService } from "../services/ticket.service.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const ticketRepository = new TicketRepository();
const categoriaRepository = new CategoriaRepository();
const estadoRepository = new EstadoRepository();
const usuarioRepository = new UsuarioRepository();
const ticketService = new TicketService(
  ticketRepository,
  categoriaRepository,
  estadoRepository,
  usuarioRepository
);

export class TicketController {
  // GET /api/tickets
  async getAllTickets(_req: AuthRequest, res: Response) {
    try {
      const tickets = await ticketService.getAllTickets();
      return res.status(200).json(tickets);
    } catch (error) {

      return handleControllerError(error, res, "Error al obtener los tickets");
    }
  }

  // GET /api/tickets/:id
  async getTicketById(req: AuthRequest, res: Response) {
    const id_ticket = validateAndGetId(req, res, 'id');
    if (id_ticket === null) return;

    try {
      const ticket = await ticketService.getTicketById(id_ticket);
      return res.status(200).json(ticket);
    } catch (error: any) {
      if (error.message?.includes("no encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return handleControllerError(error, res, "Error al obtener el ticket");
    }
  }

  // GET /api/tickets/area/:id_area
  async getTicketsByAreaId(req: AuthRequest, res: Response) {
    const id_param = req.params.id_area;
    if (!id_param) {
      return res.status(400).json({ message: "ID de área faltante." });
    }
    const id_area = parseInt(id_param, 10);
    if (isNaN(id_area)) {
      return res.status(400).json({ message: "ID de área inválido." });
    }

    try {
      const tickets = await ticketService.getTicketsByAreaId(id_area);
      return res.status(200).json(tickets);
    } catch (error) {
      return handleControllerError(error, res, "Error al obtener tickets por área");
    }
  }

  // GET /api/tickets/responsable/:id_usuario
  async getTicketsByResponsibleId(req: AuthRequest, res: Response) {
    const id_param = req.params.id_usuario;
    if (!id_param) {
      return res
        .status(400)
        .json({ message: "ID de usuario (responsable) faltante." });
    }
    const id_usuario = parseInt(id_param, 10);
    if (isNaN(id_usuario)) {
      return res
        .status(400)
        .json({ message: "ID de usuario (responsable) inválido." });
    }

    try {
      const tickets = await ticketService.getTicketsByResponsibleId(id_usuario);
      return res.status(200).json(tickets);
    } catch (error) {
      return handleControllerError(error, res, "Error al obtener tickets por responsable");
    }
  }

  // PUT /api/tickets/:id/assign
  async assignTicket(req: AuthRequest, res: Response) {
    const id_ticket = validateAndGetId(req, res,'id');
    if (id_ticket === null) return;

    const { id_operador } = req.body;
    if (!id_operador || isNaN(parseInt(id_operador, 10))) {
      return res.status(400).json({
        message: 'Falta el campo "id_operador" (numérico) en el body.',
      });
    }

    try {
      const ticketAsignado = await ticketService.assignTicketToOperator(
        id_ticket,
        parseInt(id_operador, 10)
      );
      return res.status(200).json(ticketAsignado);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof BadRequestError) {
        return res.status(400).json({ message: error.message });
      }
      return handleControllerError(error, res, "Error al asignar el ticket");
    }
  }

  // PUT /api/tickets/:id/claim
  async claimTicket(req: AuthRequest, res: Response) {
    const id_ticket = validateAndGetId(req, res,'id');
    if (id_ticket === null) return;

    const user = req.user!;

    try {
      const ticketAsignado = await ticketService.claimTicket(id_ticket, user);
      return res.status(200).json(ticketAsignado);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof BadRequestError) {
        return res.status(400).json({ message: error.message });
      }
      return handleControllerError(error, res, "Error al reclamar el ticket");
    }
  }

  // POST /api/tickets
  async createTicket(req: AuthRequest, res: Response) {
    try {
      const id_usuario_creador = req.user!.id;
      const data = req.body;

      const nuevoTicket = await ticketService.createTicket(
        data,
        id_usuario_creador
      );
      return res.status(201).json(nuevoTicket);
    } catch (error: any) {
      if (error.message?.includes("obligatorio")) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message?.includes("no encontrada")) {
        return res
          .status(404)
          .json({ message: "La categoría o pasajero especificado no existe." });
      }
      return handleControllerError(error, res, "Error al crear el ticket");
    }
  }

  // PUT /api/tickets/:id (Actualización de detalles)
  async updateTicketDetails(req: AuthRequest, res: Response) {
    const id_ticket = validateAndGetId(req, res, 'id');
    if (id_ticket === null) return;

    try {
      const data = req.body;
      const ticketActualizado = await ticketService.updateTicketDetails(
        id_ticket,
        data
      );
      return res.status(200).json(ticketActualizado);
    } catch (error: any) {
      console.error("Error en updateTicketDetails:", error);
      if (error.message?.includes("no encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message?.includes("proporcionar al menos")) {
        return res.status(400).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Error al actualizar el ticket." });
    }
  }

  // DELETE /api/tickets/:id
  async deleteTicket(req: AuthRequest, res: Response) {
    const id_ticket = validateAndGetId(req, res, 'id');
    if (id_ticket === null) return;

    try {
      await ticketService.deleteTicket(id_ticket);
      return res.status(204).send();
    } catch (error: any) {
      console.error("Error en deleteTicket:", error);

      if (error.message?.includes("no encontrado")) {
        return res.status(404).json({ message: error.message });
      }

      if (error.code === "P2003") {
        return res.status(409).json({
          message: `No se puede eliminar el ticket ${id_ticket} porque tiene comentarios, historial u otras entidades asociadas.`,
          code: "P2003",
        });
      }
      return handleControllerError(error, res, "Error al eliminar el ticket");
    }
  }
}
