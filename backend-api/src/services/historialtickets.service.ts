import type { HistorialTicketRepository } from "../repositories/historialtickets.repository.js";
import type { TicketRepository } from "../repositories/ticket.repository.js";
import type { UsuarioRepository } from "../repositories/usuario.repository.js";
import type { HistorialTicket, HistorialTicketCreateDTO, HistorialTicketUpdateDTO } from "../models/historialtickets.model.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";

export class HistorialTicketsService {
    private historialRepository: HistorialTicketRepository;
    private ticketRepository: TicketRepository;
    private usuarioRepository: UsuarioRepository;

    constructor(
        historialRepository: HistorialTicketRepository, 
        ticketRepository: TicketRepository, 
        usuarioRepository: UsuarioRepository
    ) {
        this.historialRepository = historialRepository;
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async getAllHistorialTickets(): Promise<HistorialTicket[]> {
        return this.historialRepository.findAll();
    }

    async getHistorialTicketById(id_historial: number): Promise<HistorialTicket> {
        const historialEntry = await this.historialRepository.findById(id_historial);
        if (!historialEntry) {
            throw new NotFoundError(`Historial con ID ${id_historial} no encontrado.`);
        }
        return historialEntry;
    }

    // (Estos métodos de validación son idénticos a los de ComentarioService)
    private async validateTicket(id_ticket: number) {
        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) {
            throw new BadRequestError(`El Ticket con ID ${id_ticket} no existe.`);
        }
    }

    private async validateUsuario(id_usuario: number) {
        const usuario = await this.usuarioRepository.findById(id_usuario);
        if (!usuario) {
            throw new BadRequestError(`El Usuario con ID ${id_usuario} no existe.`);
        }
    }

    async createHistorialTicket(data: HistorialTicketCreateDTO): Promise<HistorialTicket> {
        // 1. Validar lógica de negocio
        if (!data.tipo_cambio || data.tipo_cambio.trim() === '') {
            throw new BadRequestError("El tipo de cambio es obligatorio.");
        }
        if (!data.id_ticket) {
            throw new BadRequestError("El ID de ticket es obligatorio.");
        }
        if (!data.id_usuario) {
            throw new BadRequestError("El ID de usuario es obligatorio.");
        }
        // Nota: valor_anterior y valor_nuevo pueden ser null o vacíos,
        // así que no los validamos como 'notEmpty'.

        // 2. Validar llaves foráneas
        await this.validateTicket(data.id_ticket);
        await this.validateUsuario(data.id_usuario);

        // 3. Crear el recurso
        return this.historialRepository.create(data);
    }

    async updateHistorialTicket(id_historial: number, data: HistorialTicketUpdateDTO): Promise<HistorialTicket> {
        // 1. Asegurar que la entrada existe
        await this.getHistorialTicketById(id_historial);

        // 2. Validar lógica de negocio (solo si se envía el campo)
        if (data.tipo_cambio?.trim() === '') {
            throw new BadRequestError("El tipo de cambio no puede estar vacío.");
        }
        
        // 3. Validar FKs (si se permite cambiarlos en la actualización)
        if (data.id_ticket) {
            await this.validateTicket(data.id_ticket);
        }
        if (data.id_usuario) {
            await this.validateUsuario(data.id_usuario);
        }

        // 4. Actualizar
        return this.historialRepository.update(id_historial, data);
    }

    async deleteHistorialTicket(id_historial: number): Promise<HistorialTicket> {
        await this.getHistorialTicketById(id_historial); // Asegurarse que existe
        return this.historialRepository.delete(id_historial);
    }
}