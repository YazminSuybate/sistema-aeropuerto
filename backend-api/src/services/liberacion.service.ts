import { LiberacionRepository } from '../repositories/liberacion.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js'; // Repositorio de Ticket
import type { LiberacionTicket, CreateLiberacionDto } from '../models/liberacion.model.js';
// FIX 1: 'UnauthorizedError' no existe en tu archivo, lo cambiamos por 'BadRequestError'
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';
import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Necesario para la transacción

export class LiberacionService {

    // Inyectamos AMBOS repositorios
    constructor(
        private liberacionRepository: LiberacionRepository,
        private ticketRepository: TicketRepository
    ) {}

    async getAllLiberaciones(): Promise<LiberacionTicket[]> {
        return this.liberacionRepository.findAll();
    }

    async getLiberacionesByTicketId(id_ticket: number): Promise<LiberacionTicket[]> {
        return this.liberacionRepository.findByTicketId(id_ticket);
    }

    /**
     * Lógica de negocio:
     * 1. Verifica que el ticket exista.
     * 2. Verifica que el usuario que libera sea el responsable actual.
     * 3. Crea el log de liberación.
     * 4. Actualiza el ticket para que id_usuario_responsable sea NULL.
     */
    async createLiberacion(data: CreateLiberacionDto, id_usuario_liberador: number): Promise<LiberacionTicket> {
        const { id_ticket, comentario_liberacion } = data;

        if (!id_ticket) {
            throw new BadRequestError('El ID del ticket es obligatorio.');
        }

        // 1. Verificar el ticket
        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) {
            throw new NotFoundError(`Ticket con ID ${id_ticket} no encontrado.`);
        }

        // 2. Regla de Negocio: Solo puedes liberar un ticket que te pertenece
        // FIX 1: Cambiamos 'UnauthorizedError' por 'BadRequestError'
        if (ticket.id_usuario_responsable !== id_usuario_liberador) {
            throw new BadRequestError('No puedes liberar un ticket que no te pertenece.');
        }

        // 3. Preparar datos del log
        const liberacionData: Prisma.liberacion_ticketCreateInput = {
            // FIX 2: Convertimos 'undefined' a 'null' para ser compatible con Prisma
            comentario_liberacion: comentario_liberacion || null,
            ticket: { connect: { id_ticket: id_ticket } },
            usuario_liberador: { connect: { id_usuario: id_usuario_liberador } }
        };

        // 4. Ejecutar la creación y la actualización en una transacción
        try {
            const [nuevaLiberacion, _ticketActualizado] = await prisma.$transaction([
                // Usamos el método 'create' del repositorio
                prisma.liberacion_ticket.create({ data: liberacionData }),
                
                // Usamos el método 'update' del repositorio de tickets
                prisma.ticket.update({
                    where: { id_ticket: id_ticket },
                    data: { 
                        id_usuario_responsable: null // Libera el ticket
                    }
                })
            ]);
            
            return nuevaLiberacion;

        } catch (error) {
            console.error("Transaction failed in createLiberacion: ", error);
            throw new Error("Error al procesar la liberación del ticket.");
        }
    }

    /**
     * Elimina un registro de liberación (No recomendado en producción).
     */
    async deleteLiberacion(id_liberacion: number): Promise<LiberacionTicket> {
        const liberacion = await this.liberacionRepository.findById(id_liberacion);
        if (!liberacion) {
            throw new NotFoundError(`Liberación con ID ${id_liberacion} no encontrada.`);
        }
        return this.liberacionRepository.delete(id_liberacion);
    }
}