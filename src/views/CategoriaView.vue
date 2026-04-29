<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCategoriaStore } from "@/stores/categoriaStore";
import type { Categoria } from "@/types/categoria";

const store = useCategoriaStore();

const descricaoNovaCategoria = ref('');
const idEdicao = ref(0);
const descricaoEdicao = ref('');

onMounted(() => {
  store.carregarCategorias();
});

const alternarStatus = async (categoria: Categoria) => {
  try {
    await store.alterarStatus(categoria);
  } catch (error) {
    console.error('Erro ao alterar o status da categoria: ', error);
  }
}

const iniciarEdicao = (categoria: Categoria) => {
  idEdicao.value = categoria.id || 0;
  descricaoEdicao.value = categoria.descricao;
}

const cancelarEdicao = () => {
  idEdicao.value = 0;
  descricaoEdicao.value = '';
}

const salvarEdicao = async (categoria: Categoria) => {
  if (!descricaoEdicao.value.trim()) return;

  try {
    categoria.descricao = descricaoEdicao.value;
    await store.atualizarCategoria(categoria);
    cancelarEdicao();
  } catch (error) {
    console.log('Erro ao salvar a categoria: ', error);
  }
}

const adicionarCategoria = async () => {
  if (!descricaoNovaCategoria.value.trim()) return;

  try {
    await store.adicionarCategoria(descricaoNovaCategoria.value);
    descricaoNovaCategoria.value = '';
  } catch (error) {
    console.log('Erro ao adicionar categoria: ', error);
  }
}

</script>

<template>
  <v-card class="p-4 mx-auto" maxWidth="600">
    <v-card-title class="text-h5 mb-4">Categorias de lançamentos</v-card-title>

    <v-table>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Descrição</th>
          <th class="text-center font-weight-bold" style="width: 120px">Ativo</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="categoria in store.categorias" :key="categoria.id">
          <td>
            <div v-if="idEdicao === categoria.id" class="d-flex align-center">
              <v-text-field v-model="descricaoEdicao" density="compact" hide-details variant="outlined" class="mr-2"
                autofocus @keyup.enter="salvarEdicao(categoria)" @keyup.esc="cancelarEdicao" />
              <v-btn icon="mdi-check" size="x-small" color="sucess" class="mr-1" varian="tonal"
                @click="salvarEdicao(categoria)" />
              <v-btn icon="mdi-close" size="x-small" color="error" variant="tonal" @click="cancelarEdicao" />
            </div>

            <div v-else class="d-flex align-center justify-space-between editable-cell"
              @click="iniciarEdicao(categoria)">
              <span>{{ categoria.descricao }}</span>
              <v-icon size="small" class="edit-icon" color="grey-lighten-1">mdi-pencil</v-icon>
            </div>
          </td>

          <td class="text-center">
            <v-btn :icon="categoria.ativo ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
              :color="categoria.ativo ? 'sucess' : 'grey-darken-1'" variant="text" size="large"
              @click="alternarStatus(categoria)" />
          </td>
        </tr>

        <tr class="bg-grey-lighten-1">
          <td>
            <v-text-field v-model="descricaoNovaCategoria" placeholder="Adicionar nova categoria..." density="compact"
              hideDetails variant="outlined" @keyup.enter="adicionarCategoria" />
          </td>
          <td class="text-center">
            <v-btn color="primary" variant="elevated" size="small" prepend-icon="mdi-plus"
              :disabled="!descricaoNovaCategoria.trim()" @click="adicionarCategoria">
              Salvar
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<style scoped>
.editable-cell {
  cursor: pointer;
  height: 100%;
  min-height: 40px;
}

.edit-icon {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editable-cell:hover .edit-icon {
  opacity: 1;
}
</style>
