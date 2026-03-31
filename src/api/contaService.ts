import type { Conta } from "@/types/conta";

const API_URL = "/api"

export const contaService = {
  async adicionar(conta: Conta): Promise<Conta> {
    const resposta = await fetch(`${API_URL}/conta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conta)
    });
    return await resposta.json();
  },

  async listar(): Promise<Conta[]> {
    const resposta = await fetch(`${API_URL}/conta?ativas=true`, {
      method: "GET"
    });

    return await resposta.json();
  }
};
