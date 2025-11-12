import type { SolicitudCambioAreaRepository } from "../repositories/solicitudcambioarea.repository.js";
import type { TicketRepository } from "../repositories/ticket.repository.js";
import type { UsuarioRepository } from "../repositories/usuario.repository.js";
import type { AreaRepository } from "../repositories/area.repository.js"; // Necesario
import type { SolicitudCambioArea, SolicitudCambioAreaCreateDTO, SolicitudCambioAreaUpdateDTO } from "../models/solicitudcambioarea.model.js";
import { BadRequestError, NotFoundError } from "../errors/custom.error.js";

export class SolicitudCambioAreaService {
    private solicitudRepository: SolicitudCambioAreaRepository;
    private ticketRepository: TicketRepository;
    private usuarioRepository: UsuarioRepository;
    private areaRepository: AreaRepository; // Necesario

    constructor(
        solicitudRepository: SolicitudCambioAreaRepository, 
        ticketRepository: TicketRepository, 
        usuarioRepository: UsuarioRepository,
        areaRepository: AreaRepository // Inyectado
    ) {
        this.solicitudRepository = solicitudRepository;
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
        this.areaRepository = areaRepository;
    }

    async getAllSolicitudes(): Promise<SolicitudCambioArea[]> {
        return this.solicitudRepository.findAll();
    }

    async getSolicitudById(id_solicitud: number): Promise<SolicitudCambioArea> {
        const solicitud = await this.solicitudRepository.findById(id_solicitud);
        if (!solicitud) {
            throw new NotFoundError(`Solicitud con ID ${id_solicitud} no encontrada.`);
        }
        return solicitud;
    }

    // Funciones de validación de FKs
    private async validateTicket(id_ticket: number) {
        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) throw new BadRequestError(`El Ticket con ID ${id_ticket} no existe.`);
    }

    private async validateUsuario(id_usuario: number, rol: string) {
        const usuario = await this.usuarioRepository.findById(id_usuario);
        if (!usuario) throw new BadRequestError(`El Usuario (${rol}) con ID ${id_usuario} no existe.`);
    }

    private async validateArea(id_area: number, tipo: string) {
        const area = await this.areaRepository.findById(id_area);
        if (!area) throw new BadRequestError(`El Area (${tipo}) con ID ${id_area} no existe.`);
    }


    async createSolicitud(data: SolicitudCambioAreaCreateDTO): Promise<SolicitudCambioArea> {
        // 1. Validar lógica de negocio
        if (!data.motivo || data.motivo.trim() === '') {
            throw new BadRequestError("El motivo es obligatorio.");
        }
        if (!data.id_ticket) throw new BadRequestError("El ID de ticket es obligatorio.");
        if (!data.id_usuario_solicitante) throw new BadRequestError("El ID de usuario solicitante es obligatorio.");
        if (!data.id_area_origen) throw new BadRequestError("El ID de área origen es obligatorio.");
        if (!data.id_area_destino) throw new BadRequestError("El ID de área destino es obligatorio.");

        if (data.id_area_origen === data.id_area_destino) {
            throw new BadRequestError("El área de origen y destino no pueden ser la misma.");
        }

        // 2. Validar llaves foráneas
        await this.validateTicket(data.id_ticket);
        await this.validateUsuario(data.id_usuario_solicitante, "Solicitante");
        if (data.id_usuario_aprobador) {
            await this.validateUsuario(data.id_usuario_aprobador, "Aprobador");
        }
        await this.validateArea(data.id_area_origen, "Origen");
        await this.validateArea(data.id_area_destino, "Destino");

        // 3. Crear el recurso
        // Los campos omitidos (estado, fechas) tomarán sus valores default
        return this.solicitudRepository.create(data);
    }

    async updateSolicitud(id_solicitud: number, data: SolicitudCambioAreaUpdateDTO): Promise<SolicitudCambioArea> {
        // 1. Asegurar que la solicitud existe
        await this.getSolicitudById(id_solicitud);

        // 2. Validar FKs (si se están actualizando)
        if (data.id_ticket) await this.validateTicket(data.id_ticket);
        if (data.id_usuario_solicitante) await this.validateUsuario(data.id_usuario_solicitante, "Solicitante");
        if (data.id_usuario_aprobador) await this.validateUsuario(data.id_usuario_aprobador, "Aprobador");
        if (data.id_area_origen) await this.validateArea(data.id_area_origen, "Origen");
        if (data.id_area_destino) await this.validateArea(data.id_area_destino, "Destino");
        
        // 3. Validar estado (si se actualiza)
        if (data.estado_solicitud && !['PENDIENTE', 'APROBADA', 'RECHAZADA'].includes(data.estado_solicitud)) {
             throw new BadRequestError("Estado de solicitud inválido.");
        }
        
        // Si se aprueba o rechaza, se debería setear la fecha_respuesta y el id_usuario_aprobador
        // (esa lógica podría ir aquí, pero por ahora seguimos el patrón simple de update)

        // 4. Actualizar
        return this.solicitudRepository.update(id_solicitud, data);
    }

    async deleteSolicitud(id_solicitud: number): Promise<SolicitudCambioArea> {
        await this.getSolicitudById(id_solicitud); // Asegurar que existe
        return this.solicitudRepository.delete(id_solicitud);
    }
}