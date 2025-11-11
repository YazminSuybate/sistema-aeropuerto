import type { comentario } from '@prisma/client';

// Interfaz para extender el tipo de Prisma (si es necesario en el futuro)
export interface Comentario extends comentario { }

// DTO para crear un Comentario
// Omitimos los campos autogenerados por la BD: id y fecha_comentario
export type ComentarioCreateDTO = Omit<Comentario, 'id_comentario' | 'fecha_comentario'>;

// DTO para actualizar un Comentario
// Hacemos todos los campos del DTO de creación opcionales
// (ej. 'mensaje', 'id_ticket', 'id_usuario' son opcionales)
export type ComentarioUpdateDTO = Partial<ComentarioCreateDTO>;