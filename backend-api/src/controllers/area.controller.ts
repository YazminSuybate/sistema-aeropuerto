import type { Request, Response } from 'express';
import { AreaService } from '../services/area.service.js';
import { AreaRepository } from '../repositories/area.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const areaRepository = new AreaRepository();
const areaService = new AreaService(areaRepository);

export class AreaController {

    // GET /api/areas
    async getAllAreas(_req: Request, res: Response) {
        try {
            const areas = await areaService.getAllAreas();
            return res.status(200).json(areas);
        } catch (error) {
            return handleControllerError(error, res, 'Error interno del servidor al obtener areas.');
        }
    }

    // GET /api/areas/:id
    async getAreaById(req: Request, res: Response) {
        const id_area = validateAndGetId(req, res, 'id');

        if (id_area === null) return;

        try {
            const area = await areaService.getAreaById(id_area);
            return res.status(200).json(area);

        } catch (error: any) {

            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al obtener el area.');

        }
    }

    // POST /api/areas
    async createArea(req: Request, res: Response) {
        try {
            const { nombre_area, descripcion } = req.body;
            const nuevoArea = await areaService.createArea({ nombre_area, descripcion });
            return res.status(201).json(nuevoArea);

        } catch (error: any) {

            console.error('Error en createArea:', error);

            if (error.message?.includes('obligatorio')) {
                return res.status(400).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al crear el area.');
        }
    }

    // PUT /api/areas/:id
    async updateArea(req: Request, res: Response) {
        const id_area = validateAndGetId(req, res, 'id');

        if (id_area === null) return;

        try {
            const { nombre_area, descripcion } = req.body;
            const dataToUpdate = { nombre_area, descripcion };

            const areaActualizada = await areaService.updateArea(id_area, dataToUpdate);

            return res.status(200).json(areaActualizada);
        } catch (error: any) {
            console.error('Error en updateArea:', error);

            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }

            if (error.message?.includes('vacío')) {
                return res.status(400).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al actualizar el area.');
        }
    }

    // DELETE /api/areas/:id
    async deleteArea(req: Request, res: Response) {
        const id_area = validateAndGetId(req, res, 'id');
        if (id_area === null) return;

        try {
            await areaService.deleteArea(id_area);
            return res.status(204).send();
        } catch (error: any) {
            console.error('Error en deleteArea:', error);

            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }

            if (error.code === 'P2003') {
                return res.status(409).json({
                    message: `No se puede eliminar el area con ID ${id_area} porque tiene usuarios u otras entidades asociadas.`,
                    code: 'P2003'
                });
            }

            return handleControllerError(error, res, 'Error al eliminar el area.');
        }
    }
}