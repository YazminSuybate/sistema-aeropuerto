import type { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { RolRepository } from '../repositories/rol.repository.js';
import { AreaRepository } from '../repositories/area.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const usuarioRepository = new UsuarioRepository();
const rolRepository = new RolRepository();
const areaRepository = new AreaRepository();
const usuarioService = new UsuarioService(usuarioRepository, rolRepository);

export class UsuarioController {
    // GET api/usuarios
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await usuarioService.getAllUsuarios();
            res.status(200).json(usuarios);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener usuarios');
        }
    }

    // GET api/usuarios/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_usuario = validateAndGetId(req, res, 'id');
        if (id_usuario === null) return;

        try {
            const usuario = await usuarioService.getUsuarioById(id_usuario);

            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener el usuario');
        }
    }


    // POST api/usuarios
    async create(req: Request, res: Response): Promise<void> {
        const { nombre, apellido, email, password, id_rol, id_area } = req.body;

        const rolExiste = await rolRepository.findById(id_rol);
        if (!id_rol || rolExiste === null) {
            res.status(400).json({ message: 'El ID de rol proporcionado no existe.' });
            return;
        }

        if (id_area !== undefined && id_area !== null) {
            const areaExiste = await areaRepository.findById(id_area);
            if (!areaExiste) {
                res.status(400).json({ message: 'El ID de área proporcionado no existe.' });
                return;
            }
        }

        try {
            const data = { nombre, apellido, email, password, id_rol, id_area };
            const newUsuario = await usuarioService.createUsuario(data);
            res.status(201).json(newUsuario);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear usuario.');
        }
    }

    // PUT api/usuarios/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_usuario = validateAndGetId(req, res, 'id');
        if (id_usuario === null) return;

        const data = req.body;

        if (data.id_rol) {
            const rolExiste = await rolRepository.findById(data.id_rol);
            if (!rolExiste) {
                res.status(400).json({ message: 'El ID de rol proporcionado no existe.' });
                return;
            }
        }

        if (data.id_area !== undefined && data.id_area !== null) {
            const areaExiste = await areaRepository.findById(data.id_area);
            if (!areaExiste) {
                res.status(400).json({ message: 'El ID de área proporcionado no existe.' });
                return;
            }
        }

        try {
            const updatedUsuario = await usuarioService.updateUsuario(id_usuario, data);
            res.status(200).json(updatedUsuario);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar el usuario.');
        }
    }

    // DELETE api/usuarios/:id (Soft Delete)
    async remove(req: Request, res: Response): Promise<void> {
        const id_usuario = validateAndGetId(req, res, 'id');
        if (id_usuario === null) return;

        try {
            await usuarioService.deleteUsuario(id_usuario);
            res.status(204).send();
        } catch (error: any) {
            handleControllerError(error, res, 'Error al eliminar el usuario.');
        }
    }
}