import type { permiso, rol_permiso } from '@prisma/client';

export interface Permiso extends permiso {
  roles_permisos?: rol_permiso[];
}

export interface RolPermiso extends rol_permiso {}