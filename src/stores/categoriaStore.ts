import { defineStore } from "pinia";
import { categoriaService } from "@/api/categoriaService";
import type { Categoria } from "@/types/categoria";

export const useCategoriaStore = defineStore("categoria", {
  state: () => ({
    categorias: [] as Categoria[]
  }),
  actions: {
    async carregarCategorias(): Promise<void> {
      this.categorias = await categoriaService.listar();
    },

    async adicionarCategoria(descricao: string) {
      const categoria = await categoriaService.adicionar({ descricao });
      this.categorias.push(categoria);
    },

    async alterarStatus(categoria: Categoria) {
      if (!categoria.id) return;

      if (categoria.ativo) {
        await categoriaService.desativar(categoria.id);
      } else {
        await categoriaService.reativar(categoria.id);
      }

      const indice = this.categorias.findIndex(c => c.id === categoria.id);
      if (indice > -1 && this.categorias[indice])
        this.categorias[indice].ativo = !categoria.ativo;
    },

    async atualizarCategoria(categoria: Categoria) {
      const atualizada = await categoriaService.atualizar(categoria);
      const indice = this.categorias.findIndex(c => c.id === categoria.id);
      if (indice > -1)
        this.categorias[indice] = atualizada;
    }
  }
})
