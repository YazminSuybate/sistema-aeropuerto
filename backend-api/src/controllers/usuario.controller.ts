import type { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

const ID_ROL_OPERATIVO = 2;

function validateAndGetId(req: Request, res: Response): number | null {
    const idParam = req.params.id;

    if (!idParam) {
        res.status(400).json({ message: 'El ID es obligatorio en la ruta.' });
        return null;
    }

    const id_usuario = parseInt(idParam, 10);

    if (isNaN(id_usuario)) {
        res.status(400).json({ message: 'ID de usuario inválido' });
        return null;
    }

    return id_usuario;
}

export class UsuarioController {
    // GET api/usuarios
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await usuarioService.getAllUsuarios();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    }

    // GET api/usuarios/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_usuario = validateAndGetId(req, res);
        if (id_usuario === null) return;

        try {
            const usuario = await usuarioService.getUsuarioById(id_usuario);

            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error en getById:', error);
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    }


    // POST api/usuarios
    async create(req: Request, res: Response): Promise<void> {
        const { nombre, apellido, email, password, id_rol, id_area } = req.body;

        if (!nombre || !apellido || !email || !password || !id_rol) {
            res.status(400).json({ message: 'Faltan campos obligatorios (nombre, apellido, email, password, id_rol).' });
            return;
        }

        if (id_rol === ID_ROL_OPERATIVO && (id_area === undefined || id_area === null)) {
            res.status(400).json({ message: 'El campo id_area es obligatorio para el rol operativo.' });
            return;
        }

        try {
            const data = { nombre, apellido, email, password, id_rol, id_area };
            const newUsuario = await usuarioService.createUsuario(data);
            res.status(201).json(newUsuario);
        } catch (error: any) {
            console.error('Error en create:', error);

            if (error.message === 'El correo electrónico ya está registrado.') {
                res.status(409).json({ message: error.message });
                return;
            }
            if (error.message === 'Los usuarios con rol operativo deben tener un área asignada.') {
                res.status(400).json({ message: error.message });
                return;
            }

            if (error.code === 'P2002') {
                res.status(409).json({ message: 'El email proporcionado ya está registrado.', code: 'P2002' });
                return;
            }
            if (error.message?.includes('FK')) {
                res.status(400).json({ message: 'ID de Rol o Área inválido.' });
                return;
            }

            res.status(500).json({ message: 'Error interno del servidor al crear usuario.' });
        }
    }

    // PUT api/usuarios/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_usuario = validateAndGetId(req, res);
        if (id_usuario === null) return;

        const data = req.body;

        try {
            const updatedUsuario = await usuarioService.updateUsuario(id_usuario, data);
            res.status(200).json(updatedUsuario);
        } catch (error: any) {
            console.error('Error en update:', error);

            if (error.message === 'Los usuarios con rol operativo deben tener un área asignada.') {
                res.status(400).json({ message: error.message });
                return;
            }

            if (error.message?.includes('no encontrado')) {
                res.status(404).json({ message: 'Usuario no encontrado.' });
                return;
            }

            res.status(500).json({ message: 'Error al actualizar el usuario.' });
        }
    }

    // DELETE api/usuarios/:id (Soft Delete)
    async remove(req: Request, res: Response): Promise<void> {
        const id_usuario = validateAndGetId(req, res);
        if (id_usuario === null) return;

        try {
            await usuarioService.deleteUsuario(id_usuario);
            res.status(204).send();
        } catch (error: any) {
            console.error('Error en remove:', error);

            if (error.message?.includes('no encontrado')) {
                res.status(404).json({ message: 'Usuario no encontrado.' });
                return;
            }

            res.status(500).json({ message: 'Error al eliminar el usuario.' });
        }
    }
}