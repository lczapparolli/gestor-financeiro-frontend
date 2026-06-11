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

export const converterRaw = (raw: ContaPagarRaw): ContaPagar => {
  return {
    id: raw.id,
    categoria: {
      id: raw.categoria.id,
      descricao: raw.categoria.descricao
    },
    descricao: raw.descricao,
    vencimento: raw.vencimento ? new Date(`${raw.vencimento}T00:00:00`) : undefined,
    periodo: new Date(`${raw.periodo}T00:00:00`),
    valor: raw.valor
  }
}

export const criarVazio = (periodo: Date): ContaPagar => {
  return {
    descricao: '',
    categoria: { descricao: '' },
    valor: 0,
    vencimento: undefined,
    periodo: periodo
  };
}

