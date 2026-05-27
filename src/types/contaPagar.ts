import type { Categoria } from "./categoria";

export interface ContaPagar {
  id?: number;
  descricao: string;
  valor: number;
  vencimento?: Date;
  categoria: Categoria;
  periodo: Date;
}

export interface ContaPagarRaw {
  id: number;
  descricao: string;
  valor: number;
  vencimento?: string;
  categoria: {
    id: number;
    descricao: string;
  };
  periodo: Date;
}
