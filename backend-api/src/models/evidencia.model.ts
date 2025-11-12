import type { evidencia } from '@prisma/client';

// Interfaz principal
export interface Evidencia extends evidencia {}

// DTO para la creación (lo que el servicio recibe del controlador)
export interface CreateEvidenciaDto {
    id_ticket: number;
    url_archivo: string; // La ruta del archivo guardado
    tipo_mime: string;
}