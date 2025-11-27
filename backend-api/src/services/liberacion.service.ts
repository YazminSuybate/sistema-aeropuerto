import { LiberacionRepository } from '../repositories/liberacion.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import type { LiberacionTicket, CreateLiberacionDto } from '../models/liberacion.model.js';
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';
import type { Prisma } from '@prisma/client';

export class LiberacionService {
    constructor(
        private liberacionRepository: LiberacionRepository,
        private ticketRepository: TicketRepository
    ) { }

    async getAllLiberaciones(): Promise<LiberacionTicket[]> {
        return this.liberacionRepository.findAll();
    }

    async getLiberacionesByTicketId(id_ticket: number): Promise<LiberacionTicket[]> {
        return this.liberacionRepository.findByTicketId(id_ticket);
    }

    async createLiberacion(data: CreateLiberacionDto, id_usuario_liberador: number): Promise<LiberacionTicket> {
        const { id_ticket, comentario_liberacion } = data;

        if (!id_ticket) {
            throw new BadRequestError('El ID del ticket es obligatorio.');
        }

        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) {
            throw new NotFoundError(`Ticket con ID ${id_ticket} no encontrado.`);
        }

        if (ticket.id_usuario_responsable !== id_usuario_liberador) {
            throw new BadRequestError('No puedes liberar un ticket que no te pertenece.');
        }

        const liberacionData: Prisma.liberacion_ticketCreateInput = {
            comentario_liberacion: comentario_liberacion || null,
            ticket: { connect: { id_ticket: id_ticket } },
            usuario_liberador: { connect: { id_usuario: id_usuario_liberador } }
        };

        return this.liberacionRepository.createLiberationAndUnassignTicket(
            liberacionData,
            id_ticket
        );
    }

    async deleteLiberacion(id_liberacion: number): Promise<LiberacionTicket> {
        const liberacion = await this.liberacionRepository.findById(id_liberacion);
        if (!liberacion) {
            throw new NotFoundError(`Liberación con ID ${id_liberacion} no encontrada.`);
        }
        return this.liberacionRepository.delete(id_liberacion);
    }
}