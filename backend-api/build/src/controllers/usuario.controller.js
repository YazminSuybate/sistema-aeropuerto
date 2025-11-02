import { UsuarioService } from '../services/usuario.service.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
export class UsuarioController {
    // GET /usuarios
    async getAll(_req, res) {
        try {
            const usuarios = await usuarioService.getAllUsuarios();
            res.status(200).json(usuarios);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    }
    // GET /usuarios/:id
    async getById(req, res) {
        const idParam = req.params.id;
        if (idParam === undefined) {
            res.status(400).json({ message: 'El ID es obligatorio en la ruta.' });
            return;
        }
        // 2. Parseo, ahora idParam es un string garantizado
        const id_usuario = parseInt(idParam, 10);
        if (isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID de usuario inválido' });
            return;
        }
        try {
            const usuario = await usuarioService.getUsuarioById(id_usuario);
            if (usuario) {
                res.status(200).json(usuario);
            }
            else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    }
    // POST /usuarios
    async create(req, res) {
        const data = req.body;
        if (!data.nombre || !data.email || !data.password || !data.id_rol || !data.id_area) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        try {
            const newUsuario = await usuarioService.createUsuario(data);
            res.status(201).json(newUsuario);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear usuario. El email podría estar en uso o faltan datos de FK.' });
        }
    }
    // PUT /usuarios/:id
    async update(req, res) {
        const idParam = req.params.id;
        const data = req.body;
        if (idParam === undefined) {
            res.status(400).json({ message: 'El ID es obligatorio en la ruta.' });
            return;
        }
        const id_usuario = parseInt(idParam, 10);
        if (isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID de usuario inválido' });
            return;
        }
        try {
            const updatedUsuario = await usuarioService.updateUsuario(id_usuario, data);
            res.status(200).json(updatedUsuario);
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: 'Usuario no encontrado o error al actualizar' });
        }
    }
    // DELETE /usuarios/:id (Soft Delete)
    async remove(req, res) {
        const idParam = req.params.id;
        if (idParam === undefined) {
            res.status(400).json({ message: 'El ID es obligatorio en la ruta.' });
            return;
        }
        const id_usuario = parseInt(idParam, 10);
        if (isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID de usuario inválido' });
            return;
        }
        try {
            await usuarioService.deleteUsuario(id_usuario);
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: 'Usuario no encontrado o error al eliminar' });
        }
    }
}
//# sourceMappingURL=usuario.controller.js.map