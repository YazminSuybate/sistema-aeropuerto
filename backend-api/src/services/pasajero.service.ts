import type { PasajeroRepository } from "../repositories/pasajero.repository.js";
import type { Pasajero, PasajeroCreateDTO, PasajeroUpdateDTO } from "../models/pasajero.model.js";
import { BadRequestError, NotFoundError, ConflictError } from "../errors/custom.error.js";

export class PasajeroService {
    private pasajeroRepository: PasajeroRepository;

    constructor(pasajeroRepository: PasajeroRepository) {
        this.pasajeroRepository = pasajeroRepository;
    }

    async getAllPasajeros(): Promise<Pasajero[]> {
        return this.pasajeroRepository.findAll();
    }

    async getPasajeroById(id_pasajero: number): Promise<Pasajero> {
        const pasajero = await this.pasajeroRepository.findById(id_pasajero);
        if (!pasajero) {
            throw new NotFoundError(`Pasajero con ID ${id_pasajero}`);
        }
        return pasajero;
    }

    async getPasajeroByDocumentoId(documento_id: string): Promise<Pasajero | null> {
        return this.pasajeroRepository.findByDocumentoId(documento_id);
    }

    async createPasajero(data: PasajeroCreateDTO): Promise<Pasajero> {
        if (!data.nombre || data.nombre.trim() === '' || !data.documento_id || data.documento_id.trim() === '') {
            throw new BadRequestError("El nombre y el documento de identidad del pasajero son obligatorios.");
        }

        try {
            return await this.pasajeroRepository.create(data);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('documento_id')) {
                throw new ConflictError("Ya existe un pasajero con ese documento de identidad.", 'P2002');
            }
            throw error;
        }
    }

    async updatePasajero(id_pasajero: number, data: PasajeroUpdateDTO): Promise<Pasajero> {
        await this.getPasajeroById(id_pasajero);

        if (data.nombre?.trim() === '' || data.documento_id?.trim() === '') {
            throw new BadRequestError("El nombre y el documento de identidad no pueden estar vacíos.");
        }

        try {
            return await this.pasajeroRepository.update(id_pasajero, data);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('documento_id')) {
                throw new ConflictError("Ya existe un pasajero con ese documento de identidad.", 'P2002');
            }
            throw error;
        }
    }

    async deletePasajero(id_pasajero: number): Promise<Pasajero> {
        return this.pasajeroRepository.delete(id_pasajero);
    }
}