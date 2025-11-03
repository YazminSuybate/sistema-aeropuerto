import { PrismaClient } from '@prisma/client';
import type { Area } from '../models/area.model.js';

const prisma = new PrismaClient();

export class AreaRepository {
    async findAll(): Promise<Area[]> {
        return prisma.area.findMany();
    }

    async findById(id_area: number): Promise<Area | null> {
        return prisma.area.findUnique({
            where: { id_area },
        });
    }

    async create(data: Omit<Area, 'id_area'>): Promise<Area> {
        return prisma.area.create({
            data,
        });
    }

    async update(id_area: number, data: Partial<Omit<Area, 'id_area'>>): Promise<Area> {
        return prisma.area.update({
            where: { id_area },
            data,
        });
    }

    async delete(id_area: number): Promise<Area> {
        return prisma.area.delete({
            where: { id_area },
        });
    }
}