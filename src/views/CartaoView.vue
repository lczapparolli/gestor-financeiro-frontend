<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCartaoStore } from "@/stores/cartaoStore";
import type { CartaoCredito } from "@/types/cartaoCredito";

const store = useCartaoStore();

const cartaoNovo = ref(store.criarCartaoVazio());
const cartaoEdicao = ref(store.criarCartaoVazio());

onMounted(() => {
  store.carregarCartoes();
});

const desativarCartao = async (cartao: CartaoCredito) => {
  try {
    await store.desativarCartao(cartao);
  } catch (error) {
    console.error('Erro ao alterar o status do cartão: ', error);
  }
}

const iniciarEdicao = (cartao: CartaoCredito) => {
  cartaoEdicao.value = cartao;
}

const cancelarEdicao = () => {
  cartaoEdicao.value = store.criarCartaoVazio();
}

const salvarEdicao = async () => {
  if (!cartaoEdicao.value.descricao.trim()) return;

  try {
    await store.atualizarCartao(cartaoEdicao.value);
    cancelarEdicao();
  } catch (error) {
    console.log('Erro ao salvar o cartão: ', error);
  }
}

const adicionarCartao = async () => {
  if (!cartaoNovo.value.descricao.trim()) return;

  try {
    await store.adicionarCartao(cartaoNovo.value);
    cartaoNovo.value = store.criarCartaoVazio();
  } catch (error) {
    console.log('Erro ao adicionar cartão: ', error);
  }
}

</script>

<template>
  <v-card class="p-4 mx-auto" maxWidth="600">
    <v-card-title class="text-h5 mb-4">Cartões de crédito</v-card-title>

    <v-table>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Descrição</th>
          <th class="text-right font-weight-bold">Dia Vencimento</th>
          <th class="text-right font-weight-bold">Dia Fechamento</th>
          <th class="text-center font-weight-bold" style="width: 120px">Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cartao in store.cartoes" :key="cartao.id">
          <template v-if="cartaoEdicao.id === cartao.id">
            <td>
              <v-text-field v-model="cartaoEdicao.descricao" density="compact" hide-details variant="outlined"
                class="mr-2" autofocus />
            </td>
            <td>
              <v-text-field v-model.number="cartaoEdicao.diaVencimento" density="compact" hide-details
                variant="outlined" class="mr-2" />
            </td>
            <td>
              <v-text-field v-model.number="cartaoEdicao.diaFechamento" density="compact" hide-details
                variant="outlined" class="mr-2" />
            </td>
            <td>
              <v-btn icon="mdi-check" size="x-small" color="sucess" class="mr-1" variant="tonal"
                @click="salvarEdicao()" />
              <v-btn icon="mdi-close" size="x-small" color="error" class="mr-1" variant="tonal"
                @click="cancelarEdicao" />
            </td>
          </template>
          <template v-else>
            <td>{{ cartao.descricao }}</td>
            <td>{{ cartao.diaVencimento }}</td>
            <td>{{ cartao.diaFechamento }}</td>
            <td>
              <v-btn icon="mdi-pencil" size="x-small" color="blue" class="mr-1" variant="tonal"
                @click="iniciarEdicao(cartao)" />
              <v-btn icon="mdi-trash-can" size="x-small" color="error" class="mr-1" variant="tonal"
                @click="desativarCartao(cartao)" />
            </td>
          </template>
        </tr>

        <tr class="bg-grey-lighten-1">
          <td>
            <v-text-field v-model="cartaoNovo.descricao" density="compact" hide-details variant="outlined" class="mr-2"
              autofocus />
          </td>
          <td>
            <v-text-field v-model.number="cartaoNovo.diaVencimento" density="compact" hide-details variant="outlined"
              class="mr-2" />
          </td>
          <td>
            <v-text-field v-model.number="cartaoNovo.diaFechamento" density="compact" hide-details variant="outlined"
              class="mr-2" />
          </td>
          <td class="text-center">
            <v-btn color="primary" variant="tonal" size="small" prepend-icon="mdi-plus"
              :disabled="!cartaoNovo.descricao.trim()" @click="adicionarCartao">
              Salvar
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<style scoped></style>
