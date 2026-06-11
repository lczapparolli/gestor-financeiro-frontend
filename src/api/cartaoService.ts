import type { CartaoCredito } from "@/types/cartaoCredito";

const API_URL = "/api/cartao-credito"

export const cartaoService = {
  async adicionar(cartao: CartaoCredito): Promise<CartaoCredito> {
    const resposta = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartao)
    });
    return await resposta.json();
  },

  async listar(): Promise<CartaoCredito[]> {
    const resposta = await fetch(`${API_URL}`, {
      method: "GET"
    });

    return await resposta.json();
  },

  async atualizar(cartao: CartaoCredito): Promise<CartaoCredito> {
    const resposta = await fetch(`${API_URL}/${cartao.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartao)
    });

    return await resposta.json();
  },

  async desativar(idCartao: number): Promise<void> {
    await fetch(`${API_URL}/${idCartao}`, {
      method: "DELETE"
    });
  }

};
