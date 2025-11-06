import { body } from 'express-validator';
import { handleValidationErrors } from './auth.validation.js';

export const createCategoriaValidation = [
    body('nombre_categoria')
        .trim()
        .notEmpty().withMessage('El nombre de la categoría es obligatorio.')
        .isString().withMessage('El nombre de la categoría debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre de la categoría no debe exceder los 100 caracteres.'),

    body('prioridad')
        .trim()
        .notEmpty().withMessage('La prioridad es obligatoria.')
        .isString().withMessage('La prioridad debe ser una cadena de texto.')
        .isIn(['Alta', 'Media', 'Baja', 'Muy Baja']).withMessage('La prioridad debe ser Alta, Media, Baja o Muy Baja.'),

    body('sla_horas')
        .notEmpty().withMessage('El SLA en horas es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El SLA debe ser un número entero positivo.'),

    body('id_area_default')
        .notEmpty().withMessage('El ID de área por defecto es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de área por defecto debe ser un número entero válido.'),

    handleValidationErrors
];

export const updateCategoriaValidation = [
    body('nombre_categoria')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre de la categoría no puede estar vacío.')
        .isString().withMessage('El nombre de la categoría debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre de la categoría no debe exceder los 100 caracteres.'),

    body('prioridad')
        .optional()
        .trim()
        .notEmpty().withMessage('La prioridad no puede estar vacía.')
        .isString().withMessage('La prioridad debe ser una cadena de texto.')
        .isIn(['Alta', 'Media', 'Baja', 'Muy Baja']).withMessage('La prioridad debe ser Alta, Media, Baja o Muy Baja.'),

    body('sla_horas')
        .optional()
        .isInt({ gt: 0 }).withMessage('El SLA debe ser un número entero positivo.'),

    body('id_area_default')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de área por defecto debe ser un número entero válido.'),

    handleValidationErrors
];