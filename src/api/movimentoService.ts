import type { Movimento, MovimentoRaw } from "@/types/movimento";

const API_URL = '/api/movimento';

export const movimentoService = {
  async listar(periodo: Date): Promise<MovimentoRaw[]> {
    const parametros = new URLSearchParams({
      ano: `${periodo.getFullYear()}`,
      mes: `${periodo.getMonth() + 1}`
    });

    const resposta = await fetch(`${API_URL}?${parametros.toString()}`, {
      method: "GET"
    });

    return await resposta.json();
  },

  async adicionar(movimento: Movimento): Promise<MovimentoRaw> {
    const resposta = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movimento)
    });
    return await resposta.json();
  },

  async atualizar(movimento: Movimento): Promise<MovimentoRaw> {
    const resposta = await fetch(`${API_URL}/${movimento.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...movimento })
    });

    return await resposta.json();
  },

  async desativar(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
  },

};
