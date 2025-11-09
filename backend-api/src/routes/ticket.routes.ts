import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller.js';
import { createTicketValidation, updateTicketValidation } from '../middleware/validation/ticket.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const ticketController = new TicketController();

// === CRUD BÁSICO ===

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('TICKET_READ_ALL'), // Asumiendo este permiso
    ticketController.getAllTickets);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('TICKET_READ_ID'), // Asumiendo este permiso
    ticketController.getTicketById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('TICKET_CREATE'), // Asumiendo este permiso
    // createTicketValidation, // Descomentar cuando tengas express-validator
    ticketController.createTicket);

// Actualizar (solo detalles)
router.put('/:id',
    protect,
    authorizeDynamic('TICKET_UPDATE'), // Asumiendo este permiso
    // updateTicketValidation, // Descomentar
    ticketController.updateTicketDetails);

// Eliminar (o cancelar)
router.delete('/:id',
    protect,
    authorizeDynamic('TICKET_DELETE'), // Asumiendo este permiso
    ticketController.deleteTicket);

export default router;