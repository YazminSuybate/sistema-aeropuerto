import type { categoria } from '@prisma/client';

export interface Categoria extends categoria { }

export type CategoriaCreateDTO = Omit<Categoria, 'id_categoria'>;

export type CategoriaUpdateDTO = Partial<Omit<Categoria, 'id_categoria'>>;