import type { Categoria } from "@/types/categoria";

export interface Previsao {
  id?: number;
  categoria: Categoria;
  periodo: Date;
  valor: number;
}
