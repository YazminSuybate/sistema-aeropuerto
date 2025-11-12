import { PrismaClient } from "@prisma/client";
import type { Ticket } from "../models/ticket.model.js";
import type { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class TicketRepository {
  // Busca todos, incluyendo relaciones clave para una vista de lista
  async findAll(): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      include: {
        estado: true,
        area_asignada: {
          select: { nombre_area: true },
        },
        categoria_info: {
          select: { nombre_categoria: true, prioridad: true },
        },
        responsable: {
          select: { nombre: true, apellido: true },
        },
      },
      orderBy: {
        fecha_creacion: "desc",
      },
    });
  }

  // Busca todos los tickets asignados a un área específica
  async findByAreaId(id_area: number): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: {
        id_area_asignada: id_area,
      },
      include: {
        // Usamos el mismo include de 'findAll' para consistencia
        estado: true,
        area_asignada: {
          select: { nombre_area: true },
        },
        categoria_info: {
          select: { nombre_categoria: true, prioridad: true },
        },
        responsable: {
          select: { nombre: true, apellido: true },
        },
      },
      orderBy: {
        fecha_creacion: "desc",
      },
    });
  }

  // Busca todos los tickets ASIGNADOS a un usuario (responsable)
  async findByResponsibleId(id_usuario: number): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: {
        id_usuario_responsable: id_usuario,
      },
      include: {
        // Usamos el mismo include de 'findAll'
        estado: true,
        area_asignada: {
          select: { nombre_area: true },
        },
        categoria_info: {
          select: { nombre_categoria: true, prioridad: true },
        },
        responsable: {
          select: { nombre: true, apellido: true },
        },
      },
      orderBy: {
        fecha_creacion: "desc",
      },
    });
  }

  // Busca uno con TODA la información relacionada
  async findById(id_ticket: number): Promise<Ticket | null> {
    return prisma.ticket.findUnique({
      where: { id_ticket },
      include: {
        creador: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        responsable: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        area_asignada: true,
        estado: true,
        categoria_info: true,
        pasajero_info: true,
        comentarios: {
          include: {
            usuario: {
              select: { id_usuario: true, nombre: true, apellido: true },
            },
          },
          orderBy: {
            fecha_comentario: "asc",
          },
        },
        evidencias: true,
        historial: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true },
            },
          },
          orderBy: {
            fecha_cambio: "asc",
          },
        },
        liberaciones_registro: true,
        solicitudes_cambio_area: true,
      },
    });
  }

  // El tipo de 'data' es inferido por el servicio, que ya hizo la lógica
  async create(data: Prisma.ticketCreateInput): Promise<Ticket> {
    return prisma.ticket.create({
      data,
    });
  }

  // Solo permite actualizar ciertos campos (el servicio lo valida)
  async update(
    id_ticket: number,
    data: Partial<Omit<Ticket, "id_ticket">>
  ): Promise<Ticket> {
    return prisma.ticket.update({
      where: { id_ticket },
      data,
    });
  }

  async delete(id_ticket: number): Promise<Ticket> {
    return prisma.ticket.delete({
      where: { id_ticket },
    });
  }
}
