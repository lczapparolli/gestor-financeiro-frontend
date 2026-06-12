export interface Categoria {
  id?: number;
  descricao: string;
  cumulativo: boolean;
}

export const criarVazia = (): Categoria => {
  return {
    descricao: '',
    cumulativo: false
  };
}
