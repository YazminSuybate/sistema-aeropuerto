import type { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { RolRepository } from '../repositories/rol.repository.js';
import { AreaRepository } from '../repositories/area.repository.js';
import type { CustomError } from '../errors/custom.error.js';

const usuarioRepository = new UsuarioRepository();
const rolRepository = new RolRepository();
const areaRepository = new AreaRepository();
const usuarioService = new UsuarioService(usuarioRepository, rolRepository);

usuarioService.initialize().then(() => {
    console.log("UsuarioService inicializado con IDs de roles operativos.");
}).catch(error => {
    console.error("Error al inicializar UsuarioService:", error);
});

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


function handleControllerError(error: any, res: Response, defaultMessage: string): Response | void {
    console.error(`Error en el controlador:`, error);

    if (error && error.statusCode) {
        return res.status((error as CustomError).statusCode).json({ message: error.message });
    }

    if (error.code) {
        switch (error.code) {
            case 'P2002':
                const target = error.meta?.target.includes('email') ? 'El email proporcionado ya está registrado.' : 'El recurso ya existe.';
                return res.status(409).json({ message: target, code: 'P2002' });
            case 'P2003':
                return res.status(400).json({ message: 'ID de Rol o Área inválido.', code: 'P2003' });
        }
    }

    return res.status(500).json({ message: defaultMessage });
};


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
        const id_usuario = validateAndGetId(req, res);
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
        const id_usuario = validateAndGetId(req, res);
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
        const id_usuario = validateAndGetId(req, res);
        if (id_usuario === null) return;

        try {
            await usuarioService.deleteUsuario(id_usuario);
            res.status(204).send();
        } catch (error: any) {
            handleControllerError(error, res, 'Error al eliminar el usuario.');
        }
    }
}