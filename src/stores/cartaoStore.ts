import { defineStore } from "pinia";
import { cartaoService } from "@/api/cartaoService";
import type { CartaoCredito } from "@/types/cartaoCredito";

export const useCartaoStore = defineStore("cartao", {
  state: () => ({
    cartoes: [] as CartaoCredito[]
  }),
  actions: {
    async carregarCartoes(): Promise<void> {
      this.cartoes = await cartaoService.listar();
    },

    async adicionarCartao(cartao: CartaoCredito) {
      const cartaoNovo = await cartaoService.adicionar(cartao);
      this.cartoes.push(cartaoNovo);
    },

    async desativarCartao(cartao: CartaoCredito) {
      if (!cartao.id) return;
      await cartaoService.desativar(cartao.id);

      const novaLista = this.cartoes.filter(c => c.id !== cartao.id);
      this.cartoes = novaLista;
    },

    async atualizarCartao(cartao: CartaoCredito) {
      const atualizado = await cartaoService.atualizar(cartao);
      const indice = this.cartoes.findIndex(c => c.id === cartao.id);
      if (indice > -1)
        this.cartoes[indice] = atualizado;
    },

    criarCartaoVazio(): CartaoCredito {
      return {
        descricao: '',
        diaFechamento: 0,
        diaVencimento: 0
      };
    }
  }
})
