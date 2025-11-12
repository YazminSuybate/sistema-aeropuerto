import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        id_rol: number;
        id_area: number;
        permisos: string[];
    };
}
export class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;

        try {
            const result = await authService.login(email, password);

            if (!result) {
                return res.status(401).json({ message: 'Credenciales inválidas o usuario inactivo.' });
            }

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                accessToken: result.accessToken,
                user: result.user,
            });
        } catch (error) {
            console.error('Error en el login:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    // --- ¡ESTE ES EL MÉTODO NUEVO QUE ARREGLA EL ERROR 404! ---
    // Responde a: GET /api/auth/profile (o /api/profile)
    async getProfile(req: AuthRequest, res: Response): Promise<Response> {
        try {
            // req.user es insertado por tu middleware 'protect'
            // Tu interfaz 'AuthRequest' dice que el id está en 'req.user.id'
            const userId = req.user?.id; 

            if (!userId) {
                return res.status(401).json({ message: 'Token inválido (no contiene ID)' });
            }

            // Llama al método en el servicio (que también actualizaremos)
            const usuario = await authService.getProfileById(userId);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario del token no encontrado' });
            }

            return res.status(200).json(usuario);

        } catch (error: any) {
            console.error("Error en getProfile controller:", error);
            return res.status(error.statusCode || 500).json({ message: error.message || 'Error interno' });
        }
    }
    // --- FIN DEL MÉTODO NUEVO ---


    async logout(req: AuthRequest, res: Response): Promise<Response> {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado (Token no adjunto).' });
        }

        try {
            await authService.logout(userId);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            return res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
        } catch (error) {
            console.error('Error en el logout:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    async refresh(req: Request, res: Response): Promise<Response> {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No se encontró el Refresh Token.' });
        }

        try {
            const result = await authService.refreshAccessToken(refreshToken);

            if (!result) {
                res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
                return res.status(401).json({ message: 'Refresh Token inválido o revocado.' });
            }

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                accessToken: result.accessToken,
                user: result.user,
            });

        } catch (error) {
            console.error('Error al refrescar token:', error);
            res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            return res.status(401).json({ message: 'Refresh Token expirado o inválido.' });
        }
    }
}