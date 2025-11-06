import type { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service.js';
import { CategoriaRepository } from '../repositories/categoria.repository.js';
import { AreaRepository } from '../repositories/area.repository.js';
import type { CustomError } from '../errors/custom.error.js';

const categoriaRepository = new CategoriaRepository();
const areaRepository = new AreaRepository();
const categoriaService = new CategoriaService(categoriaRepository, areaRepository);

function handleControllerError(error: any, res: Response, defaultMessage: string): Response | void {
    console.error(`Error en el controlador de Categoría:`, error);

    if (error && error.statusCode) {
        return res.status((error as CustomError).statusCode).json({ message: error.message });
    }

    if (error.code) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: error.message || 'El recurso ya existe.', code: 'P2002' });
            case 'P2003':
                return res.status(400).json({ message: error.message || 'Error de llave foránea. Recurso asociado inválido.', code: 'P2003' });
        }
    }

    return res.status(500).json({ message: defaultMessage });
};

function validateAndGetId(req: Request, res: Response): number | null {
    const idParam = req.params.id;

    if (!idParam) {
        res.status(400).json({ message: 'El ID de categoría es obligatorio en la ruta.' });
        return null;
    }

    const id_categoria = parseInt(idParam, 10);

    if (isNaN(id_categoria)) {
        res.status(400).json({ message: 'ID de categoría inválido' });
        return null;
    }

    return id_categoria;
}


export class CategoriaController {
    // GET api/categorias
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const categorias = await categoriaService.getAllCategorias();
            res.status(200).json(categorias);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener categorías');
        }
    }

    // GET api/categorias/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_categoria = validateAndGetId(req, res);
        if (id_categoria === null) return;

        try {
            const categoria = await categoriaService.getCategoriaById(id_categoria);
            res.status(200).json(categoria);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener la categoría');
        }
    }


    // POST api/categorias
    async create(req: Request, res: Response): Promise<void> {
        const { nombre_categoria, prioridad, sla_horas, id_area_default } = req.body;

        try {
            const data = { nombre_categoria, prioridad, sla_horas, id_area_default: Number(id_area_default) };
            const newCategoria = await categoriaService.createCategoria(data);
            res.status(201).json(newCategoria);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear categoría.');
        }
    }

    // PUT api/categorias/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_categoria = validateAndGetId(req, res);
        if (id_categoria === null) return;

        const data = req.body;

        try {
            const updatedCategoria = await categoriaService.updateCategoria(id_categoria, data);
            res.status(200).json(updatedCategoria);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar la categoría.');
        }
    }

    // DELETE api/categorias/:id
    async remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> {
        const id_categoria = validateAndGetId(req, res);
        if (id_categoria === null) return;

        try {
            await categoriaService.deleteCategoria(id_categoria);
            res.status(204).send();
        } catch (error: any) {
            if (error.code === 'P2003') {
                return res.status(409).json({
                    message: `No se puede eliminar la categoría con ID ${id_categoria} porque tiene tickets asociados.`,
                    code: 'P2003'
                });
            }
            handleControllerError(error, res, 'Error al eliminar la categoría.');
        }
    }
}