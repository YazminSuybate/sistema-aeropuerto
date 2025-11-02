import type { usuario } from '@prisma/client';
export interface Usuario extends usuario {
}
export type UsuarioCreateDTO = Pick<Usuario, 'nombre' | 'apellido' | 'email' | 'password' | 'id_rol' | 'id_area'>;
export type UsuarioUpdateDTO = Partial<Omit<Usuario, 'id_usuario' | 'fecha_registro'>>;
//# sourceMappingURL=usuario.model.d.ts.map