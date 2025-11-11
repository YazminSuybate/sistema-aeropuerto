import { body } from 'express-validator';
import { handleValidationErrors } from './auth.validation.js'; // Asumo que auth.validation.js es correcto

export const createComentarioValidation = [
    body('mensaje')
        .trim()
        .notEmpty().withMessage('El mensaje es obligatorio.')
        .isString().withMessage('El mensaje debe ser una cadena de texto.'),
    // No hay límite de longitud para 'mensaje' ya que es TEXT,
    // a menos que quieras agregar uno (ej. .isLength({ max: 5000 }))

    body('id_ticket')
        .notEmpty().withMessage('El ID de ticket es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de ticket debe ser un número entero válido.'),

    body('id_usuario')
        .notEmpty().withMessage('El ID de usuario es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de usuario debe ser un número entero válido.'),

    handleValidationErrors
];

export const updateComentarioValidation = [
    body('mensaje')
        .optional()
        .trim()
        .notEmpty().withMessage('El mensaje no puede estar vacío.')
        .isString().withMessage('El mensaje debe ser una cadena de texto.'),

    // Siguiendo el patrón, permitimos la actualización opcional de las FK.
    // En la práctica, esto es poco común para comentarios,
    // pero el servicio que hicimos SÍ lo soporta.
    body('id_ticket')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de ticket debe ser un número entero válido.'),

    body('id_usuario')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de usuario debe ser un número entero válido.'),

    handleValidationErrors
];