import type { Categoria } from "@/types/categoria";
import type { Conta } from "@/types/conta";
import { converterRaw as converterContaPagarRaw, criarVazio as criarContaPagarVazio, type ContaPagar, type ContaPagarRaw } from "./contaPagar";

export interface Movimento {
  id?: number;
  categoria: Categoria;
  conta: Conta;
  contaPagar: ContaPagar;
  descricao: string;
  periodo: Date;
  valor: number;
  data: Date;
}

export interface MovimentoRaw {
  id: number;
  categoria: {
    id: number;
    descricao: string;
  };
  conta: {
    id: number;
    descricao: string;
  };
  contaPagar?: ContaPagarRaw;
  descricao: string;
  data: string;
  periodo: string;
  valor: number;
}

export const converterRaw = (raw: MovimentoRaw): Movimento => {
  const periodo = new Date(`${raw.periodo}T00:00:00`);
  return {
    id: raw.id,
    categoria: {
      id: raw.categoria.id,
      descricao: raw.categoria.descricao
    },
    conta: {
      id: raw.conta.id,
      descricao: raw.conta.descricao
    },
    contaPagar: !raw.contaPagar ? criarContaPagarVazio(periodo) : converterContaPagarRaw(raw.contaPagar),
    descricao: raw.descricao,
    data: new Date(`${raw.data}T00:00:00`),
    periodo: periodo,
    valor: raw.valor
  }
}

export const criarVazio = (periodo: Date): Movimento => {
  return {
    descricao: '',
    conta: { descricao: '' },
    categoria: { descricao: '' },
    contaPagar: criarContaPagarVazio(periodo),
    valor: 0,
    data: new Date(),
    periodo: periodo
  };
}

