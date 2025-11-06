import { PrismaClient } from '@prisma/client';
import type { Estado, EstadoCreateDTO, EstadoUpdateDTO } from '../models/estado.model.js';

const prisma = new PrismaClient();

export class EstadoRepository {
    async findAll(): Promise<Estado[]> {
        return prisma.estado.findMany();
    }

    async findById(id_estado: number): Promise<Estado | null> {
        return prisma.estado.findUnique({
            where: { id_estado },
        });
    }

    async create(data: EstadoCreateDTO): Promise<Estado> {
        return prisma.estado.create({
            data,
        });
    }

    async update(id_estado: number, data: EstadoUpdateDTO): Promise<Estado> {
        return prisma.estado.update({
            where: { id_estado },
            data,
        });
    }

    async delete(id_estado: number): Promise<Estado> {
        return prisma.estado.delete({
            where: { id_estado },
        });
    }
}