import { contaPagarService } from "@/api/contaPagarService";
import type { ContaPagar, ContaPagarRaw } from "@/types/contaPagar";
import { defineStore } from "pinia";

export const useContaPagarStore = defineStore("contaPagar", {
  state: () => ({
    contasPagar: [] as ContaPagar[]
  }),
  actions: {
    async carregarContasPagar(periodo: Date): Promise<void> {
      this.contasPagar = (await contaPagarService.listar(periodo)).map(m => this.converterRaw(m));
    },

    async adicionarContaPagar(contaPagar: ContaPagar): Promise<void> {
      const novo = await contaPagarService.adicionar(contaPagar);
      this.contasPagar.push(this.converterRaw(novo));
    },

    async atualizarContaPagar(contaPagar: ContaPagar): Promise<void> {
      const atualizado = await contaPagarService.atualizar(contaPagar);
      const indice = this.contasPagar.findIndex(m => m.id === contaPagar.id);
      if (indice > -1)
        this.contasPagar[indice] = this.converterRaw(atualizado);
    },

    async desativarContaPagar(contaPagar: ContaPagar): Promise<void> {
      if (!contaPagar.id) return;
      await contaPagarService.desativar(contaPagar.id);

      const novaLista = this.contasPagar.filter(m => m.id !== contaPagar.id);
      this.contasPagar = novaLista;
    },

    async clonarPeriodo(periodoOrigem: Date, periodoDestino: Date): Promise<void> {
      const novos = await contaPagarService.clonar(periodoOrigem, periodoDestino);
      this.contasPagar = this.contasPagar.concat(novos.map(raw => this.converterRaw(raw)));
    },

    converterRaw(raw: ContaPagarRaw): ContaPagar {
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
    },

    criarContaPagarVazia(periodo: Date): ContaPagar {
      return {
        descricao: '',
        categoria: { descricao: '' },
        valor: 0,
        vencimento: undefined,
        periodo: periodo
      };
    }
  }
})
