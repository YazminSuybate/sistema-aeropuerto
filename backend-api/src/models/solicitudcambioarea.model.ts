// Tu schema usa 'solicitud_cambio_area' (snake_case)
import type { solicitud_cambio_area as PrismaSolicitud } from '@prisma/client';

// Interfaz local
export interface SolicitudCambioArea extends PrismaSolicitud { }

// DTO para crear: Omitimos campos con @default o autoincrement
export type SolicitudCambioAreaCreateDTO = Omit<SolicitudCambioArea, 
    'id_solicitud' | 
    'fecha_solicitud' | 
    'fecha_respuesta' | 
    'estado_solicitud'
>;

// DTO para actualizar: Hacemos todos los campos opcionales, excepto el ID
export type SolicitudCambioAreaUpdateDTO = Partial<Omit<SolicitudCambioArea, 'id_solicitud'>>;