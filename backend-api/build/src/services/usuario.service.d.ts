import type { UsuarioRepository } from '../repositories/usuario.repository.js';
import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO } from '../models/usuario.model.js';
export declare class UsuarioService {
    private repository;
    constructor(repository: UsuarioRepository);
    getAllUsuarios(): Promise<Usuario[]>;
    getUsuarioById(id_usuario: number): Promise<Usuario | null>;
    createUsuario(data: UsuarioCreateDTO): Promise<Usuario>;
    updateUsuario(id_usuario: number, data: UsuarioUpdateDTO): Promise<Usuario>;
    deleteUsuario(id_usuario: number): Promise<Usuario>;
}
//# sourceMappingURL=usuario.service.d.ts.map