import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { EvidenciaService } from '../services/evidencia.service.js';
import { EvidenciaRepository } from '../repositories/evidencia.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';
import fs from 'fs'; // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!

// Instanciar repositorios y servicio
const evidenciaRepository = new EvidenciaRepository();
const ticketRepository = new TicketRepository(); 
const evidenciaService = new EvidenciaService(evidenciaRepository, ticketRepository);

// Helper para validar IDs
function validateAndGetId(req: AuthRequest, res: Response, paramName: string = 'id'): number | null {
    const id_param = req.params[paramName];
    if (!id_param) {
        res.status(400).json({ message: `Parámetro ID '${paramName}' faltante.` });
        return null;
    }
    const id = parseInt(id_param, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: `ID '${paramName}' inválido.` });
        return null;
    }
    return id;
}

export class EvidenciaController {
    
    // POST /api/evidencias/upload
    async createEvidencia(req: AuthRequest, res: Response) {
        try {
            // 1. El archivo viene en req.file gracias a multer
            if (!req.file) {
                return res.status(400).json({ message: 'No se subió ningún archivo.' });
            }
            
            // 2. El ID del ticket viene en el cuerpo del formulario (multipart/form-data)
            const { id_ticket } = req.body;
            if (!id_ticket) {
                // Si falta el ID, borramos el archivo que se subió
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'El ID del ticket es obligatorio.' });
            }

            // 3. (IMPORTANTE) Guardamos la RUTA RELATIVA, no absoluta
            // req.file.path te da algo como: uploads/evidencias/evidencia-123.jpg
            const relativePath = req.file.path.replace(/\\/g, '/'); // Normalizar a Slashes

            const data = {
                id_ticket: parseInt(id_ticket, 10),
                url_archivo: relativePath, // La ruta relativa
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
            console.error('Error en createEvidencia:', error);
            return res.status(500).json({ message: error.message || 'Error al subir la evidencia.' });
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
            console.error('Error en getEvidenciasByTicketId:', error);
            return res.status(500).json({ message: 'Error al obtener evidencias.' });
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
            console.error('Error en deleteEvidencia:', error);
            return res.status(500).json({ message: 'Error al eliminar la evidencia.' });
        }
    }
}