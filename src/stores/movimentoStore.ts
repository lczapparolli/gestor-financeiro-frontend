import { defineStore } from "pinia";
import type { Movimento, MovimentoRaw } from "@/types/movimento";
import { movimentoService } from "@/api/movimentoService";

export const useMovimentoStore = defineStore("movimento", {
  state: () => ({
    movimentos: [] as Movimento[]
  }),
  actions: {
    async carregarMovimentos(periodo: Date): Promise<void> {
      this.movimentos = (await movimentoService.listar(periodo)).map(m => this.converterRaw(m));
    },

    async adicionarMovimento(movimento: Movimento): Promise<void> {
      const novo = await movimentoService.adicionar(movimento);
      this.movimentos.push(this.converterRaw(novo));
    },

    async atualizarMovimento(movimento: Movimento): Promise<void> {
      const atualizado = await movimentoService.atualizar(movimento);
      const indice = this.movimentos.findIndex(m => m.id === movimento.id);
      if (indice > -1)
        this.movimentos[indice] = this.converterRaw(atualizado);
    },

    async desativarMovimento(movimento: Movimento): Promise<void> {
      if (!movimento.id) return;
      await movimentoService.desativar(movimento.id);

      const novaLista = this.movimentos.filter(m => m.id !== movimento.id);
      this.movimentos = novaLista;
    },

    converterRaw(raw: MovimentoRaw): Movimento {
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
        descricao: raw.descricao,
        data: new Date(`${raw.data}T00:00:00`),
        periodo: new Date(`${raw.periodo}T00:00:00`),
        valor: raw.valor
      }
    },

    criarMovimentoVazio(periodo: Date): Movimento {
      return {
        descricao: '',
        conta: { descricao: '' },
        categoria: { descricao: '' },
        valor: 0,
        data: new Date(),
        periodo: periodo
      };
    }
  }
})
