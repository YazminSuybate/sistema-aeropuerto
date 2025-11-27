import { PrismaClient } from '@prisma/client';
import type { Rol } from '../models/rol.model.js';

const prisma = new PrismaClient();

export class RolRepository {
    async findAll(): Promise<Rol[]> {
        return prisma.rol.findMany();
    }

    async findById(id_rol: number): Promise<Rol | null> {
        return prisma.rol.findUnique({
            where: { id_rol },
        });
    }

    async findByName(nombre_rol: string): Promise<Rol | null> {
        return prisma.rol.findUnique({
            where: { nombre_rol },
        });
    }

    async create(data: Omit<Rol, 'id_rol'>): Promise<Rol> {
        return prisma.rol.create({
            data,
        });
    }

    async update(id_rol: number, data: Partial<Omit<Rol, 'id_rol'>>): Promise<Rol> {
        return prisma.rol.update({
            where: { id_rol },
            data,
        });
    }

    async delete(id_rol: number): Promise<Rol> {
        return prisma.rol.delete({
            where: { id_rol },
        });
    }

    async getPermissionsByRoleId(id_rol: number): Promise<string[]> {
        const results = await prisma.rol_permiso.findMany({
            where: { id_rol },
            select: { permiso: { select: { nombre: true } } }
        });

        return results.map(rp => rp.permiso.nombre);
    }
}