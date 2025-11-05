import { body, validationResult } from 'express-validator';
import type { FieldValidationError } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

const isFieldValidationError = (err: any): err is FieldValidationError => {
    return err.type === 'field';
};

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array()
            .filter(isFieldValidationError)
            .map((err) => ({
                param: err.path,
                message: err.msg
            }));

        return res.status(400).json({ errors: formattedErrors });
    }

    next();
};

export const createUsuarioValidation = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio.'),

    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('El formato del correo electrónico es inválido.'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),

    body('id_rol')
        .notEmpty().withMessage('El ID de rol es obligatorio.')
        .isInt({ gt: 0 }).withMessage('El ID de rol debe ser un número entero válido.'),

    handleValidationErrors
];

export const updateUsuarioValidation = [
    // Validaciones de Nombre y Apellido
    body('nombre')
        .optional() 
        .notEmpty().withMessage('El nombre no puede estar vacío.')
        .isString().withMessage('El nombre debe ser una cadena de texto.'),

    body('apellido')
        .optional()
        .notEmpty().withMessage('El apellido no puede estar vacío.')
        .isString().withMessage('El apellido debe ser una cadena de texto.'),

    // Validaciones de Email
    body('email')
        .optional()
        .isEmail().withMessage('El formato del correo electrónico es inválido.'),

    // Validaciones de Password
    body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('La contraseña, si se proporciona, debe tener al menos 8 caracteres.'),

    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false).'),

    body('id_rol')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de rol debe ser un número entero válido.'),

    body('id_area')
        .optional({ nullable: true }) 
        .isInt({ gt: 0 }).withMessage('El ID de área debe ser un número entero válido.'),

    handleValidationErrors
];