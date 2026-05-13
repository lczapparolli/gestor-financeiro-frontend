<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Movimento } from '@/types/movimento';
import { useContaStore } from '@/stores/contaStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import { useMovimentoStore } from '@/stores/movimentoStore';

const movimentoStore = useMovimentoStore();
const contaStore = useContaStore();
const categoriaStore = useCategoriaStore();

const periodo = ref(new Date());
const nomeMesAtual = computed(() => periodo.value.toLocaleString('pt-BR', { month: 'long' }));
const anoAtual = computed(() => periodo.value.getFullYear());

const idEdicao = ref<number | null>(null);
const movimentoNovo = ref<Movimento>(movimentoStore.criarMovimentoVazio(periodo.value));
const movimentoEdicao = ref<Movimento>(movimentoStore.criarMovimentoVazio(periodo.value));
const edicaoData = computed({
  get() {
    if (!movimentoEdicao.value || !movimentoEdicao.value.data) {
      return '';
    }

    const ano = movimentoEdicao.value.data.getFullYear();
    const mes = String(movimentoEdicao.value.data.getMonth() + 1).padStart(2, '0');
    const dia = String(movimentoEdicao.value.data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  },

  set(novaData: string) {
    if (novaData) {
      movimentoEdicao.value.data = new Date(`${novaData}T00:00:00`);
    }
  }
})

const formatoNumero = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
  minimumFractionDigits: 2
});

const formatoData = new Intl.DateTimeFormat('pt-BR', { timeZone: 'GMT' });

const alterarMes = (delta: number) => {
  const novaData = new Date(periodo.value);
  novaData.setMonth(novaData.getMonth() + delta);
  periodo.value = novaData;
  movimentoStore.carregarMovimentos(periodo.value);
}

const iniciarEdicao = (movimento: Movimento) => {
  idEdicao.value = movimento?.id ?? null;
  movimentoEdicao.value = { ...movimento };
}

const salvarEdicao = async () => {
  try {
    if (movimentoEdicao.value) {
      await movimentoStore.atualizarMovimento(movimentoEdicao.value);
      cancelarEdicao();
    }
  } catch (error) {
    console.error(`Não foi possível atualizar o movimento. Erro: ${error}`);
  }
}

const cancelarEdicao = () => {
  idEdicao.value = null;
  movimentoEdicao.value = movimentoStore.criarMovimentoVazio(periodo.value);
}

const salvarInclusao = async () => {
  try {
    await movimentoStore.adicionarMovimento(movimentoNovo.value);
    movimentoNovo.value = movimentoStore.criarMovimentoVazio(periodo.value);
  } catch (error) {
    console.error(`Não foi possível incluir o movimento. Erro: ${error}`);
  }
}

const desativarMovimento = async (movimento: Movimento) => {
  try {
    await movimentoStore.desativarMovimento(movimento);
  } catch (error) {
    console.error(`Não foi possível excluir o movimento. Erro: ${error}`);
  }
}

onMounted(() => {
  movimentoStore.carregarMovimentos(periodo.value);
  contaStore.carregarContas();
  categoriaStore.carregarCategorias();
});

</script>

<template>
  <v-card class="pa-4 mx-auto">
    <v-row align="center" justify="center" class="mb-6">
      <v-col cols="auto">
        <v-btn icon="mdi-chevron-left" variant="text" @click="alterarMes(-1)"></v-btn>
      </v-col>

      <v-col cols="auto" class="text-center">
        <div class="text-overline">Mês</div>
        <div class="text-h5 font-weight-bold text-capitalize">{{ nomeMesAtual }}/{{ anoAtual }}</div>
      </v-col>

      <v-col cols="auto">
        <v-btn icon="mdi-chevron-right" variant="text" @click="alterarMes(1)"></v-btn>
      </v-col>
    </v-row>

    <v-table density="comfortable">
      <thead>
        <tr>
          <th class="font-weight-bold">Data</th>
          <th class="font-weight-bold">Conta</th>
          <th class="font-weight-bold">Categoria</th>
          <th class="font-weight-bold">Descrição</th>
          <th class="font-weight-bold text-right">Valor</th>
          <th class="font-weight-bold text-center">Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="movimento in movimentoStore.movimentos" :key="movimento.id">
          <template v-if="idEdicao === movimento.id">
            <td>
              <v-text-field v-model.date="edicaoData" type="date" variant="underlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td>
              <v-autocomplete v-model="movimentoEdicao.conta.id" :items="contaStore.contas" item-title="descricao"
                item-value="id" variant="underlined" density="compact" hide-details></v-autocomplete>
            </td>
            <td>
              <v-autocomplete v-model="movimentoEdicao.categoria.id" :items="categoriaStore.categorias"
                item-title="descricao" item-value="id" variant="underlined" density="compact"
                hide-details></v-autocomplete>
            </td>
            <td>
              <v-text-field v-model="movimentoEdicao.descricao" variant="underlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td>
              <v-text-field v-model.number="movimentoEdicao.valor" type="number" variant="underlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-check" size="x-small" color="sucess" class="mr-1" @click="salvarEdicao"></v-btn>
              <v-btn icon="mdi-close" size="x-small" color="grey" @click="cancelarEdicao"></v-btn>
            </td>
          </template>

          <template v-else>
            <td>{{ formatoData.format(movimento.data) }}</td>
            <td>{{ movimento.conta.descricao }}</td>
            <td>{{ movimento.categoria.descricao }}</td>
            <td>{{ movimento.descricao }}</td>
            <td class="text-right">{{ formatoNumero.format(movimento.valor) }}</td>
            <td class="text-center">
              <v-btn icon="mdi-pencil" size="x-small" variant="text" color="blue"
                @click="iniciarEdicao(movimento)"></v-btn>
              <v-btn icon="mdi-trash-can" size="x-small" variant="text" color="error"
                @click="desativarMovimento(movimento)"></v-btn>
            </td>
          </template>
        </tr>
        <tr class="bg-blue-grey-lighten-5">
          <td>
            <v-text-field v-model.date="movimentoNovo.data" type="date" variant="underlined" density="compact"
              hide-details></v-text-field>
          </td>
          <td>
            <v-autocomplete v-model="movimentoNovo.conta.id" :items="contaStore.contas" item-title="descricao"
              item-value="id" variant="underlined" density="compact" hide-details></v-autocomplete>
          </td>
          <td>
            <v-autocomplete v-model="movimentoNovo.categoria.id" :items="categoriaStore.categorias"
              item-title="descricao" item-value="id" variant="underlined" density="compact"
              hide-details></v-autocomplete>
          </td>
          <td>
            <v-text-field v-model="movimentoNovo.descricao" variant="underlined" density="compact"
              hide-details></v-text-field>
          </td>
          <td>
            <v-text-field v-model.number="movimentoNovo.valor" type="number" placeholder="0,00" variant="underlined"
              density="compact" hide-details></v-text-field>
          </td>
          <td class="text-center">
            <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="salvarInclusao">Adicionar</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<style lang="css" scoped>
:deep('.v-field__input') {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  min-height: 32px !important;
}
</style>
