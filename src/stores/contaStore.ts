import { defineStore } from "pinia";
import { contaService } from "@/api/contaService";
import type { Conta } from "@/types/conta";

export const useContaStore = defineStore("conta", {
  state: () => ({
    contas: [] as Conta[],
    contasComCartoes: [] as Conta[]
  }),
  actions: {
    async carregarContas(): Promise<void> {
      this.contas = await contaService.listar(false);
    },

    async carregarContasComCartoes(): Promise<void> {
      this.contasComCartoes = await contaService.listar(true);
    },

    async adicionarConta(descricao: string) {
      const conta = await contaService.adicionar({ descricao });
      this.contas.push(conta);
    },

    async desativarConta(conta: Conta) {
      if (!conta.id) return;
      await contaService.desativar(conta.id);

      const novaLista = this.contas.filter(c => c.id !== conta.id);
      this.contas = novaLista;
    },

    async atualizarConta(conta: Conta) {
      const atualizada = await contaService.atualizar(conta);
      const indice = this.contas.findIndex(c => c.id === conta.id);
      if (indice > -1)
        this.contas[indice] = atualizada;
    }
  }
})
