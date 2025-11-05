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

export const loginValidation = [
    body('email')
        .exists().withMessage('El email es obligatorio.')
        .isEmail().withMessage('El email debe ser una dirección de correo válida.')
        .normalizeEmail(), 

    body('password')
        .exists().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),

    handleValidationErrors
];