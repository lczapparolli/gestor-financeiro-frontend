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
      await contaService.adicionar({ descricao });
      await this.carregarContas();
    }
  }
})
