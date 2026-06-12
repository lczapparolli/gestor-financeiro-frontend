import type { Categoria } from "@/types/categoria";

const API_URL = "/api/categoria"

export const categoriaService = {
  async adicionar(categoria: Categoria): Promise<Categoria> {
    const resposta = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria)
    });
    return await resposta.json();
  },

  async listar(): Promise<Categoria[]> {
    const resposta = await fetch(`${API_URL}`, {
      method: "GET"
    });

    return await resposta.json();
  },

  async atualizar(categoria: Categoria): Promise<Categoria> {
    const resposta = await fetch(`${API_URL}/${categoria.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria)
    });

    return await resposta.json();
  },

  async desativar(idCategoria: number): Promise<void> {
    await fetch(`${API_URL}/${idCategoria}`, {
      method: "DELETE"
    });
  }

};
