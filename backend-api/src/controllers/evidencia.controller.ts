import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { EvidenciaService } from '../services/evidencia.service.js';
import { EvidenciaRepository } from '../repositories/evidencia.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';
import { handleControllerError, validateAndGetId } from '../utils/controller.utils.js';
import fs from 'fs';

const evidenciaRepository = new EvidenciaRepository();
const ticketRepository = new TicketRepository();
const evidenciaService = new EvidenciaService(evidenciaRepository, ticketRepository);

export class EvidenciaController {

    // POST /api/evidencias/upload
    async createEvidencia(req: AuthRequest, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se subió ningún archivo.' });
            }

            const { id_ticket } = req.body;
            if (!id_ticket) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'El ID del ticket es obligatorio.' });
            }

            const relativePath = req.file.path.replace(/\\/g, '/');

            const data = {
                id_ticket: parseInt(id_ticket, 10),
                url_archivo: relativePath,
                tipo_mime: req.file.mimetype
            };

            const nuevaEvidencia = await evidenciaService.createEvidencia(data);
            return res.status(201).json(nuevaEvidencia);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }

            if (error instanceof BadRequestError) {
                return res.status(400).json({ message: error.message });
            }

            return handleControllerError(error, res, 'Error al crear la evidencia.');
        }
    }

    // GET /api/evidencias/ticket/:id_ticket
    async getEvidenciasByTicketId(req: AuthRequest, res: Response) {
        const id_ticket = validateAndGetId(req, res, 'id_ticket');
        if (id_ticket === null) return;

        try {
            const evidencias = await evidenciaService.getEvidenciasByTicketId(id_ticket);
            return res.status(200).json(evidencias);
        } catch (error: any) {
            return handleControllerError(error, res, 'Error al obtener las evidencias del ticket.');
        }
    }

    // DELETE /api/evidencias/:id
    async deleteEvidencia(req: AuthRequest, res: Response) {
        const id_evidencia = validateAndGetId(req, res, 'id');
        if (id_evidencia === null) return;

        try {
            await evidenciaService.deleteEvidencia(id_evidencia);
            return res.status(204).send();
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            return handleControllerError(error, res, 'Error al eliminar la evidencia.');
        }
    }
}