import { PrismaClient } from '@prisma/client';
import type { SolicitudCambioArea, SolicitudCambioAreaCreateDTO, SolicitudCambioAreaUpdateDTO } from '../models/solicitudcambioarea.model.js';

const prisma = new PrismaClient();

// Basado en el schema 'solicitud_cambio_area'
export class SolicitudCambioAreaRepository {

    async findAll(): Promise<SolicitudCambioArea[]> {
        return prisma.solicitud_cambio_area.findMany({
            include: {
                ticket: true,
                solicitante: true,
                aprobador: true,
                area_origen: true,
                area_destino: true,
            },
        });
    }

    async findById(id_solicitud: number): Promise<SolicitudCambioArea | null> {
        return prisma.solicitud_cambio_area.findUnique({
            where: { id_solicitud },
            include: {
                ticket: true,
                solicitante: true,
                aprobador: true,
                area_origen: true,
                area_destino: true,
            },
        });
    }

    async create(data: SolicitudCambioAreaCreateDTO): Promise<SolicitudCambioArea> {
        return prisma.solicitud_cambio_area.create({
            data,
        });
    }

    async update(id_solicitud: number, data: SolicitudCambioAreaUpdateDTO): Promise<SolicitudCambioArea> {
        return prisma.solicitud_cambio_area.update({
            where: { id_solicitud },
            data,
        });
    }

    async delete(id_solicitud: number): Promise<SolicitudCambioArea> {
        return prisma.solicitud_cambio_area.delete({
            where: { id_solicitud },
        });
    }
}