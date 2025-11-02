import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class UsuarioRepository {
    async findAll() {
        return prisma.usuario.findMany({
            include: {
                rol: true,
                area: true,
            },
        });
    }
    async findById(id_usuario) {
        return prisma.usuario.findUnique({
            where: { id_usuario },
            include: {
                rol: true,
                area: true,
            },
        });
    }
    async findByEmail(email) {
        return prisma.usuario.findUnique({
            where: { email },
            include: {
                rol: true,
                area: true,
            },
        });
    }
    async create(data) {
        return prisma.usuario.create({ data });
    }
    async update(id_usuario, data) {
        return prisma.usuario.update({
            where: { id_usuario },
            data,
        });
    }
    async softDelete(id_usuario) {
        return prisma.usuario.update({
            where: { id_usuario },
            data: {
                activo: false,
            },
        });
    }
}
//# sourceMappingURL=usuario.repository.js.map