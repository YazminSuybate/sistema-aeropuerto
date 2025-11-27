import { PrismaClient } from "@prisma/client";
import type { Ticket } from "../models/ticket.model.js";
import type { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const BASE_INCLUDE_FIELDS = {
  estado: true,
  area_asignada: {
    select: { nombre_area: true },
  },
  categoria_info: {
    select: { nombre_categoria: true, prioridad: true, sla_horas: true },
  },
  responsable: {
    select: { nombre: true, apellido: true },
  },
  pasajero_info: {
    select: { documento_id: true, nombre: true }
  }
};

export class TicketRepository {
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

  async findByAreaId(id_area: number): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: {
        id_area_asignada: id_area,
      },
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

  async findByResponsibleId(id_usuario: number): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: {
        id_usuario_responsable: id_usuario,
      },
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

  async create(data: Prisma.ticketCreateInput): Promise<Ticket> {
    return prisma.ticket.create({
      data,
      include: {
        ...BASE_INCLUDE_FIELDS,
        comentarios: {
          include: { usuario: { select: { id_usuario: true, nombre: true, apellido: true } } }
        }
      }
    });
  }

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
