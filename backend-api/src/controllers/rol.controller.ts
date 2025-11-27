import type { Request, Response } from 'express';
import { RolService } from '../services/rol.service.js';
import { RolRepository } from '../repositories/rol.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const rolRepository = new RolRepository();
const rolService = new RolService(rolRepository);


export class RolController {

    // GET /api/roles
    async getAllRoles(_req: Request, res: Response) {
        try {
            const roles = await rolService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Error en getAllRoles:', error);
            return handleControllerError(error, res, 'Error al obtener los roles.');
        }
    }

    // GET /api/roles/:id
    async getRolById(req: Request, res: Response) {
        const id_rol = validateAndGetId(req, res, 'id');
        if (id_rol === null) return;

        try {
            const rol = await rolService.getRolById(id_rol);
            return res.status(200).json(rol);
        } catch (error: any) {
            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            return handleControllerError(error, res, 'Error al obtener el rol por ID.');
        }
    }

    // POST /api/roles
    async createRol(req: Request, res: Response) {
        try {
            const { nombre_rol, descripcion } = req.body;
            const nuevoRol = await rolService.createRol({ nombre_rol, descripcion });
            return res.status(201).json(nuevoRol);

        } catch (error: any) {

            if (error.message?.includes('obligatorio')) {
                return res.status(400).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al crear el rol.');
        }
    }

    // PUT /api/roles/:id
    async updateRol(req: Request, res: Response) {
        const id_rol = validateAndGetId(req, res, 'id');
        if (id_rol === null) return;

        try {
            const { nombre_rol, descripcion } = req.body;
            const dataToUpdate = { nombre_rol, descripcion };

            const rolActualizado = await rolService.updateRol(id_rol, dataToUpdate);

            return res.status(200).json(rolActualizado);
        } catch (error: any) {

            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }

            if (error.message?.includes('vacío')) {
                return res.status(400).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al actualizar el rol.');
        }
    }

    // DELETE /api/roles/:id
    async deleteRol(req: Request, res: Response) {
        const id_rol = validateAndGetId(req, res, 'id');
        if (id_rol === null) return;

        try {
            await rolService.deleteRol(id_rol);
            return res.status(204).send();

        } catch (error: any) {

            if (error.message?.includes('no encontrado')) {
                return res.status(404).json({ message: error.message });
            }

            if (error.code === 'P2003') {
                return res.status(409).json({
                    message: `No se puede eliminar el rol con ID ${id_rol} porque tiene usuarios u otras entidades asociadas.`,
                    code: 'P2003'
                });
            }

            return handleControllerError(error, res, 'Error al eliminar el rol.');
        }
    }
}