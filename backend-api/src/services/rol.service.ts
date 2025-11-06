import type { RolRepository } from "../repositories/rol.repository.js";
import type { Rol } from "../models/rol.model.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";

export class RolService {
    private rolRepository: RolRepository;

    constructor(rolRepository: RolRepository) {
        this.rolRepository = rolRepository;
    }

    async getAllRoles(): Promise<Rol[]> {
        return this.rolRepository.findAll();
    }

    async getRolById(id_rol: number): Promise<Rol> {
        const rol = await this.rolRepository.findById(id_rol);
        if (!rol) {
            throw new NotFoundError('Rol con ID ${id_rol}')
        }
        return rol;
    }

    async createRol(data: Omit<Rol, 'id_rol'>): Promise<Rol> {
        if (!data.nombre_rol || data.nombre_rol.trim() === '') {
            throw new BadRequestError("El nombre del rol es obligatorio.");
        }
        return this.rolRepository.create(data);
    }

    async updateRol(id_rol: number, data: Partial<Omit<Rol, 'id_rol'>>): Promise<Rol> {
        await this.getRolById(id_rol);
        return this.rolRepository.update(id_rol, data);
    }

    async deleteRol(id_rol: number): Promise<Rol> {
        return this.rolRepository.delete(id_rol);
    }
}