import { body } from 'express-validator';
import { handleValidationErrors } from './auth.validation.js';

export const createEstadoValidation = [
    body('nombre_estado')
        .trim()
        .notEmpty().withMessage('El nombre del estado es obligatorio.')
        .isString().withMessage('El nombre del estado debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El nombre del estado no debe exceder los 50 caracteres.'),

    body('descripcion')
        .optional({ nullable: true })
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres.'),

    handleValidationErrors
];

export const updateEstadoValidation = [
    body('nombre_estado')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre del estado no puede estar vacío.')
        .isString().withMessage('El nombre del estado debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El nombre del estado no debe exceder los 50 caracteres.'),

    body('descripcion')
        .optional({ nullable: true })
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres.'),

    handleValidationErrors
];