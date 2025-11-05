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

export const createRolValidation = [
    body('nombre_rol')
        .trim()
        .notEmpty().withMessage('El nombre del rol es obligatorio.')
        .isString().withMessage('El nombre del rol debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El nombre del rol no debe exceder los 50 caracteres.'), //

    body('descripcion')
        .optional({ nullable: true }) 
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres.'), //

    handleValidationErrors
];

export const updateRolValidation = [
    body('nombre_rol')
        .optional() 
        .trim()
        .notEmpty().withMessage('El nombre del rol no puede estar vacío.')
        .isString().withMessage('El nombre del rol debe ser una cadena de texto.')
        .isLength({ max: 50 }).withMessage('El nombre del rol no debe exceder los 50 caracteres.'),

    body('descripcion')
        .optional({ nullable: true }) 
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres.'),

    handleValidationErrors
];