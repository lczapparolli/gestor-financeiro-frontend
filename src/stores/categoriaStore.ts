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

    async adicionarCategoria(categoria: Categoria) {
      const inserida = await categoriaService.adicionar(categoria);
      this.categorias.push(inserida);
    },

    async desativarCategoria(categoria: Categoria) {
      if (!categoria.id) return;

      await categoriaService.desativar(categoria.id);

      const novaLista = this.categorias.filter(c => c.id !== categoria.id);
      this.categorias = novaLista;
    },

    async atualizarCategoria(categoria: Categoria) {
      const atualizada = await categoriaService.atualizar(categoria);
      const indice = this.categorias.findIndex(c => c.id === categoria.id);
      if (indice > -1)
        this.categorias[indice] = atualizada;
    }
  }
})
