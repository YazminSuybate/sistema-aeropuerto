import { body } from 'express-validator';
import { handleValidationErrors } from './auth.validation.js';

export const createHistorialTicketValidation = [
    body('tipo_cambio')
        .trim()
        .notEmpty().withMessage('El tipo de cambio es obligatorio.')
        .isString().withMessage('El tipo de cambio debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El tipo de cambio no debe exceder los 50 caracteres.'),

    body('valor_anterior')
        .optional() // El valor anterior puede ser nulo (ej. en creación)
        .isString().withMessage('El valor anterior debe ser una cadena de texto.'),

    body('valor_nuevo')
        .optional() // El valor nuevo puede ser nulo
        .isString().withMessage('El valor nuevo debe ser una cadena de texto.'),

    body('id_ticket')
        .notEmpty().withMessage('El ID de ticket es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de ticket debe ser un número entero válido.'),

    body('id_usuario')
        .notEmpty().withMessage('El ID de usuario es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de usuario debe ser un número entero válido.'),

    handleValidationErrors
];

export const updateHistorialTicketValidation = [
    body('tipo_cambio')
        .optional()
        .trim()
        .notEmpty().withMessage('El tipo de cambio no puede estar vacío.')
        .isString().withMessage('El tipo de cambio debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El tipo de cambio no debe exceder los 50 caracteres.'),

    body('valor_anterior')
        .optional()
        .isString().withMessage('El valor anterior debe ser una cadena de texto.'),

    body('valor_nuevo')
        .optional()
        .isString().withMessage('El valor nuevo debe ser una cadena de texto.'),

    body('id_ticket')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de ticket debe ser un número entero válido.'),

    body('id_usuario')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de usuario debe ser un número entero válido.'),

    handleValidationErrors
];