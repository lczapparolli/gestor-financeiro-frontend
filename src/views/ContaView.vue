<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useContaStore } from "@/stores/contaStore";
import type { Conta } from "@/types/conta";

const store = useContaStore();

const descricaoNovaConta = ref('');
const idEdicao = ref(0);
const descricaoEdicao = ref('');

onMounted(() => {
  store.carregarContas();
});

const desativarConta = async (conta: Conta) => {
  try {
    await store.desativarConta(conta);
  } catch (error) {
    console.error('Erro ao alterar o status da conta: ', error);
  }
}

const iniciarEdicao = (conta: Conta) => {
  idEdicao.value = conta.id || 0;
  descricaoEdicao.value = conta.descricao;
}

const cancelarEdicao = () => {
  idEdicao.value = 0;
  descricaoEdicao.value = '';
}

const salvarEdicao = async (conta: Conta) => {
  if (!descricaoEdicao.value.trim()) return;

  try {
    conta.descricao = descricaoEdicao.value;
    await store.atualizarConta(conta);
    cancelarEdicao();
  } catch (error) {
    console.log('Erro ao salvar a conta: ', error);
  }
}

const adicionarConta = async () => {
  if (!descricaoNovaConta.value.trim()) return;

  try {
    await store.adicionarConta(descricaoNovaConta.value);
    descricaoNovaConta.value = '';
  } catch (error) {
    console.log('Erro ao adicionar conta: ', error);
  }
}

</script>

<template>
  <v-card class="p-4 mx-auto" maxWidth="600">
    <v-card-title class="text-h5 mb-4">Contas</v-card-title>

    <v-table>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Descrição</th>
          <th class="text-center font-weight-bold" style="width: 120px"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="conta in store.contas" :key="conta.id">
          <td>
            <div v-if="idEdicao === conta.id" class="d-flex align-center">
              <v-text-field v-model="descricaoEdicao" density="compact" hide-details variant="outlined" class="mr-2"
                autofocus @keyup.enter="salvarEdicao(conta)" @keyup.esc="cancelarEdicao" />
              <v-btn icon="mdi-check" size="x-small" color="sucess" class="mr-1" varian="tonal"
                @click="salvarEdicao(conta)" />
              <v-btn icon="mdi-close" size="x-small" color="error" variant="tonal" @click="cancelarEdicao" />
            </div>

            <div v-else class="d-flex align-center justify-space-between editable-cell" @click="iniciarEdicao(conta)">
              <span>{{ conta.descricao }}</span>
              <v-icon size="small" class="edit-icon" color="grey-lighten-1">mdi-pencil</v-icon>
            </div>
          </td>

          <td class="text-center">
            <v-btn icon="mdi-trash-can" color="error" variant="text" size="large" @click="desativarConta(conta)" />
          </td>
        </tr>

        <tr class="bg-grey-lighten-1">
          <td>
            <v-text-field v-model="descricaoNovaConta" placeholder="Adicionar nova conta..." density="compact"
              hideDetails variant="outlined" @keyup.enter="adicionarConta" />
          </td>
          <td class="text-center">
            <v-btn color="primary" variant="elevated" size="small" prepend-icon="mdi-plus"
              :disabled="!descricaoNovaConta.trim()" @click="adicionarConta">
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
