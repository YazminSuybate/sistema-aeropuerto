import { PrismaClient } from '@prisma/client';
import type { Ticket } from "../models/ticket.model.js";

const prisma = new PrismaClient();

export class TicketRepository {

  // Obtener todos los tickets
  async findAll(): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      include: {
        estado: true,
        categoria_info: true, 
        responsable: true,
        area_asignada: true,
        pasajero_info: true,
        // --- AGREGAMOS ESTO AQUÍ TAMBIÉN ---
        comentarios: {
          orderBy: { fecha_comentario: 'asc' },
          include: {
            usuario: {
              select: { id_usuario: true, nombre: true, apellido: true }
            }
          }
        },
        // -----------------------------------
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    }) as unknown as Promise<Ticket[]>;
  }

  // --- AQUÍ ESTÁ LA LÓGICA DEL CHAT ---
  async findById(id_ticket: number): Promise<Ticket | null> {
    return prisma.ticket.findUnique({
      where: { id_ticket },
      include: {
        // Relaciones básicas
        estado: true,
        categoria_info: true, 
        responsable: true,
        area_asignada: true,
        pasajero_info: true,

        // INCLUIR COMENTARIOS (La parte clave)
        comentarios: {
          orderBy: {
            fecha_comentario: 'asc', // Ordenar: mensajes viejos arriba, nuevos abajo
          },
          include: {
            // Anidar usuario para saber quién escribió el comentario
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                apellido: true,
                // No traemos password por seguridad
              },
            },
          },
        },
      },
    }) as unknown as Promise<Ticket | null>;
  }

  // Buscar por Área
  async findByAreaId(id_area: number): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: { id_area_asignada: id_area },
      include: {
        estado: true,
        categoria_info: true,
        responsable: true,
        pasajero_info: true,
        // --- AGREGAMOS ESTO AQUÍ TAMBIÉN ---
        comentarios: {
          orderBy: { fecha_comentario: 'asc' },
          include: {
            usuario: {
              select: { id_usuario: true, nombre: true, apellido: true }
            }
          }
        },
        // -----------------------------------
      },
      orderBy: { fecha_creacion: 'desc' },
    }) as unknown as Promise<Ticket[]>;
  }

  // Buscar por Responsable
  async findByResponsibleId(id_usuario: number): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: { id_usuario_responsable: id_usuario },
      include: {
        estado: true,
        categoria_info: true,
        pasajero_info: true,
        // --- AGREGAMOS ESTO AQUÍ TAMBIÉN ---
        comentarios: {
          orderBy: { fecha_comentario: 'asc' },
          include: {
            usuario: {
              select: { id_usuario: true, nombre: true, apellido: true }
            }
          }
        },
        // -----------------------------------
      },
      orderBy: { fecha_creacion: 'desc' },
    }) as unknown as Promise<Ticket[]>;
  }

  // Crear Ticket
  async create(data: any): Promise<Ticket> {
    return prisma.ticket.create({
      data,
      include: {
        estado: true,
        categoria_info: true,
      }
    }) as unknown as Promise<Ticket>;
  }

  // Actualizar detalles generales
  async update(id_ticket: number, data: any): Promise<Ticket> {
    return prisma.ticket.update({
      where: { id_ticket },
      data,
      include: {
        estado: true,
        categoria_info: true,
        responsable: true,
      },
    }) as unknown as Promise<Ticket>;
  }

  // Asignar Operador
  async assignOperator(id_ticket: number, id_operador: number): Promise<Ticket> {
    return prisma.ticket.update({
      where: { id_ticket },
      data: {
        id_usuario_responsable: id_operador,
      },
      include: {
        responsable: true,
        estado: true,
      }
    }) as unknown as Promise<Ticket>;
  }

  // Eliminar Ticket
  async delete(id_ticket: number): Promise<Ticket> {
    return prisma.ticket.delete({
      where: { id_ticket },
    }) as unknown as Promise<Ticket>;
  }
}