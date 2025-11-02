import type { Usuario, UsuarioCreateDTO, UsuarioUpdateDTO } from '../models/usuario.model.js';
export declare class UsuarioRepository {
    findAll(): Promise<Usuario[]>;
    findById(id_usuario: number): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    create(data: UsuarioCreateDTO): Promise<Usuario>;
    update(id_usuario: number, data: UsuarioUpdateDTO): Promise<Usuario>;
    softDelete(id_usuario: number): Promise<Usuario>;
}
//# sourceMappingURL=usuario.repository.d.ts.map