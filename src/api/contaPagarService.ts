import type { ContaPagar, ContaPagarRaw } from "@/types/contaPagar";

const API_URL = '/api/conta-pagar';

export const contaPagarService = {
  async listar(periodo: Date): Promise<ContaPagarRaw[]> {
    const parametros = new URLSearchParams({
      ano: `${periodo.getFullYear()}`,
      mes: `${periodo.getMonth() + 1}`
    });

    const resposta = await fetch(`${API_URL}?${parametros.toString()}`, {
      method: "GET"
    });

    return await resposta.json();
  },

  async adicionar(contaPagar: ContaPagar): Promise<ContaPagarRaw> {
    const resposta = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contaPagar)
    });
    return await resposta.json();
  },

  async atualizar(contaPagar: ContaPagar): Promise<ContaPagarRaw> {
    const resposta = await fetch(`${API_URL}/${contaPagar.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contaPagar })
    });

    return await resposta.json();
  },

  async desativar(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
  },

  async clonar(origem: Date, destino: Date): Promise<ContaPagarRaw[]> {
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
