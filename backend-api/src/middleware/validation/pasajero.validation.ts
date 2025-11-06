import { body } from 'express-validator';
import { handleValidationErrors } from './auth.validation.js';

export const createPasajeroValidation = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre del pasajero es obligatorio.')
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder los 100 caracteres.'),

    body('documento_id')
        .trim()
        .notEmpty().withMessage('El documento de identidad es obligatorio.')
        .isString().withMessage('El documento de identidad debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El documento de identidad no debe exceder los 50 caracteres.'),

    body('info_contacto')
        .optional({ nullable: true })
        .isString().withMessage('La información de contacto debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La información de contacto no debe exceder los 255 caracteres.'),

    handleValidationErrors
];

export const updatePasajeroValidation = [
    body('nombre')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre del pasajero no puede estar vacío.')
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder los 100 caracteres.'),

    body('documento_id')
        .optional()
        .trim()
        .notEmpty().withMessage('El documento de identidad no puede estar vacío.')
        .isString().withMessage('El documento de identidad debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El documento de identidad no debe exceder los 50 caracteres.'),

    body('info_contacto')
        .optional({ nullable: true })
        .isString().withMessage('La información de contacto debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La información de contacto no debe exceder los 255 caracteres.'),

    handleValidationErrors
];