import { PrismaClient } from '@prisma/client';
import type { Evidencia } from '../models/evidencia.model.js';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class EvidenciaRepository {
    
    /**
     * Busca todas las evidencias de un ticket específico.
     */
    async findByTicketId(id_ticket: number): Promise<Evidencia[]> {
        return prisma.evidencia.findMany({
            where: { id_ticket },
            orderBy: { fecha_subida: 'asc' }
        });
    }

    /**
     * Busca una evidencia por su ID.
     */
    async findById(id_evidencia: number): Promise<Evidencia | null> {
        return prisma.evidencia.findUnique({
            where: { id_evidencia },
        });
    }

    async create(data: Prisma.evidenciaCreateInput): Promise<Evidencia> {
        return prisma.evidencia.create({
            data,
        });
    }

    async delete(id_evidencia: number): Promise<Evidencia> {
        return prisma.evidencia.delete({
            where: { id_evidencia },
        });
    }
}