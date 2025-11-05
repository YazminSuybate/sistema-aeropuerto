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

export const createAreaValidation = [
    body('nombre_area')
        .trim()
        .notEmpty().withMessage('El nombre del área es obligatorio.')
        .isString().withMessage('El nombre del área debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre del área no debe exceder los 100 caracteres.'), //

    body('descripcion')
        .optional({ nullable: true })
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres.'), //

    handleValidationErrors
];

export const updateAreaValidation = [
    body('nombre_area')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre del área no puede estar vacío.')
        .isString().withMessage('El nombre del área debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre del área no debe exceder los 100 caracteres.'),

    body('descripcion')
        .optional({ nullable: true })
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres.'),

    handleValidationErrors
];