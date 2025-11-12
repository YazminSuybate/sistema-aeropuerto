import type { historial_ticket } from '@prisma/client';

export interface HistorialTicket extends historial_ticket { }

export type HistorialTicketCreateDTO = Omit<HistorialTicket, 'id_historial' | 'fecha_cambio'>;

export type HistorialTicketUpdateDTO = Partial<HistorialTicketCreateDTO>;