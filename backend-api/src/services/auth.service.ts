import { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { usuario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { env } from 'prisma/config';
const JWT_SECRET = env("JWT_SECRET")
const REFRESH_SECRET = env("REFRESH_SECRET")

type UserResponse = Omit<usuario, 'password' | 'refresh_token'>;

export class AuthService {
    private userRepository: UsuarioRepository;

    constructor() {
        this.userRepository = new UsuarioRepository();
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: UserResponse } | null> {
        const user = await this.userRepository.findByEmail(email);

        if (!user || !user.activo) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return null;
        }

        const payload = { id: user.id_usuario, email: user.email, id_rol: user.id_rol, id_area: user.id_area };
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

    async refreshAccessToken(currentRefreshToken: string): Promise<{ accessToken: string; user: UserResponse } | null> {
        try {
            const decoded = verify(currentRefreshToken, REFRESH_SECRET) as { id: number, email: string, id_rol: number, id_area: number };
            const userId = decoded.id;

            const user = await this.userRepository.findByRefreshToken(currentRefreshToken);

            if (!user || user.id_usuario !== userId || !user.activo) {
                return null;
            }

            const payload = { id: user.id_usuario, email: user.email, id_rol: user.id_rol, id_area: user.id_area };
            const newAccessToken = sign(payload, JWT_SECRET, { expiresIn: '15m' });

            const { password: userPassword, refresh_token, ...userData } = user;

            return {
                accessToken: newAccessToken,
                user: userData,
            };

        } catch (error) {
            console.error('Refresh token validation error:', error);
            return null;
        }
    }
}