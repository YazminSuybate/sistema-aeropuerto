import { PrismaClient } from '@prisma/client';
import type { LiberacionTicket } from '../models/liberacion.model.js';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class LiberacionRepository {

    async findAll(): Promise<LiberacionTicket[]> {
        return prisma.liberacion_ticket.findMany({
            include: {
                usuario_liberador: { select: { nombre: true, apellido: true } }
            },
            orderBy: { fecha_liberacion: 'desc' }
        });
    }

    async findById(id_liberacion: number): Promise<LiberacionTicket | null> {
        return prisma.liberacion_ticket.findUnique({
            where: { id_liberacion },
        });
    }

    async findByTicketId(id_ticket: number): Promise<LiberacionTicket[]> {
        return prisma.liberacion_ticket.findMany({
            where: { id_ticket },
            include: {
                usuario_liberador: { select: { nombre: true, apellido: true } }
            },
            orderBy: { fecha_liberacion: 'asc' }
        });
    }

    async create(data: Prisma.liberacion_ticketCreateInput): Promise<LiberacionTicket> {
        return prisma.liberacion_ticket.create({
            data,
        });
    }

    async delete(id_liberacion: number): Promise<LiberacionTicket> {
        return prisma.liberacion_ticket.delete({
            where: { id_liberacion },
        });
    }

    async createLiberationAndUnassignTicket(
        liberacionData: Prisma.liberacion_ticketCreateInput,
        id_ticket: number
    ): Promise<LiberacionTicket> {
        try {
            const [nuevaLiberacion, _ticketActualizado] = await prisma.$transaction([
                prisma.liberacion_ticket.create({ data: liberacionData }),

                prisma.ticket.update({
                    where: { id_ticket },
                    data: {
                        id_usuario_responsable: null
                    }
                })
            ]);

            return nuevaLiberacion;

        } catch (error) {
            console.error("Transaction failed in createLiberationAndUnassignTicket: ", error);
            throw error;
        }
    }
}