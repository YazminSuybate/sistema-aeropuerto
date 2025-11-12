import { PrismaClient } from '@prisma/client';
import type { HistorialTicket, HistorialTicketCreateDTO, HistorialTicketUpdateDTO } from '../models/historialtickets.model.js';

const prisma = new PrismaClient();

export class HistorialTicketRepository {

    async findAll(): Promise<HistorialTicket[]> {
        return prisma.historial_ticket.findMany({
            include: {
                ticket: true,
                usuario: true,
            },
        });
    }

    async findById(id_historial: number): Promise<HistorialTicket | null> {
        return prisma.historial_ticket.findUnique({
            where: { id_historial },
            include: {
                ticket: true,
                usuario: true,
            },
        });
    }

    async create(data: HistorialTicketCreateDTO): Promise<HistorialTicket> {
        return prisma.historial_ticket.create({
            data,
        });
    }

    async update(id_historial: number, data: HistorialTicketUpdateDTO): Promise<HistorialTicket> {
        return prisma.historial_ticket.update({
            where: { id_historial },
            data,
        });
    }

    async delete(id_historial: number): Promise<HistorialTicket> {
        return prisma.historial_ticket.delete({
            where: { id_historial },
        });
    }
}