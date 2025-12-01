import * as bcrypt from 'bcryptjs';
import type { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO, UsuarioResponseDTO } from '../models/usuario.model.js';
import type { RolRepository } from '../repositories/rol.repository.js';
import { NotFoundError, BadRequestError } from '../errors/custom.error.js';

const SALT_ROUNDS = 10;
const OPERATIVE_ROLE_NAMES = ['Agente Operativo Junior', 'Agente Operativo Senior', 'Agente Operativo'];

export class UsuarioService {
    private repository: UsuarioRepository;
    private rolRepository: RolRepository;
    private operativeRoleIds: Set<number> = new Set();

    constructor(repository: UsuarioRepository, rolRepository: RolRepository) {
        this.repository = repository;
        this.rolRepository = rolRepository;
    }

    async initialize() {
        for (const name of OPERATIVE_ROLE_NAMES) {
            const role = await this.rolRepository.findByName(name);
            if (role) {
                this.operativeRoleIds.add(role.id_rol);
            }
        }
    }

    async getAllUsuarios(): Promise<Usuario[]> {
        return this.repository.findAll();
    }

    async getUsuarioById(id_usuario: number): Promise<Usuario | null> {
        return this.repository.findById(id_usuario);
    }

    async createUsuario(data: UsuarioCreateDTO): Promise<UsuarioResponseDTO> {
        const isOperativeRole = this.operativeRoleIds.has(data.id_rol);

        if (isOperativeRole && (data.id_area === undefined || data.id_area === null)) {
            throw new BadRequestError('Los usuarios con rol operativo deben tener un área asignada.');
        }

        const id_areaSource: number | null = isOperativeRole ? (data.id_area ?? null) : null;

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const userData: UsuarioCreateDTO = {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            id_rol: data.id_rol,
            password: hashedPassword,
            id_area: id_areaSource
        };

        const newUsuario = await this.repository.create(userData);

        const { password, ...usuarioSeguro } = newUsuario;

        return usuarioSeguro as UsuarioResponseDTO;
    }

    async updateUsuario(id_usuario: number, data: UsuarioUpdateDTO): Promise<Usuario> {
        
        if (data.password) {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        }

        if (data.id_rol !== undefined || data.id_area !== undefined) {

            const currentUser = await this.repository.findById(id_usuario);
            if (!currentUser) {
                throw new NotFoundError('Usuario');
            }

            const rolFinal = data.id_rol ?? currentUser.id_rol;
            let areaFinal = data.id_area;

            const isOperativeRoleFinal = this.operativeRoleIds.has(rolFinal);

            if (isOperativeRoleFinal) {
                if (areaFinal === undefined) {
                    areaFinal = currentUser.id_area;
                }

                if (areaFinal === null) {
                    throw new BadRequestError('El rol operativo requiere que se asigne un área.');
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