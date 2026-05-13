import type { Categoria } from "@/types/categoria";
import type { Conta } from "@/types/conta";

export interface Movimento {
  id?: number;
  categoria: Categoria;
  conta: Conta;
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
  descricao: string;
  data: string;
  periodo: string;
  valor: number;
}
