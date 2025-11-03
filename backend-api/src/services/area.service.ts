import type { AreaRepository } from "../repositories/area.repository.js";
import type { Area } from "../models/area.model.js";

export class AreaService {
    private areaRepository: AreaRepository;

    constructor(areaRepository: AreaRepository) {
        this.areaRepository = areaRepository;
    }

    async getAllAreas(): Promise<Area[]> {
        return this.areaRepository.findAll();
    }

    async getAreaById(id_area: number): Promise<Area> {
        const Area = await this.areaRepository.findById(id_area);
        if (!Area) {
            throw new Error(`Area con ID ${id_area} no encontrado.`);
        }
        return Area;
    }

    async createArea(data: Omit<Area, 'id_area'>): Promise<Area> {
        if (!data.nombre_area || data.nombre_area.trim() === '') {
            throw new Error('El nombre del Area es obligatorio.');
        }
        return this.areaRepository.create(data);
    }

    async updateArea(id_area: number, data: Partial<Omit<Area, 'id_area'>>): Promise<Area> {
        await this.getAreaById(id_area);
        return this.areaRepository.update(id_area, data);
    }

    async deleteArea(id_area: number): Promise<Area> {
        return this.areaRepository.delete(id_area);
    }
}