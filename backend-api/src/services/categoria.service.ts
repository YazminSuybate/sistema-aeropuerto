import type { CategoriaRepository } from "../repositories/categoria.repository.js";
import type { AreaRepository } from "../repositories/area.repository.js";
import type { Categoria, CategoriaCreateDTO, CategoriaUpdateDTO } from "../models/categoria.model.js";
import { BadRequestError, NotFoundError, ConflictError } from "../errors/custom.error.js";

export class CategoriaService {
    private categoriaRepository: CategoriaRepository;
    private areaRepository: AreaRepository;

    constructor(categoriaRepository: CategoriaRepository, areaRepository: AreaRepository) {
        this.categoriaRepository = categoriaRepository;
        this.areaRepository = areaRepository;
    }

    async getAllCategorias(): Promise<Categoria[]> {
        return this.categoriaRepository.findAll();
    }

    async getCategoriaById(id_categoria: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findById(id_categoria);
        if (!categoria) {
            throw new NotFoundError(`Categoría con ID ${id_categoria}`);
        }
        return categoria;
    }

    private async validateArea(id_area: number) {
        const area = await this.areaRepository.findById(id_area);
        if (!area) {
            throw new BadRequestError(`El ID de Área por defecto ${id_area} no existe.`);
        }
    }

    async createCategoria(data: CategoriaCreateDTO): Promise<Categoria> {
        if (!data.nombre_categoria || data.nombre_categoria.trim() === '') {
            throw new BadRequestError("El nombre de la categoría es obligatorio.");
        }
        if (!data.id_area_default) {
            throw new BadRequestError("El ID de área por defecto es obligatorio.");
        }

        await this.validateArea(data.id_area_default);

        try {
            return await this.categoriaRepository.create(data);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('nombre_categoria')) {
                throw new ConflictError("Ya existe una categoría con ese nombre.", 'P2002');
            }
            throw error;
        }
    }

    async updateCategoria(id_categoria: number, data: CategoriaUpdateDTO): Promise<Categoria> {
        await this.getCategoriaById(id_categoria);

        if (data.id_area_default) {
            await this.validateArea(data.id_area_default);
        }

        if (data.nombre_categoria?.trim() === '') {
            throw new BadRequestError("El nombre de la categoría no puede estar vacío.");
        }

        try {
            return await this.categoriaRepository.update(id_categoria, data);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target.includes('nombre_categoria')) {
                throw new ConflictError("Ya existe una categoría con ese nombre.", 'P2002');
            }
            throw error;
        }
    }

    async deleteCategoria(id_categoria: number): Promise<Categoria> {
        return this.categoriaRepository.delete(id_categoria);
    }
}