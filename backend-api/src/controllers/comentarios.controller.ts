import type { Request, Response } from 'express';
import { ComentarioService } from '../services/comentarios.service.js';
import { ComentarioRepository } from '../repositories/comentarios.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { CustomError } from '../errors/custom.error.js';

// Instanciamos repositorios y el servicio
const comentarioRepository = new ComentarioRepository();
const ticketRepository = new TicketRepository();
const usuarioRepository = new UsuarioRepository();
const comentarioService = new ComentarioService(
    comentarioRepository, 
    ticketRepository, 
    usuarioRepository
);

// Función genérica para manejar errores del controlador
function handleControllerError(error: any, res: Response, defaultMessage: string): Response | void {
    console.error(`Error en el controlador de Comentario:`, error);

    // Error personalizado (lanzado desde el servicio)
    if (error && error.statusCode) {
        return res.status((error as CustomError).statusCode).json({ message: error.message });
    }

    // Errores de Prisma
    if (error.code) {
        switch (error.code) {
            case 'P2002': // Unique constraint failed
                return res.status(409).json({ message: error.message || 'El recurso ya existe.', code: 'P2002' });
            case 'P2003': // Foreign key constraint failed
                return res.status(400).json({ message: error.message || 'Error de llave foránea. Recurso asociado inválido.', code: 'P2003' });
        }
    }

    // Error genérico
    return res.status(500).json({ message: defaultMessage });
};

// Función para validar y obtener el ID de los parámetros
function validateAndGetId(req: Request, res: Response): number | null {
    const idParam = req.params.id;

    if (!idParam) {
        res.status(400).json({ message: 'El ID de comentario es obligatorio en la ruta.' });
        return null;
    }

    const id_comentario = parseInt(idParam, 10);

    if (isNaN(id_comentario)) {
        res.status(400).json({ message: 'ID de comentario inválido' });
        return null;
    }

    return id_comentario;
}


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
        const id_comentario = validateAndGetId(req, res);
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
        // Basado en el diagrama de BD, se necesita: mensaje, id_ticket, id_usuario
        const { mensaje, id_ticket, id_usuario } = req.body;

        try {
            // Asumimos que el servicio manejará la fecha_comentario
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

        // El servicio determinará qué campos se pueden actualizar (ej. solo 'mensaje')
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
        const id_comentario = validateAndGetId(req, res);
        if (id_comentario === null) return;

        try {
            await comentarioService.deleteComentario(id_comentario);
            res.status(204).send(); // No content
        } catch (error: any) {
            // A diferencia de Categoria, Comentario no parece tener otras tablas que dependan de él,
            // por lo que el P2003 genérico del handler es suficiente.
            handleControllerError(error, res, 'Error al eliminar el comentario.');
        }
    }
}