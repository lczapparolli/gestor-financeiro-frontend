import { defineStore } from "pinia";
import { contaService } from "@/api/contaService";
import type { Conta } from "@/types/conta";

export const useContaStore = defineStore("conta", {
  state: () => ({
    contas: [] as Conta[]
  }),
  actions: {
    async carregarContas(): Promise<void> {
      this.contas = await contaService.listar();
    },

    async adicionarConta(descricao: string) {
      const conta = await contaService.adicionar({ descricao });
      this.contas.push(conta);
    },

    async alterarStatus(conta: Conta) {
      if (!conta.id) return;

      if (conta.ativo) {
        await contaService.desativar(conta.id);
      } else {
        await contaService.reativar(conta.id);
      }

      const indice = this.contas.findIndex(c => c.id === conta.id);
      if (indice > -1 && this.contas[indice])
        this.contas[indice].ativo = !conta.ativo;
    },

    async atualizarConta(conta: Conta) {
      const atualizada = await contaService.atualizar(conta);
      const indice = this.contas.findIndex(c => c.id === conta.id);
      if (indice > -1)
        this.contas[indice] = atualizada;
    }
  }
})
