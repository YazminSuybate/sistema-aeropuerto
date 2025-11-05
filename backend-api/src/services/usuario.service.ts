import * as bcrypt from 'bcryptjs';
import type { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO, UsuarioResponseDTO } from '../models/usuario.model.js';
import type { Rol } from '../models/rol.model.js';
import type { RolRepository } from '../repositories/rol.repository.js';

const SALT_ROUNDS = 10;
const AGENTE_OPERATIVO = 'Agente Operativo';

export class UsuarioService {
    private repository: UsuarioRepository;
    private rolRepository: RolRepository;

    constructor(repository: UsuarioRepository, rolRepository: RolRepository) {
        this.repository = repository;
        this.rolRepository = rolRepository;
    }

    private async getOperativoRole(): Promise<Rol | null> {
        return this.rolRepository.findByName(AGENTE_OPERATIVO);
    }

    async getAllUsuarios(): Promise<Usuario[]> {
        return this.repository.findAll();
    }

    async getUsuarioById(id_usuario: number): Promise<Usuario | null> {
        return this.repository.findById(id_usuario);
    }

    async createUsuario(data: UsuarioCreateDTO): Promise<UsuarioResponseDTO> {
        const operativoRole = await this.getOperativoRole();
        const ID_ROL_OPERATIVO = operativoRole ? operativoRole.id_rol : null;

        if (data.id_rol === ID_ROL_OPERATIVO && !data.id_area) {
            throw new Error('Los usuarios con rol operativo deben tener un área asignada.');
        }

        const areaParaDB = (data.id_rol === ID_ROL_OPERATIVO) ? data.id_area : null;

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const userData: UsuarioCreateDTO = {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            id_rol: data.id_rol,
            password: hashedPassword,
            id_area: areaParaDB
        };

        const newUsuario = await this.repository.create(userData);

        const { password, refresh_token, ...usuarioSeguro } = newUsuario;

        return usuarioSeguro as UsuarioResponseDTO;
    }

    async updateUsuario(id_usuario: number, data: UsuarioUpdateDTO): Promise<Usuario> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        }

        if (data.id_rol !== undefined || data.id_area !== undefined) {
            const currentUser = await this.repository.findById(id_usuario);
            if (!currentUser) {
                throw new Error('Usuario no encontrado para actualizar.');
            }

            const nuevoRolId = data.id_rol ?? currentUser.id_rol;
            const nuevaAreaId = data.id_area ?? currentUser.id_area;

            const operativoRole = await this.getOperativoRole();
            const ID_ROL_OPERATIVO = operativoRole ? operativoRole.id_rol : null;

            if (nuevoRolId === ID_ROL_OPERATIVO && !nuevaAreaId) {
                throw new Error('El rol operativo requiere que se asigne un área.');
            }
        }

        return this.repository.update(id_usuario, data);
    }
    async deleteUsuario(id_usuario: number): Promise<Usuario> {
        return this.repository.softDelete(id_usuario);
    }
}