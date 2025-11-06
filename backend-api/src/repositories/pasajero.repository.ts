import { PrismaClient } from '@prisma/client';
import type { Pasajero, PasajeroCreateDTO, PasajeroUpdateDTO } from '../models/pasajero.model.js';

const prisma = new PrismaClient();

export class PasajeroRepository {
    async findAll(): Promise<Pasajero[]> {
        return prisma.pasajero.findMany();
    }

    async findById(id_pasajero: number): Promise<Pasajero | null> {
        return prisma.pasajero.findUnique({
            where: { id_pasajero },
        });
    }

    async create(data: PasajeroCreateDTO): Promise<Pasajero> {
        return prisma.pasajero.create({
            data,
        });
    }

    async update(id_pasajero: number, data: PasajeroUpdateDTO): Promise<Pasajero> {
        return prisma.pasajero.update({
            where: { id_pasajero },
            data,
        });
    }

    async delete(id_pasajero: number): Promise<Pasajero> {
        return prisma.pasajero.delete({
            where: { id_pasajero },
        });
    }

    async findByDocumentoId(documento_id: string): Promise<Pasajero | null> {
        return prisma.pasajero.findUnique({
            where: { documento_id },
        });
    }
}