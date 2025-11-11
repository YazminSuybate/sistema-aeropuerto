import { body } from 'express-validator';
import { handleValidationErrors } from './auth.validation.js';

export const createSolicitudValidation = [
    body('motivo')
        .trim()
        .notEmpty().withMessage('El motivo es obligatorio.')
        .isString().withMessage('El motivo debe ser una cadena de texto.'),

    body('id_ticket')
        .notEmpty().withMessage('El ID de ticket es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de ticket debe ser un número entero válido.'),

    body('id_usuario_solicitante')
        .notEmpty().withMessage('El ID de usuario solicitante es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de usuario solicitante debe ser un número entero válido.'),

    body('id_usuario_aprobador')
        .optional() // Es opcional en la creación (Int? en schema)
        .isInt({ gt: 0 }).withMessage('El ID de usuario aprobador debe ser un número entero válido.'),

    body('id_area_origen')
        .notEmpty().withMessage('El ID de área origen es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de área origen debe ser un número entero válido.'),

    body('id_area_destino')
        .notEmpty().withMessage('El ID de área destino es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de área destino debe ser un número entero válido.'),

    handleValidationErrors
];

export const updateSolicitudValidation = [
    body('motivo')
        .optional()
        .trim()
        .notEmpty().withMessage('El motivo no puede estar vacío.')
        .isString().withMessage('El motivo debe ser una cadena de texto.'),

    body('estado_solicitud')
        .optional()
        .isString().withMessage('El estado debe ser texto.')
        .isIn(['PENDIENTE', 'APROBADA', 'RECHAZADA']).withMessage('Estado inválido. Debe ser PENDIENTE, APROBADA o RECHAZADA.'),

    body('id_ticket')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de ticket debe ser un número entero válido.'),

    body('id_usuario_solicitante')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de usuario solicitante debe ser un número entero válido.'),

    body('id_usuario_aprobador')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de usuario aprobador debe ser un número entero válido.'),

    body('id_area_origen')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de área origen debe ser un número entero válido.'),

    body('id_area_destino')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de área destino debe ser un número entero válido.'),
    
    // fecha_respuesta no se valida aquí, el servicio debería asignarla
    // cuando el estado cambia a APROBADA o RECHAZADA.

    handleValidationErrors
];