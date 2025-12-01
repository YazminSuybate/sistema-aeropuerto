import { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { usuario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { env } from 'prisma/config';
import { RolRepository } from '../repositories/rol.repository.js';

const JWT_SECRET = env("JWT_SECRET");
if (!JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET no está definido.");
}

const REFRESH_SECRET = env("REFRESH_SECRET");
if (!REFRESH_SECRET) {
    throw new Error("FATAL ERROR: REFRESH_SECRET no está definido.");
}

type UserResponse = Omit<usuario, 'password'> & { // Ya no excluimos refresh_token porque no está en el modelo
    rol?: any;
    area?: any;
};

export class AuthService {
    private userRepository: UsuarioRepository;
    private rolRepository: RolRepository;

    constructor() {
        this.rolRepository = new RolRepository();
        this.userRepository = new UsuarioRepository();
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: UserResponse } | null> {
        const user = await this.userRepository.findByEmailWithRole(email);

        if (!user || !user.activo) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return null;
        }

        const permisos = await this.rolRepository.getPermissionsByRoleId(user.id_rol);

        const payload = {
            id: user.id_usuario,
            email: user.email,
            id_rol: user.id_rol,
            id_area: user.id_area,
            permisos: permisos
        };
        const accessToken = sign(payload, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

        // MULTI-SESIÓN: Creamos un nuevo registro en lugar de reemplazar
        await this.userRepository.createRefreshToken(user.id_usuario, refreshToken);

        const { password: userPassword, ...userData } = user;

        return {
            accessToken,
            refreshToken,
            user: userData,
        };
    }

    async logout(token: string): Promise<void> {
        // MULTI-SESIÓN: Borramos solo el token específico
        if (token) {
            await this.userRepository.deleteRefreshToken(token);
        }
    }

    async getProfileById(userId: number): Promise<UserResponse> {
        const user = await this.userRepository.findByIdWithRoleAndArea(userId);

        if (!user) {
            throw { statusCode: 404, message: 'Usuario no encontrado' };
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

async refreshAccessToken(currentRefreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: UserResponse } | null> {
        try {
            const decoded = verify(currentRefreshToken, REFRESH_SECRET) as { id: number };
            const userIdFromToken = decoded.id;

            const user = await this.userRepository.findUserByRefreshToken(currentRefreshToken);

            if (!user) {
                console.warn(`[ALERTA DE SEGURIDAD] Intento de re-uso de token detectado para el usuario ID ${userIdFromToken}.`);
                await this.userRepository.deleteAllTokensForUser(userIdFromToken);
                return null;
            }

            if (user.id_usuario !== userIdFromToken || !user.activo) {
                return null;
            }

            await this.userRepository.deleteRefreshToken(currentRefreshToken);
            const permisos = await this.rolRepository.getPermissionsByRoleId(user.id_rol);

            const payload = {
                id: user.id_usuario,
                email: user.email,
                id_rol: user.id_rol,
                id_area: user.id_area,
                permisos: permisos
            };

            const newAccessToken = sign(payload, JWT_SECRET, { expiresIn: '15m' });
            const newRefreshToken = sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

            await this.userRepository.createRefreshToken(user.id_usuario, newRefreshToken);

            const { password, ...userData } = user;

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: userData,
            };

        } catch (error) {
            console.error('Error al refrescar token:', error);
            return null;
        }
    }
}