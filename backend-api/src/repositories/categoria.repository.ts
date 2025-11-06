import { PrismaClient } from '@prisma/client';
import type { Categoria, CategoriaCreateDTO, CategoriaUpdateDTO } from '../models/categoria.model.js';

const prisma = new PrismaClient();

export class CategoriaRepository {
    async findAll(): Promise<Categoria[]> {
        return prisma.categoria.findMany({
            include: {
                area_default: true,
            },
        });
    }

    async findById(id_categoria: number): Promise<Categoria | null> {
        return prisma.categoria.findUnique({
            where: { id_categoria },
            include: {
                area_default: true,
            },
        });
    }

    async create(data: CategoriaCreateDTO): Promise<Categoria> {
        return prisma.categoria.create({
            data,
        });
    }

    async update(id_categoria: number, data: CategoriaUpdateDTO): Promise<Categoria> {
        return prisma.categoria.update({
            where: { id_categoria },
            data,
        });
    }

    async delete(id_categoria: number): Promise<Categoria> {
        return prisma.categoria.delete({
            where: { id_categoria },
        });
    }
}