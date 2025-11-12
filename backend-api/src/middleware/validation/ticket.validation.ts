import { body } from 'express-validator';

export const createTicketValidation = [
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio.')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres.'),
    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria.')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.'),
    body('id_categoria')
        .isInt({ min: 1 }).withMessage('El ID de categoría es obligatorio y debe ser un número.'),
    body('id_pasajero')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de pasajero debe ser un número.'),
];

export const updateTicketValidation = [
    body('titulo')
        .optional()
        .notEmpty().withMessage('El título no puede estar vacío.')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres.'),
    body('descripcion')
        .optional()
        .notEmpty().withMessage('La descripción no puede estar vacía.')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.'),
];