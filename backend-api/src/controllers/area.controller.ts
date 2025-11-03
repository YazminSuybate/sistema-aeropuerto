import type { Request, Response } from 'express';
import { AreaService } from '../services/area.service.js';
import { AreaRepository } from '../repositories/area.repository.js';

const areaRepository = new AreaRepository();
const areaService = new AreaService(areaRepository);

function validateAndGetId(req: Request, res: Response): number | null {
    const id_param = req.params.id;

    if (!id_param) {
        res.status(400).json({ message: 'ID de area faltante.' });
        return null;
    }

    const id_area = parseInt(id_param, 10);

    if (isNaN(id_area)) {
        res.status(400).json({ message: 'ID de area inválido.' });
        return null;
    }
    
    (req as any).id_area = id_area; 

    return id_area;
}

export class AreaController {
    
    // GET /api/areas
    async getAllAreas(_req: Request, res: Response) {
        try {
            const areas = await areaService.getAllAreas();
            return res.status(200).json(areas);
        } catch (error) {
            console.error('Error en getAllAreas:', error);
            return res.status(500).json({ message: 'Error interno del servidor al obtener areas.' });
        }
    }

    // GET /api/areas/:id
    async getAreaById(req: Request, res: Response) {
        const id_area = validateAndGetId(req, res);
        if (id_area === null) return; 

        try {
            const area = await areaService.getAreaById(id_area);
            return res.status(200).json(area);
        } catch (error: any) {
            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            console.error('Error en getAreaById:', error);
            return res.status(500).json({ message: 'Error al obtener el area.' });
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
            return res.status(500).json({ message: 'Error al crear el area.' });
        }
    }

    // PUT /api/areas/:id
    async updateArea(req: Request, res: Response) {
        const id_area = validateAndGetId(req, res);
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
            return res.status(500).json({ message: 'Error al actualizar el area.' });
        }
    }

    // DELETE /api/areas/:id
    async deleteArea(req: Request, res: Response) {
        const id_area = validateAndGetId(req, res);
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
            return res.status(500).json({ message: 'Error al eliminar el area.' });
        }
    }
}