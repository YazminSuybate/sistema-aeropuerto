import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
// import { createTicketValidation, updateTicketValidation } from '../middleware/validation/ticket.validation.js';
import { protect } from "../middleware/auth.middleware.js";
import { authorizeDynamic } from "../middleware/authorize.middleware.js";

const router = Router();
const ticketController = new TicketController();

// === CRUD BÁSICO ===

// Obtener todos
router.get(
  "/",
  protect,
  authorizeDynamic("TICKET_READ_ALL"), // Asumiendo este permiso
  ticketController.getAllTickets
);

// Obtener por ID
router.get(
  "/:id",
  protect,
  authorizeDynamic("TICKET_READ_ID"), // Asumiendo este permiso
  ticketController.getTicketById
);

// Crear uno nuevo
router.post(
  "/",
  protect,
  authorizeDynamic("TICKET_CREATE"), // Asumiendo este permiso
  // createTicketValidation, // Descomentar cuando tengas express-validator
  ticketController.createTicket
);

// Actualizar (solo detalles)
router.put(
  "/:id",
  protect,
  authorizeDynamic("TICKET_UPDATE"), // Asumiendo este permiso
  // updateTicketValidation, // Descomentar
  ticketController.updateTicketDetails
);

// Eliminar (o cancelar)
router.delete(
  "/:id",
  protect,
  authorizeDynamic("TICKET_DELETE"), // Asumiendo este permiso
  ticketController.deleteTicket
);

// Obtener tickets por ID de Área
router.get(
  "/area/:id_area",
  protect,
  authorizeDynamic("TICKET_READ_BY_AREA"), // Asumiendo este permiso
  ticketController.getTicketsByAreaId
);

// Obtener tickets por ID de Responsable
router.get(
  "/responsable/:id_usuario",
  protect,
  authorizeDynamic("TICKET_READ_BY_RESPONSIBLE"), // Asumiendo este permiso
  ticketController.getTicketsByResponsibleId
);

// Asignar un ticket a un operador
router.put(
  "/:id/assign",
  protect,
  authorizeDynamic("TICKET_ASSIGN"), // ¡Nuevo permiso!
  ticketController.assignTicket
);

// Tomar (reclamar) un ticket para uno mismo
router.put(
  "/:id/claim",
  protect,
  authorizeDynamic("TICKET_CLAIM"), // ¡Nuevo permiso!
  ticketController.claimTicket
);

export default router;
