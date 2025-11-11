import { PrismaClient } from '@prisma/client';
import type { Comentario, ComentarioCreateDTO, ComentarioUpdateDTO } from '../models/comentarios.model.js';

const prisma = new PrismaClient();

export class ComentarioRepository {
    async findAll(): Promise<Comentario[]> {
        return prisma.comentario.findMany({
            include: {
                ticket: true,  // Incluir la info del ticket
                usuario: true, // Incluir la info del usuario
            },
        });
    }

    async findById(id_comentario: number): Promise<Comentario | null> {
        return prisma.comentario.findUnique({
            where: { id_comentario },
            include: {
                ticket: true,
                usuario: true,
            },
        });
    }

    async create(data: ComentarioCreateDTO): Promise<Comentario> {
        // Asumimos que la base de datos (o Prisma) maneja 'fecha_comentario'
        // si se configuró con @default(now()) en el schema.prisma
        return prisma.comentario.create({
            data,
        });
    }

    async update(id_comentario: number, data: ComentarioUpdateDTO): Promise<Comentario> {
        return prisma.comentario.update({
            where: { id_comentario },
            data,
        });
    }

    async delete(id_comentario: number): Promise<Comentario> {
        return prisma.comentario.delete({
            where: { id_comentario },
        });
    }
}