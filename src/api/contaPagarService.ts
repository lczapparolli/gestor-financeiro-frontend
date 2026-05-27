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
    console.log('Salvando conta a pagar:');
    console.log(contaPagar);
    const resposta = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contaPagar)
    });
    return await resposta.json();
  },

  async atualizar(contaPagar: ContaPagar): Promise<ContaPagarRaw> {
    console.log('Atualizando conta a pagar:');
    console.log(contaPagar);
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
};
