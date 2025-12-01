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

    // --- NUEVOS MÉTODOS PARA MULTI-SESIÓN ---

    async createRefreshToken(id_usuario: number, token: string): Promise<void> {
        await prisma.refresh_token.create({
            data: {
                token,
                id_usuario
            }
        });
    }

    async deleteRefreshToken(token: string): Promise<void> {
        // Usamos deleteMany porque 'token' es TEXT y podría no ser único en definición prisma aunque lo sea en lógica
        await prisma.refresh_token.deleteMany({
            where: { token },
        });
    }

    // Busca el usuario dueño de un refresh token
    async findUserByRefreshToken(token: string): Promise<Usuario | null> {
        const tokenRecord = await prisma.refresh_token.findFirst({
            where: { token },
            include: {
                usuario: {
                    include: { rol: true, area: true }
                }
            }
        });

        return tokenRecord ? tokenRecord.usuario : null;
    }
    
    async findByEmailWithRole(email: string): Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { email },
            include: {
                rol: true,
            },
        });
    }

    async findByIdWithRoleAndArea(id_usuario: number): Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { id_usuario },
            include: {
                rol: true,
                area: true,
            },
        });
    }

    async deleteAllTokensForUser(id_usuario: number): Promise<void> {
        await prisma.refresh_token.deleteMany({
            where: { id_usuario },
        });
    }
}