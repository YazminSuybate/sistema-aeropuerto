import type { TicketRepository } from "../repositories/ticket.repository.js";
import type { CategoriaRepository } from "../repositories/categoria.repository.js"; // Necesario
import type { EstadoRepository } from "../repositories/estado.repository.js"; // Necesario
import type { Ticket } from "../models/ticket.model.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";
import type { Prisma } from "@prisma/client";

// DTO (Data Transfer Object) para la creación
export interface CreateTicketDto {
    titulo: string;
    descripcion: string;
    id_categoria: number;
    id_pasajero?: number;
}

// DTO para la actualización básica
export interface UpdateTicketDto {
    titulo?: string;
    descripcion?: string;
}

export class TicketService {

    // Inyectamos todos los repositorios que necesitamos
    constructor(
        private ticketRepository: TicketRepository,
        private categoriaRepository: CategoriaRepository,
        private estadoRepository: EstadoRepository
    ) {}

    async getAllTickets(): Promise<Ticket[]> {
        return this.ticketRepository.findAll();
    }

    async getTicketById(id_ticket: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) {
            throw new NotFoundError(`Ticket con ID ${id_ticket} no encontrado.`);
        }
        return ticket;
    }

    /**
     * Lógica de negocio para crear un ticket.
     */
    async createTicket(data: CreateTicketDto, id_usuario_creador: number): Promise<Ticket> {
        // 1. Validar campos básicos
        if (!data.titulo || !data.descripcion || !data.id_categoria) {
            throw new BadRequestError('Título, descripción y categoría son obligatorios.');
        }
        
        // 2. Obtener la categoría para sacar el área por defecto y el SLA
        const categoria = await this.categoriaRepository.findById(data.id_categoria);
        if (!categoria) {
            throw new NotFoundError(`Categoría con ID ${data.id_categoria} no encontrada.`);
        }

        // 3. Obtener el estado inicial (Asumimos que el estado "Abierto" o "Pendiente" existe)
        // AVISO: Esto asume que tienes un estado con nombre_estado = 'Abierto'
        const estadoInicial = await this.estadoRepository.findByName('Abierto');
        if (!estadoInicial) {
            // Error crítico de configuración del sistema
            throw new Error('Estado inicial "Abierto" no encontrado. Configure la base de datos.');
        }

        // 4. Calcular Fecha Límite SLA
        const fechaLimiteSla = new Date();
        fechaLimiteSla.setHours(fechaLimiteSla.getHours() + categoria.sla_horas);

        // 5. Preparar el objeto de datos para Prisma (CORREGIDO)
        
        // 5.1. Prepara el objeto de datos SIN las relaciones opcionales
        const ticketData: Prisma.ticketCreateInput = {
            titulo: data.titulo,
            descripcion: data.descripcion,
            fecha_limite_sla: fechaLimiteSla,
            creador: { connect: { id_usuario: id_usuario_creador } },
            // NO INCLUIMOS 'responsable'. Prisma lo dejará NULL por defecto.
            area_asignada: { connect: { id_area: categoria.id_area_default } },
            estado: { connect: { id_estado: estadoInicial.id_estado } },
            categoria_info: { connect: { id_categoria: data.id_categoria } },
        };

        // 5.2. Agrega la relación 'pasajero_info' SÓLO SI 'id_pasajero' existe
        // (Esta es la parte que te faltaba)
        if (data.id_pasajero) {
            ticketData.pasajero_info = { 
                connect: { id_pasajero: data.id_pasajero } 
            };
        }

        // 5.3. Ahora el objeto 'ticketData' es correcto y puedes usarlo
        return this.ticketRepository.create(ticketData);
    }

    /**
     * Actualiza solo detalles menores de un ticket.
     * Otros cambios (estado, responsable, área) deben tener sus propios métodos.
     */
    async updateTicketDetails(id_ticket: number, data: UpdateTicketDto): Promise<Ticket> {
        await this.getTicketById(id_ticket); // Asegura que existe

        if (!data.titulo && !data.descripcion) {
            throw new BadRequestError('Debe proporcionar al menos un título o descripción para actualizar.');
        }

        // Filtramos para enviar solo lo que vino
        const dataToUpdate: Partial<Ticket> = {};
        if (data.titulo) dataToUpdate.titulo = data.titulo;
        if (data.descripcion) dataToUpdate.descripcion = data.descripcion;

        return this.ticketRepository.update(id_ticket, dataToUpdate);
    }

    /**
     * Elimina un ticket. (En un sistema real, se prefiere cambiar el estado a "Cancelado").
     */
    async deleteTicket(id_ticket: number): Promise<Ticket> {
        await this.getTicketById(id_ticket); // Asegura que existe
        return this.ticketRepository.delete(id_ticket);
    }
}