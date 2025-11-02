import * as bcrypt from 'bcryptjs';
import type { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO } from '../models/usuario.model.js';

const SALT_ROUNDS = 10;

export class UsuarioService {
    private repository: UsuarioRepository;

    constructor(repository: UsuarioRepository) {
        this.repository = repository;
    }

    async getAllUsuarios(): Promise<Usuario[]> {
        return this.repository.findAll();
    }

    async getUsuarioById(id_usuario: number): Promise<Usuario | null> {
        return this.repository.findById(id_usuario);
    }

    async createUsuario(data: UsuarioCreateDTO): Promise<Usuario> {
        const existingUser = await this.repository.findByEmail(data.email);

        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const userData = {
            ...data,
            password: hashedPassword
        };

        return this.repository.create(userData);
    }

    async updateUsuario(id_usuario: number, data: UsuarioUpdateDTO): Promise<Usuario> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        }

        return this.repository.update(id_usuario, data);
    }

    async deleteUsuario(id_usuario: number): Promise<Usuario> {
        return this.repository.softDelete(id_usuario);
    }
}