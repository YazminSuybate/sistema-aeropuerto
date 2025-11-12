import type { ComentarioRepository } from "../repositories/comentarios.repository.js";
import type { TicketRepository } from "../repositories/ticket.repository.js";
import type { UsuarioRepository } from "../repositories/usuario.repository.js";
import type { Comentario, ComentarioCreateDTO, ComentarioUpdateDTO } from "../models/comentarios.model.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";

export class ComentarioService {
    private comentarioRepository: ComentarioRepository;
    private ticketRepository: TicketRepository;
    private usuarioRepository: UsuarioRepository;

    constructor(
        comentarioRepository: ComentarioRepository, 
        ticketRepository: TicketRepository, 
        usuarioRepository: UsuarioRepository
    ) {
        this.comentarioRepository = comentarioRepository;
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async getAllComentarios(): Promise<Comentario[]> {
        return this.comentarioRepository.findAll();
    }

    async getComentarioById(id_comentario: number): Promise<Comentario> {
        const comentario = await this.comentarioRepository.findById(id_comentario);
        if (!comentario) {
            throw new NotFoundError(`Comentario con ID ${id_comentario} no encontrado.`);
        }
        return comentario;
    }

    /**
     * Valida si un Ticket existe.
     * Lanza BadRequestError si no se encuentra.
     */
    private async validateTicket(id_ticket: number) {
        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) {
            throw new BadRequestError(`El Ticket con ID ${id_ticket} no existe.`);
        }
    }

    /**
     * Valida si un Usuario existe.
     * Lanza BadRequestError si no se encuentra.
     */
    private async validateUsuario(id_usuario: number) {
        const usuario = await this.usuarioRepository.findById(id_usuario);
        if (!usuario) {
            throw new BadRequestError(`El Usuario con ID ${id_usuario} no existe.`);
        }
    }

    async createComentario(data: ComentarioCreateDTO): Promise<Comentario> {
        // 1. Validar lógica de negocio
        if (!data.mensaje || data.mensaje.trim() === '') {
            throw new BadRequestError("El mensaje es obligatorio.");
        }
        if (!data.id_ticket) {
            throw new BadRequestError("El ID de ticket es obligatorio.");
        }
        if (!data.id_usuario) {
            throw new BadRequestError("El ID de usuario es obligatorio.");
        }

        // 2. Validar llaves foráneas
        await this.validateTicket(data.id_ticket);
        await this.validateUsuario(data.id_usuario);

        // 3. Crear el recurso
        // No se necesita un try/catch para P2002 (unique) como en Categoria,
        // ya que los comentarios no necesitan ser únicos.
        // La fecha_comentario debe ser manejada por la DB (DEFAULT NOW()) o el repositorio.
        return this.comentarioRepository.create(data);
    }

    async updateComentario(id_comentario: number, data: ComentarioUpdateDTO): Promise<Comentario> {
        // 1. Asegurar que el comentario existe
        await this.getComentarioById(id_comentario);

        // 2. Validar lógica de negocio (solo si se envía el campo)
        if (data.mensaje?.trim() === '') {
            throw new BadRequestError("El mensaje no puede estar vacío.");
        }
        
        // 3. Validar FKs (si se permite cambiarlos en la actualización)
        if (data.id_ticket) {
            await this.validateTicket(data.id_ticket);
        }
        if (data.id_usuario) {
            await this.validateUsuario(data.id_usuario);
        }

        // 4. Actualizar
        // Asumimos que no hay constraints únicos (P2002) que manejar
        return this.comentarioRepository.update(id_comentario, data);
    }

    async deleteComentario(id_comentario: number): Promise<Comentario> {
        // Siguiendo el patrón de categoria.service.ts, llamamos directo al repositorio.
        // Si el comentario no existe, el repositorio (Prisma) lanzará un error P2025
        // que será manejado por el handleControllerError genérico.
        return this.comentarioRepository.delete(id_comentario);
    }
}