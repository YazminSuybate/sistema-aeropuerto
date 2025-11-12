import { PrismaClient } from '@prisma/client';
import type { HistorialTicket, HistorialTicketCreateDTO, HistorialTicketUpdateDTO } from '../models/historialtickets.model.js';

const prisma = new PrismaClient();

// Asumiendo que el modelo en schema.prisma se llama 'historialTicket'
// (mapeado de 'historial_ticket' en la BD)
export class HistorialTicketRepository {

    async findAll(): Promise<HistorialTicket[]> {
        return prisma.historialTicket.findMany({
            include: {
                ticket: true,
                usuario: true,
            },
        });
    }

    async findById(id_historial: number): Promise<HistorialTicket | null> {
        return prisma.historialTicket.findUnique({
            where: { id_historial },
            include: {
                ticket: true,
                usuario: true,
            },
        });
    }

    async create(data: HistorialTicketCreateDTO): Promise<HistorialTicket> {
        // Asumimos que la BD (o Prisma) maneja 'fecha_cambio'
        return prisma.historialTicket.create({
            data,
        });
    }

    async update(id_historial: number, data: HistorialTicketUpdateDTO): Promise<HistorialTicket> {
        return prisma.historialTicket.update({
            where: { id_historial },
            data,
        });
    }

    async delete(id_historial: number): Promise<HistorialTicket> {
        return prisma.historialTicket.delete({
            where: { id_historial },
        });
    }
}