import type { EstadoRepository } from "../repositories/estado.repository.js";
import type { Estado, EstadoCreateDTO, EstadoUpdateDTO } from "../models/estado.model.js";
import { BadRequestError, NotFoundError, ConflictError } from "../errors/custom.error.js";

export class EstadoService {
    private estadoRepository: EstadoRepository;

    constructor(estadoRepository: EstadoRepository) {
        this.estadoRepository = estadoRepository;
    }

    async getAllEstados(): Promise<Estado[]> {
        return this.estadoRepository.findAll();
    }

    async getEstadoById(id_estado: number): Promise<Estado> {
        const estado = await this.estadoRepository.findById(id_estado);
        if (!estado) {
            throw new NotFoundError(`Estado con ID ${id_estado}`);
        }
        return estado;
    }

    async createEstado(data: EstadoCreateDTO): Promise<Estado> {
        if (!data.nombre_estado || data.nombre_estado.trim() === '') {
            throw new BadRequestError("El nombre del estado es obligatorio.");
        }

        try {
            return await this.estadoRepository.create(data);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('nombre_estado')) {
                throw new ConflictError("Ya existe un estado con ese nombre.", 'P2002');
            }
            throw error;
        }
    }

    async updateEstado(id_estado: number, data: EstadoUpdateDTO): Promise<Estado> {
        await this.getEstadoById(id_estado); 

        if (data.nombre_estado?.trim() === '') {
            throw new BadRequestError("El nombre del estado no puede estar vacío.");
        }

        try {
            return await this.estadoRepository.update(id_estado, data);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('nombre_estado')) {
                throw new ConflictError("Ya existe un estado con ese nombre.", 'P2002');
            }
            throw error;
        }
    }

    async deleteEstado(id_estado: number): Promise<Estado> {
        return this.estadoRepository.delete(id_estado);
    }
}