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

type UserResponse = Omit<usuario, | 'password' | 'refresh_token'> & {
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

        await this.userRepository.updateRefreshToken(user.id_usuario, refreshToken);

        const { password: userPassword, refresh_token, ...userData } = user;

        return {
            accessToken,
            refreshToken,
            user: userData,
        };
    }

    async logout(userId: number): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, null);
    }

    async getProfileById(userId: number): Promise<UserResponse> {
        const user = await this.userRepository.findByIdWithRoleAndArea(userId);

        if (!user) {
            throw { statusCode: 404, message: 'Usuario no encontrado' };
        }

        const { password, refresh_token, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async refreshAccessToken(currentRefreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: UserResponse } | null> {
        try {
            const decoded = verify(currentRefreshToken, REFRESH_SECRET) as { id: number, email: string, id_rol: number, id_area: number };
            const userId = decoded.id;

            const user = await this.getProfileById(userId);

            if (!user || user.id_usuario !== userId || !user.activo) {
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

            const newAccessToken = sign(payload, JWT_SECRET, { expiresIn: '15m' });

            const newRefreshToken = sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

            await this.userRepository.updateRefreshToken(user.id_usuario, newRefreshToken);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: user,
            };

        } catch (error) {
            console.error('Refresh token validation error:', error);
            return null;
        }
    }
}