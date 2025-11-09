import { EvidenciaRepository } from '../repositories/evidencia.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js'; // Necesario
import type { Evidencia, CreateEvidenciaDto } from '../models/evidencia.model.js';
import { BadRequestError, NotFoundError } from '../errors/custom.error.js';
import type { Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper para la ruta raíz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..'); 

export class EvidenciaService {

    constructor(
        private evidenciaRepository: EvidenciaRepository,
        // (Asegúrate de tener un TicketRepository)
        private ticketRepository: TicketRepository 
    ) {}

    async getEvidenciasByTicketId(id_ticket: number): Promise<Evidencia[]> {
        return this.evidenciaRepository.findByTicketId(id_ticket);
    }

    /**
     * Lógica de negocio para crear un registro de evidencia.
     * El archivo YA FUE SUBIDO por el middleware multer.
     */
    async createEvidencia(data: CreateEvidenciaDto): Promise<Evidencia> {
        const { id_ticket, url_archivo, tipo_mime } = data;

        if (!id_ticket || !url_archivo || !tipo_mime) {
            throw new BadRequestError('id_ticket, url_archivo y tipo_mime son obligatorios.');
        }

        // 1. Validar que el Ticket exista
        const ticket = await this.ticketRepository.findById(id_ticket);
        if (!ticket) {
            // Si el ticket no existe, borramos el archivo huérfano
            this.deleteFileFromServer(url_archivo);
            throw new NotFoundError(`Ticket con ID ${id_ticket} no encontrado.`);
        }

        // 2. Preparar datos para crear
        const evidenciaData: Prisma.evidenciaCreateInput = {
            url_archivo,
            tipo_mime,
            ticket: { connect: { id_ticket: id_ticket } }
        };

        return this.evidenciaRepository.create(evidenciaData);
    }

    /**
     * Lógica de negocio para eliminar una evidencia.
     * 1. Elimina el registro de la BD.
     * 2. Elimina el archivo físico del servidor.
     */
    async deleteEvidencia(id_evidencia: number): Promise<Evidencia> {
        // 1. Verificar que la evidencia exista en la BD
        const evidencia = await this.evidenciaRepository.findById(id_evidencia);
        if (!evidencia) {
            throw new NotFoundError(`Evidencia con ID ${id_evidencia} no encontrada.`);
        }

        // 2. Eliminar el archivo del servidor
        this.deleteFileFromServer(evidencia.url_archivo);

        // 3. Eliminar el registro de la BD
        return this.evidenciaRepository.delete(id_evidencia);
    }

    /**
     * Helper para borrar físicamente el archivo del disco.
     */
    private deleteFileFromServer(filePath: string): void {
        try {
            // filePath (ej: 'uploads/evidencias/evidencia-123.jpg')
            // Necesitamos la ruta absoluta para que fs.unlink funcione
            const absolutePath = path.join(projectRoot, filePath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log(`Archivo eliminado: ${absolutePath}`);
            } else {
                console.warn(`Se intentó eliminar un archivo que no existe: ${absolutePath}`);
            }
        } catch (error) {
            console.error(`Error al eliminar el archivo ${filePath}:`, error);
        }
    }
}