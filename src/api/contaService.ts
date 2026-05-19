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

  async listar(incluirCartoes: boolean): Promise<Conta[]> {
    const resposta = await fetch(`${API_URL}/conta?incluirCartoes=${incluirCartoes ? 'true' : 'false'}`, {
      method: "GET"
    });

    return await resposta.json();
  },

  async atualizar(conta: Conta): Promise<Conta> {
    const resposta = await fetch(`${API_URL}/conta/${conta.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conta)
    });

    return await resposta.json();
  },

  async desativar(idConta: number): Promise<void> {
    await fetch(`${API_URL}/conta/${idConta}`, {
      method: "DELETE"
    });
  }

};
