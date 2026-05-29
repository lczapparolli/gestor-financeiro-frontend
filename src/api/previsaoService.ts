import type { Previsao } from "@/types/previsao";

const API_URL = "/api/previsao"

export const previsaoService = {
  async adicionar(previsao: Previsao): Promise<Previsao> {
    const resposta = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(previsao)
    });
    return await resposta.json();
  },

  async listar(periodo: Date): Promise<Previsao[]> {
    const parametros = new URLSearchParams({
      ano: `${periodo.getFullYear()}`,
      mes: `${periodo.getMonth() + 1}`
    });

    const resposta = await fetch(`${API_URL}?${parametros.toString()}`, {
      method: "GET"
    });

    return await resposta.json();
  },

  async atualizar(previsao: Previsao): Promise<Previsao> {
    const resposta = await fetch(`${API_URL}/${previsao.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: previsao.valor })
    });

    return await resposta.json();
  },

  async desativar(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
  },

  async clonar(origem: Date, destino: Date): Promise<Previsao[]> {
    const resposta = await fetch(`${API_URL}/clonar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "origem": `${origem.getFullYear()}-${(origem.getMonth() + 1).toString().padStart(2, "0")}-${origem.getDate().toString().padStart(2, "0")}`,
        "destino": `${destino.getFullYear()}-${(destino.getMonth() + 1).toString().padStart(2, "0")}-${destino.getDate().toString().padStart(2, "0")}`
      })
    });

    return await resposta.json();
  }
};
