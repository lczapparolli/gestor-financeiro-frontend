<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCategoriaStore } from "@/stores/categoriaStore";
import { criarVazia, type Categoria } from "@/types/categoria";

const store = useCategoriaStore();

const categoriaNova = ref(criarVazia());
const idEdicao = ref(0);
const categoriaEdicao = ref(criarVazia());

onMounted(() => {
  store.carregarCategorias();
});

const desativarCategoria = async (categoria: Categoria) => {
  try {
    await store.desativarCategoria(categoria);
  } catch (error) {
    console.error('Erro ao alterar o status da categoria: ', error);
  }
}

const iniciarEdicao = (categoria: Categoria) => {
  idEdicao.value = categoria.id || 0;
  categoriaEdicao.value = { ...categoria };
}

const cancelarEdicao = () => {
  idEdicao.value = 0;
  categoriaEdicao.value = criarVazia();
}

const salvarEdicao = async () => {
  if (!categoriaEdicao.value.descricao.trim()) return;

  try {
    await store.atualizarCategoria(categoriaEdicao.value);
    cancelarEdicao();
  } catch (error) {
    console.log('Erro ao salvar a categoria: ', error);
  }
}

const adicionarCategoria = async () => {
  if (!categoriaNova.value.descricao.trim()) return;

  try {
    await store.adicionarCategoria(categoriaNova.value);
    categoriaNova.value = criarVazia();
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
          <th class="text-center font-weight-bold">Cumulativo</th>
          <th class="text-center font-weight-bold" style="width: 120px"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="categoria in store.categorias" :key="categoria.id">
          <template v-if="idEdicao === categoria.id">
            <td>
              <v-text-field v-model="categoriaEdicao.descricao" density="compact" hide-details variant="outlined"
                class="mr-2" autofocus @keyup.enter="salvarEdicao" @keyup.esc="cancelarEdicao" />
            </td>
            <td class="text-center">
              <v-checkbox v-model="categoriaEdicao.cumulativo" density="compact" hide-details variant="outlined" />
            </td>
            <td>
              <v-btn icon="mdi-check" size="x-small" color="sucess" class="mr-1" varian="tonal" @click="salvarEdicao" />
              <v-btn icon="mdi-close" size="x-small" color="error" variant="tonal" @click="cancelarEdicao" />
            </td>
          </template>
          <template v-else>
            <td>
              <span>{{ categoria.descricao }}</span>
            </td>
            <td class="text-center">
              <span><v-icon
                  :icon="categoria.cumulativo ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline'" /></span>
              <v-icon size="small" class="edit-icon" color="grey-lighten-1">mdi-pencil</v-icon>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-pencil" color="default" variant="text" size="x-small"
                @click="iniciarEdicao(categoria)" />
              <v-btn icon="mdi-trash-can" color="error" variant="text" size="x-small"
                @click="desativarCategoria(categoria)" />
            </td>
          </template>
        </tr>

        <tr class="bg-grey-lighten-1">
          <td>
            <v-text-field v-model="categoriaNova.descricao" placeholder="Adicionar nova categoria..." density="compact"
              hideDetails variant="outlined" @keyup.enter="adicionarCategoria" />
          </td>
          <td class="text-center">
            <v-checkbox v-model="categoriaNova.cumulativo" density="compact" hide-details variant="outlined" />
          </td>
          <td class="text-center">
            <v-btn color="primary" variant="elevated" size="small" prepend-icon="mdi-plus"
              :disabled="!categoriaNova.descricao.trim()" @click="adicionarCategoria">
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
