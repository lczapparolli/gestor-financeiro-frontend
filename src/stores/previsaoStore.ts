import { defineStore } from "pinia";
import { previsaoService } from "@/api/previsaoService";
import type { Previsao } from "@/types/previsao";

export const usePrevisaoStore = defineStore("previsao", {
  state: () => ({
    previsoes: [] as Previsao[]
  }),
  actions: {
    async carregarPrevisoes(periodo: Date): Promise<void> {
      this.previsoes = await previsaoService.listar(periodo);
    },

    async salvarPrevisao(idCategoria: number, valor: number) {
      const indice = this.previsoes.findIndex(p => p.categoria.id === idCategoria);
      if (indice < 0 && !this.previsoes[indice])
        return;

      const previsao = this.previsoes[indice];
      if (!previsao)
        return;

      previsao.valor = valor;

      if (previsao.id) {
        await previsaoService.atualizar(previsao);
      } else {
        const atualizada = await previsaoService.adicionar(previsao);
        this.previsoes[indice] = atualizada;
      }
    },

    async clonarPeriodo(periodoOrigem: Date, periodoDestino: Date): Promise<void> {
      await previsaoService.clonar(periodoOrigem, periodoDestino);
      await this.carregarPrevisoes(periodoDestino);
    }

  }
})
