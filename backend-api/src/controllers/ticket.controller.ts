import type { Response } from "express";
// Importamos la interfaz AuthRequest que creaste en tu auth.middleware
import type { AuthRequest } from "../middleware/auth.middleware.js";

// Importamos todos los repositorios y servicios necesarios
import { TicketRepository } from "../repositories/ticket.repository.js";
import { CategoriaRepository } from "../repositories/categoria.repository.js";
import { EstadoRepository } from "../repositories/estado.repository.js";
import { TicketService } from "../services/ticket.service.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";

// Instanciamos todo siguiendo tu patrón
// (Asumimos que tienes CategoriaRepository y EstadoRepository creados)
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

// Helper de validación de ID (igual al tuyo)
function validateAndGetId(req: AuthRequest, res: Response): number | null {
  const id_param = req.params.id;
  if (!id_param) {
    res.status(400).json({ message: "ID de ticket faltante." });
    return null;
  }
  const id_ticket = parseInt(id_param, 10);
  if (isNaN(id_ticket)) {
    res.status(400).json({ message: "ID de ticket inválido." });
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
      console.error("Error en getAllTickets:", error);
      return res
        .status(500)
        .json({ message: "Error interno al obtener tickets." });
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
      if (error.message?.includes("no encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      console.error("Error en getTicketById:", error);
      return res.status(500).json({ message: "Error al obtener el ticket." });
    }
  }

  // GET /api/tickets/area/:id_area
  async getTicketsByAreaId(req: AuthRequest, res: Response) {
    // 1. Validar el ID del área desde los parámetros
    const id_param = req.params.id_area;
    if (!id_param) {
      return res.status(400).json({ message: "ID de área faltante." });
    }
    const id_area = parseInt(id_param, 10);
    if (isNaN(id_area)) {
      return res.status(400).json({ message: "ID de área inválido." });
    }

    // 2. Llamar al servicio
    try {
      const tickets = await ticketService.getTicketsByAreaId(id_area);
      // Un array vacío es una respuesta 200 OK, no un 404.
      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error en getTicketsByAreaId:", error);
      return res
        .status(500)
        .json({ message: "Error interno al obtener tickets por área." });
    }
  }

  // GET /api/tickets/responsable/:id_usuario
  async getTicketsByResponsibleId(req: AuthRequest, res: Response) {
    // 1. Validar el ID de usuario desde los parámetros
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

    // 2. Llamar al servicio
    try {
      const tickets = await ticketService.getTicketsByResponsibleId(id_usuario);
      return res.status(200).json(tickets);
    } catch (error) {
      console.error("Error en getTicketsByResponsibleId:", error);
      return res
        .status(500)
        .json({ message: "Error interno al obtener tickets por responsable." });
    }
  }

  // PUT /api/tickets/:id/assign
  async assignTicket(req: AuthRequest, res: Response) {
    // 1. Validar el ID del ticket desde la URL
    const id_ticket = validateAndGetId(req, res);
    if (id_ticket === null) return;

    // 2. Validar el ID del operador desde el body
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
      console.error("Error en assignTicket:", error);

      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof BadRequestError) {
        return res.status(400).json({ message: error.message });
      }

      return res
        .status(500)
        .json({ message: "Error interno al asignar el ticket." });
    }
  }

  // PUT /api/tickets/:id/claim
  async claimTicket(req: AuthRequest, res: Response) {
    // 1. Validar el ID del ticket desde la URL
    const id_ticket = validateAndGetId(req, res);
    if (id_ticket === null) return;

    // 2. ¡La clave! Obtenemos el usuario del token (middleware 'protect')
    const user = req.user!;

    try {
      // 3. Llamamos al nuevo servicio
      const ticketAsignado = await ticketService.claimTicket(id_ticket, user);
      return res.status(200).json(ticketAsignado);
    } catch (error: any) {
      console.error("Error en claimTicket:", error);

      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      if (error instanceof BadRequestError) {
        // Captura el error de "área no coincide" o "ya asignado"
        return res.status(400).json({ message: error.message });
      }

      return res
        .status(500)
        .json({ message: "Error interno al tomar el ticket." });
    }
  }

  // POST /api/tickets
  async createTicket(req: AuthRequest, res: Response) {
    try {
      // El ID del creador viene del token (middleware 'protect')
      const id_usuario_creador = req.user!.id;
      const data = req.body;

      const nuevoTicket = await ticketService.createTicket(
        data,
        id_usuario_creador
      );
      return res.status(201).json(nuevoTicket);
    } catch (error: any) {
      console.error("Error en createTicket:", error);
      if (error.message?.includes("obligatorio")) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message?.includes("no encontrada")) {
        return res
          .status(404)
          .json({ message: "La categoría o pasajero especificado no existe." });
      }
      return res.status(500).json({ message: "Error al crear el ticket." });
    }
  }

  // PUT /api/tickets/:id (Actualización de detalles)
  async updateTicketDetails(req: AuthRequest, res: Response) {
    const id_ticket = validateAndGetId(req, res);
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
    const id_ticket = validateAndGetId(req, res);
    if (id_ticket === null) return;

    try {
      await ticketService.deleteTicket(id_ticket);
      return res.status(204).send(); // 204 No Content
    } catch (error: any) {
      console.error("Error en deleteTicket:", error);

      if (error.message?.includes("no encontrado")) {
        return res.status(404).json({ message: error.message });
      }

      // Error de FK de Prisma (Copiado de tu 'area.controller')
      if (error.code === "P2003") {
        return res.status(409).json({
          message: `No se puede eliminar el ticket ${id_ticket} porque tiene comentarios, historial u otras entidades asociadas.`,
          code: "P2003",
        });
      }
      return res.status(500).json({ message: "Error al eliminar el ticket." });
    }
  }
}
