import type { TicketRepository } from "../repositories/ticket.repository.js";
import type { CategoriaRepository } from "../repositories/categoria.repository.js"; // Necesario
import type { EstadoRepository } from "../repositories/estado.repository.js"; // Necesario
import type { Ticket } from "../models/ticket.model.js";
import type { UsuarioRepository } from "../repositories/usuario.repository.js";
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
    private estadoRepository: EstadoRepository,
    private usuarioRepository: UsuarioRepository
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
   * Obtiene todos los tickets asignados a un área específica.
   */
  async getTicketsByAreaId(id_area: number): Promise<Ticket[]> {
    // Si no hay tickets para esa área, el repositorio devolverá un array vacío.
    // No es necesario validar si el área existe primero, a menos que sea un requisito.
    return this.ticketRepository.findByAreaId(id_area);
  }

  /**
   * Obtiene todos los tickets asignados a un responsable (usuario) específico.
   */
  async getTicketsByResponsibleId(id_usuario: number): Promise<Ticket[]> {
    // Igual que con el área, si el usuario no tiene tickets asignados,
    // el repositorio devolverá un array vacío.
    return this.ticketRepository.findByResponsibleId(id_usuario);
  }

  /**
   * Asigna un ticket a un operador
   */
  async assignTicketToOperator(
    id_ticket: number,
    id_operador: number
  ): Promise<Ticket> {
    // 1. Verificamos el ticket
    const ticket = await this.ticketRepository.findById(id_ticket);
    if (!ticket) {
      throw new NotFoundError(`Ticket con ID ${id_ticket} no encontrado.`);
    }

    // 2. Verificamos el operador
    const operador = await this.usuarioRepository.findById(id_operador);
    if (!operador || !operador.activo) {
      throw new NotFoundError(
        `Operador con ID ${id_operador} no encontrado o inactivo.`
      );
    }

    // 3. [LÓGICA CLAVE] Verificamos que el operador pertenezca al área del ticket
    // Esta línea SÍ funciona porque 'id_area_asignada' está en el tipo base 'ticket'
    // y no causa el error de tipos.
    if (operador.id_area !== ticket.id_area_asignada) {
      throw new BadRequestError(
        `El operador (Área ID ${operador.id_area}) no pertenece al área del ticket (Área ID ${ticket.id_area_asignada}).`
      );
    }

    // 4. Preparamos la actualización (SOLO el responsable)
    const dataToUpdate = {
      id_usuario_responsable: id_operador,
      id_estado: 2,
    };

    // 5. Actualizamos
    return this.ticketRepository.update(id_ticket, dataToUpdate);
  }

  /**
   * Asigna un ticket al usuario que está actualmente logueado.
   */
  async claimTicket(
    id_ticket: number,
    user: { id: number; id_area: number | null }
  ): Promise<Ticket> {
    // 1. Verificamos el ticket
    // (Usamos findById, pero no necesitamos las relaciones para esta lógica)
    const ticket = await this.ticketRepository.findById(id_ticket);
    if (!ticket) {
      throw new NotFoundError(`Ticket con ID ${id_ticket} no encontrado.`);
    }

    // 2. [Validación 1] Verificamos que el ticket esté disponible
    if (ticket.id_usuario_responsable !== null) {
      throw new BadRequestError(
        `El ticket ya está asignado al usuario ID ${ticket.id_usuario_responsable}.`
      );
    }

    // 3. [Validación 2] Verificamos que el operador pertenezca al área del ticket
    if (!user.id_area) {
      throw new BadRequestError(
        `No puedes tomar este ticket porque tu usuario no tiene un área asignada.`
      );
    }
    if (user.id_area !== ticket.id_area_asignada) {
      throw new BadRequestError(
        `Tu área (ID ${user.id_area}) no coincide con el área del ticket (ID ${ticket.id_area_asignada}).`
      );
    }

    // 4. Preparamos la actualización (responsable Y estado)
    const dataToUpdate = {
      id_usuario_responsable: user.id, // El ID del usuario logueado
      id_estado: 2, // "Asignado"
    };

    // 5. Actualizamos
    return this.ticketRepository.update(id_ticket, dataToUpdate);
  }

  /**
   * Lógica de negocio para crear un ticket.
   */
  async createTicket(
    data: CreateTicketDto,
    id_usuario_creador: number
  ): Promise<Ticket> {
    // 1. Validar campos básicos
    if (!data.titulo || !data.descripcion || !data.id_categoria) {
      throw new BadRequestError(
        "Título, descripción y categoría son obligatorios."
      );
    }

    // 2. Obtener la categoría para sacar el área por defecto y el SLA
    const categoria = await this.categoriaRepository.findById(
      data.id_categoria
    );
    if (!categoria) {
      throw new NotFoundError(
        `Categoría con ID ${data.id_categoria} no encontrada.`
      );
    }

    // 3. Obtener el estado inicial (Asumimos que el estado "Abierto" o "Pendiente" existe)
    // AVISO: Esto asume que tienes un estado con nombre_estado = 'Abierto'
    const estadoInicial = await this.estadoRepository.findByName("Abierto");
    if (!estadoInicial) {
      // Error crítico de configuración del sistema
      throw new Error(
        'Estado inicial "Abierto" no encontrado. Configure la base de datos.'
      );
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
        connect: { id_pasajero: data.id_pasajero },
      };
    }

    // 5.3. Ahora el objeto 'ticketData' es correcto y puedes usarlo
    return this.ticketRepository.create(ticketData);
  }

  /**
   * Actualiza solo detalles menores de un ticket.
   * Otros cambios (estado, responsable, área) deben tener sus propios métodos.
   */
  async updateTicketDetails(
    id_ticket: number,
    data: UpdateTicketDto
  ): Promise<Ticket> {
    await this.getTicketById(id_ticket); // Asegura que existe

    if (!data.titulo && !data.descripcion) {
      throw new BadRequestError(
        "Debe proporcionar al menos un título o descripción para actualizar."
      );
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
