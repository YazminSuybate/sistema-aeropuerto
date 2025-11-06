export class CustomError extends Error {
    public statusCode: number;
    public code: string | undefined; 

    constructor(message: string, statusCode: number, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, CustomError.prototype); 
    }
}

export class NotFoundError extends CustomError {
    constructor(entityName: string = 'Recurso') {
        super(`${entityName} no encontrado.`, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string = 'Solicitud inválida. Verifique los datos.') {
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = 'Conflicto de datos. El recurso ya existe.', code?: string) {
        super(message, 409, code);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string = 'Acceso denegado. Permisos insuficientes.') {
        super(message, 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}