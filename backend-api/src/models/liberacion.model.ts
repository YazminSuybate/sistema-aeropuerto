import type { liberacion_ticket } from '@prisma/client';

// Interfaz principal
export interface LiberacionTicket extends liberacion_ticket {}

// DTO (Data Transfer Object) para la creación.
// Esto es lo que el controlador espera del "body" de la solicitud.
export interface CreateLiberacionDto {
  id_ticket: number;
  comentario_liberacion?: string;
}