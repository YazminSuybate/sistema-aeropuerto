import { PrismaClient } from '@prisma/client';
import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO } from '../models/usuario.model.js';

const prisma = new PrismaClient();

export class UsuarioRepository {
    async findAll(): Promise<Usuario[]> {
        return prisma.usuario.findMany({
            include: {
                rol: true,
                area: true,
            },
        });
    }

    async findById(id_usuario: number): Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { id_usuario },
            include: {
                rol: true,
                area: true,
            },
        });
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { email },
            include: {
                rol: true,
                area: true,
            },
        });
    }

    async create(data: UsuarioCreateDTO): Promise<Usuario> {
        return prisma.usuario.create({ data });
    }

    async update(id_usuario: number, data: UsuarioUpdateDTO): Promise<Usuario> {
        return prisma.usuario.update({
            where: { id_usuario },
            data,
        });
    }

    async softDelete(id_usuario: number): Promise<Usuario> {
        return prisma.usuario.update({
            where: { id_usuario },
            data: {
                activo: false,
            },
        });
    }
}