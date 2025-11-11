// Asumiendo que el modelo en schema.prisma se llama 'historialTicket'
import type { historialTicket } from '@prisma/client';

export interface HistorialTicket extends historialTicket { }

// DTO para crear una entrada de Historial
// Omitimos los campos autogenerados: id y fecha_cambio
export type HistorialTicketCreateDTO = Omit<HistorialTicket, 'id_historial' | 'fecha_cambio'>;

// DTO para actualizar (campos opcionales)
export type HistorialTicketUpdateDTO = Partial<HistorialTicketCreateDTO>;