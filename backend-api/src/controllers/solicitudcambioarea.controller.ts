import type { Request, Response } from 'express';
import { SolicitudCambioAreaService } from '../services/solicitudcambioarea.service.js';
import { SolicitudCambioAreaRepository } from '../repositories/solicitudcambioarea.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { AreaRepository } from '../repositories/area.repository.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';

const solicitudRepository = new SolicitudCambioAreaRepository();
const ticketRepository = new TicketRepository();
const usuarioRepository = new UsuarioRepository();
const areaRepository = new AreaRepository();

const solicitudService = new SolicitudCambioAreaService(
    solicitudRepository,
    ticketRepository,
    usuarioRepository,
    areaRepository
);

export class SolicitudCambioAreaController {
    // GET api/solicitudcambioarea
    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const solicitudes = await solicitudService.getAllSolicitudes();
            res.status(200).json(solicitudes);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener solicitudes');
        }
    }

    // GET api/solicitudcambioarea/:id
    async getById(req: Request, res: Response): Promise<void> {
        const id_solicitud = validateAndGetId(req, res, 'id');
        if (id_solicitud === null) return;

        try {
            const solicitud = await solicitudService.getSolicitudById(id_solicitud);
            res.status(200).json(solicitud);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al obtener la solicitud');
        }
    }

    // POST api/solicitudcambioarea
    async create(req: Request, res: Response): Promise<void> {
        const { motivo, id_ticket, id_usuario_solicitante, id_usuario_aprobador, id_area_origen, id_area_destino } = req.body;

        try {
            const data = {
                motivo,
                id_ticket: Number(id_ticket),
                id_usuario_solicitante: Number(id_usuario_solicitante),
                id_usuario_aprobador: id_usuario_aprobador ? Number(id_usuario_aprobador) : null,
                id_area_origen: Number(id_area_origen),
                id_area_destino: Number(id_area_destino)
            };
            const newSolicitud = await solicitudService.createSolicitud(data);
            res.status(201).json(newSolicitud);
        } catch (error: any) {
            handleControllerError(error, res, 'Error interno del servidor al crear solicitud.');
        }
    }

    // PUT api/solicitudcambioarea/:id
    async update(req: Request, res: Response): Promise<void> {
        const id_solicitud = validateAndGetId(req, res, 'id');
        if (id_solicitud === null) return;

        const data = req.body;

        try {
            const updatedSolicitud = await solicitudService.updateSolicitud(id_solicitud, data);
            res.status(200).json(updatedSolicitud);
        } catch (error: any) {
            handleControllerError(error, res, 'Error al actualizar la solicitud.');
        }
    }

    // DELETE api/solicitudcambioarea/:id
    async remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> {
        const id_solicitud = validateAndGetId(req, res, 'id');
        if (id_solicitud === null) return;

        try {
            await solicitudService.deleteSolicitud(id_solicitud);
            res.status(204).send();
        } catch (error: any) {
            handleControllerError(error, res, 'Error al eliminar la solicitud.');
        }
    }
}