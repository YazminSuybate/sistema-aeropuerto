import type { estado } from '@prisma/client';

export interface Estado extends estado { }

export type EstadoCreateDTO = Omit<Estado, 'id_estado'>;

export type EstadoUpdateDTO = Partial<Omit<Estado, 'id_estado'>>;