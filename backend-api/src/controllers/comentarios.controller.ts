import type { Request, Response } from 'express';
import { ComentarioService } from '../services/comentarios.service.js';
import { ComentarioRepository } from '../repositories/comentarios.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const comentarioRepository = new ComentarioRepository();
const ticketRepository = new TicketRepository();
const usuarioRepository = new UsuarioRepository();
const comentarioService = new ComentarioService(
    comentarioRepository,
    ticketRepository,
    usuarioRepository
);

export class ComentarioController {
    // GET api/comentarios
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const comentarios = await comentarioService.getAllComentarios();
            res.status(200).json(comentarios);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener comentarios');
        }
    }

    // GET api/comentarios/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_comentario = validateAndGetId(req, res, 'id');
        if (id_comentario === null) return;

        try {
            const comentario = await comentarioService.getComentarioById(id_comentario);
            res.status(200).json(comentario);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener el comentario');
        }
    }


    // POST api/comentarios
    async create(req: Request, res: Response): Promise<void> {
        const { mensaje, id_ticket, id_usuario } = req.body;

        try {
            const data = {
                mensaje,
                id_ticket: Number(id_ticket),
                id_usuario: Number(id_usuario)
            };
            const newComentario = await comentarioService.createComentario(data);
            res.status(201).json(newComentario);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear comentario.');
        }
    }

    // PUT api/comentarios/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_comentario = validateAndGetId(req, res);
        if (id_comentario === null) return;

        const data = req.body;

        try {
            const updatedComentario = await comentarioService.updateComentario(id_comentario, data);
            res.status(200).json(updatedComentario);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar el comentario.');
        }
    }

    // DELETE api/comentarios/:id
    async remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> {
        const id_comentario = validateAndGetId(req, res, 'id');
        if (id_comentario === null) return;

        try {
            await comentarioService.deleteComentario(id_comentario);
            res.status(204).send();
        } catch (error: any) {
            handleControllerError(error, res, 'Error al eliminar el comentario.');
        }
    }
}