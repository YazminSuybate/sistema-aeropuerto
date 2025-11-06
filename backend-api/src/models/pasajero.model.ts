import type { pasajero } from '@prisma/client';

export interface Pasajero extends pasajero {}

export type PasajeroCreateDTO = Omit<Pasajero, 'id_pasajero'>;

export type PasajeroUpdateDTO = Partial<Omit<Pasajero, 'id_pasajero'>>;