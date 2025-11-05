import * as bcrypt from 'bcryptjs';
import type { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO, UsuarioResponseDTO } from '../models/usuario.model.js';
import type { RolRepository } from '../repositories/rol.repository.js';

const SALT_ROUNDS = 10;
const AGENTE_OPERATIVO = 'Agente Operativo';

export class UsuarioService {
    private repository: UsuarioRepository;
    private rolRepository: RolRepository;
    private operativoRoleId: number | null = null;

    constructor(repository: UsuarioRepository, rolRepository: RolRepository) {
        this.repository = repository;
        this.rolRepository = rolRepository;
    }

    async initialize() {
        const operativoRole = await this.rolRepository.findByName(AGENTE_OPERATIVO);
        this.operativoRoleId = operativoRole ? operativoRole.id_rol : null;
    }

    async getAllUsuarios(): Promise<Usuario[]> {
        return this.repository.findAll();
    }

    async getUsuarioById(id_usuario: number): Promise<Usuario | null> {
        return this.repository.findById(id_usuario);
    }

    async createUsuario(data: UsuarioCreateDTO): Promise<UsuarioResponseDTO> {
        const ID_ROL_OPERATIVO = this.operativoRoleId;

        if (data.id_rol === ID_ROL_OPERATIVO && !data.id_area) {
            throw new Error('Los usuarios con rol operativo deben tener un área asignada.');
        }

        const id_areaSource: number | null | undefined = (data.id_rol === ID_ROL_OPERATIVO) ? data.id_area : null;

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const userData: UsuarioCreateDTO = {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            id_rol: data.id_rol,
            password: hashedPassword,
            ...(id_areaSource !== undefined && { id_area: id_areaSource })
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

            const ID_ROL_OPERATIVO = this.operativoRoleId;

            const rolFinal = data.id_rol ?? currentUser.id_rol;
            let areaFinal = data.id_area;

            if (rolFinal === ID_ROL_OPERATIVO) {
                if (areaFinal === undefined || areaFinal === null) {
                    areaFinal = currentUser.id_area;
                }

                if (areaFinal === undefined || areaFinal === null) {
                    throw new Error('El rol operativo requiere que se asigne un área.');
                }

            } else {
                areaFinal = null;
            }

            data.id_area = areaFinal;
        }

        return this.repository.update(id_usuario, data);
    }

    async deleteUsuario(id_usuario: number): Promise<Usuario> {
        return this.repository.softDelete(id_usuario);
    }
}