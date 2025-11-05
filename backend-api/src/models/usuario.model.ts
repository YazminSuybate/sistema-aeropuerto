import type { usuario } from '@prisma/client';

export interface Usuario extends usuario { }

export type UsuarioCreateDTO = Pick<
  Usuario,
  'nombre' | 'apellido' | 'email' | 'password' | 'id_rol'
> & {
  id_area?: number | null | undefined;
};

export type UsuarioUpdateDTO = Partial<Omit<Usuario, 'id_usuario' | 'fecha_registro'>>;

export type UsuarioResponseDTO = Omit<Usuario, 'password' | 'refresh_token'>;