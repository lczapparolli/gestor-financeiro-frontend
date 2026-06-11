import { contaPagarService } from "@/api/contaPagarService";
import { converterRaw, type ContaPagar } from "@/types/contaPagar";
import { defineStore } from "pinia";

export const useContaPagarStore = defineStore("contaPagar", {
  state: () => ({
    contasPagar: [] as ContaPagar[]
  }),
  actions: {
    async carregarContasPagar(periodo: Date): Promise<void> {
      this.contasPagar = (await contaPagarService.listar(periodo)).map(m => converterRaw(m));
    },

    async adicionarContaPagar(contaPagar: ContaPagar): Promise<void> {
      const novo = await contaPagarService.adicionar(contaPagar);
      this.contasPagar.push(converterRaw(novo));
    },

    async atualizarContaPagar(contaPagar: ContaPagar): Promise<void> {
      const atualizado = await contaPagarService.atualizar(contaPagar);
      const indice = this.contasPagar.findIndex(m => m.id === contaPagar.id);
      if (indice > -1)
        this.contasPagar[indice] = converterRaw(atualizado);
    },

    async desativarContaPagar(contaPagar: ContaPagar): Promise<void> {
      if (!contaPagar.id) return;
      await contaPagarService.desativar(contaPagar.id);

      const novaLista = this.contasPagar.filter(m => m.id !== contaPagar.id);
      this.contasPagar = novaLista;
    },

    async clonarPeriodo(periodoOrigem: Date, periodoDestino: Date): Promise<void> {
      const novos = await contaPagarService.clonar(periodoOrigem, periodoDestino);
      this.contasPagar = this.contasPagar.concat(novos.map(raw => converterRaw(raw)));
    }
  }
})
