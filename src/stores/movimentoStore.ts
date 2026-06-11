import { defineStore } from "pinia";
import { converterRaw, type Movimento } from "@/types/movimento";
import { movimentoService } from "@/api/movimentoService";

export const useMovimentoStore = defineStore("movimento", {
  state: () => ({
    movimentos: [] as Movimento[]
  }),
  actions: {
    async carregarMovimentos(periodo: Date): Promise<void> {
      this.movimentos = (await movimentoService.listar(periodo)).map(m => converterRaw(m));
    },

    async adicionarMovimento(movimento: Movimento): Promise<void> {
      const novo = await movimentoService.adicionar(movimento);
      this.movimentos.push(converterRaw(novo));
    },

    async atualizarMovimento(movimento: Movimento): Promise<void> {
      const atualizado = await movimentoService.atualizar(movimento);
      const indice = this.movimentos.findIndex(m => m.id === movimento.id);
      if (indice > -1)
        this.movimentos[indice] = converterRaw(atualizado);
    },

    async desativarMovimento(movimento: Movimento): Promise<void> {
      if (!movimento.id) return;
      await movimentoService.desativar(movimento.id);

      const novaLista = this.movimentos.filter(m => m.id !== movimento.id);
      this.movimentos = novaLista;
    }
  }
})
