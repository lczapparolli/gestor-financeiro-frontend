<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ContaPagar } from '@/types/contaPagar';
import { useCategoriaStore } from '@/stores/categoriaStore';
import { useContaPagarStore } from '@/stores/contaPagarStore';

const contaPagarStore = useContaPagarStore();
const categoriaStore = useCategoriaStore();

const periodo = ref(new Date());
const nomeMesAtual = computed(() => periodo.value.toLocaleString('pt-BR', { month: 'long' }));
const anoAtual = computed(() => periodo.value.getFullYear());

const idEdicao = ref<number | null>(null);
const contaPagarNova = ref<ContaPagar>(contaPagarStore.criarContaPagarVazia(periodo.value));
const contaPagarEdicao = ref<ContaPagar>(contaPagarStore.criarContaPagarVazia(periodo.value));
const edicaoData = computed({
  get() {
    if (!contaPagarEdicao.value || !contaPagarEdicao.value.vencimento) {
      return '';
    }

    const ano = contaPagarEdicao.value.vencimento.getFullYear();
    const mes = String(contaPagarEdicao.value.vencimento.getMonth() + 1).padStart(2, '0');
    const dia = String(contaPagarEdicao.value.vencimento.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  },

  set(novaData: string) {
    if (novaData) {
      contaPagarEdicao.value.vencimento = new Date(`${novaData}T00:00:00`);
    } else {
      contaPagarEdicao.value.vencimento = undefined;
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
  contaPagarStore.carregarContasPagar(periodo.value);
}

const iniciarEdicao = (contaPagar: ContaPagar) => {
  idEdicao.value = contaPagar?.id ?? null;
  contaPagarEdicao.value = { ...contaPagar };
}

const salvarEdicao = async () => {
  try {
    if (contaPagarEdicao.value) {
      await contaPagarStore.atualizarContaPagar(contaPagarEdicao.value);
      cancelarEdicao();
    }
  } catch (error) {
    console.error(`Não foi possível atualizar a conta a pagar. Erro: ${error}`);
  }
}

const cancelarEdicao = () => {
  idEdicao.value = null;
  contaPagarEdicao.value = contaPagarStore.criarContaPagarVazia(periodo.value);
}

const salvarInclusao = async () => {
  try {
    await contaPagarStore.adicionarContaPagar(contaPagarNova.value);
    contaPagarNova.value = contaPagarStore.criarContaPagarVazia(periodo.value);
  } catch (error) {
    console.error(`Não foi possível incluir a conta a pagar. Erro: ${error}`);
  }
}

const desativarContaPagar = async (contaPagar: ContaPagar) => {
  try {
    await contaPagarStore.desativarContaPagar(contaPagar);
  } catch (error) {
    console.error(`Não foi possível excluir a conta a pagar. Erro: ${error}`);
  }
}

onMounted(() => {
  contaPagarStore.carregarContasPagar(periodo.value);
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
        <div class="text-overline">Contas a Pagar</div>
        <div class="text-h5 font-weight-bold text-capitalize">{{ nomeMesAtual }}/{{ anoAtual }}</div>
      </v-col>

      <v-col cols="auto">
        <v-btn icon="mdi-chevron-right" variant="text" @click="alterarMes(1)"></v-btn>
      </v-col>
    </v-row>

    <v-table density="comfortable">
      <thead>
        <tr>
          <th class="font-weight-bold">Vencimento</th>
          <th class="font-weight-bold">Categoria</th>
          <th class="font-weight-bold">Descrição</th>
          <th class="font-weight-bold text-right">Valor</th>
          <th class="font-weight-bold text-center">Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="contaPagar in contaPagarStore.contasPagar" :key="contaPagar.id">
          <template v-if="idEdicao === contaPagar.id">
            <td>
              <v-text-field v-model.date="edicaoData" type="date" variant="underlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td>
              <v-autocomplete v-model="contaPagarEdicao.categoria.id" :items="categoriaStore.categorias"
                item-title="descricao" item-value="id" variant="underlined" density="compact"
                hide-details></v-autocomplete>
            </td>
            <td>
              <v-text-field v-model="contaPagarEdicao.descricao" variant="underlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td>
              <v-text-field v-model.number="contaPagarEdicao.valor" type="number" variant="underlined" density="compact"
                hide-details></v-text-field>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-check" size="x-small" color="sucess" class="mr-1" @click="salvarEdicao"></v-btn>
              <v-btn icon="mdi-close" size="x-small" color="grey" @click="cancelarEdicao"></v-btn>
            </td>
          </template>

          <template v-else>
            <td>{{ contaPagar.vencimento ? formatoData.format(contaPagar.vencimento) : '' }}</td>
            <td>{{ contaPagar.categoria.descricao }}</td>
            <td>{{ contaPagar.descricao }}</td>
            <td class="text-right">{{ formatoNumero.format(contaPagar.valor) }}</td>
            <td class="text-center">
              <v-btn icon="mdi-pencil" size="x-small" variant="text" color="blue"
                @click="iniciarEdicao(contaPagar)"></v-btn>
              <v-btn icon="mdi-trash-can" size="x-small" variant="text" color="error"
                @click="desativarContaPagar(contaPagar)"></v-btn>
            </td>
          </template>
        </tr>
        <tr class="bg-blue-grey-lighten-5">
          <td>
            <v-text-field v-model.date="contaPagarNova.vencimento" type="date" variant="underlined" density="compact"
              hide-details></v-text-field>
          </td>
          <td>
            <v-autocomplete v-model="contaPagarNova.categoria.id" :items="categoriaStore.categorias"
              item-title="descricao" item-value="id" variant="underlined" density="compact"
              hide-details></v-autocomplete>
          </td>
          <td>
            <v-text-field v-model="contaPagarNova.descricao" variant="underlined" density="compact"
              hide-details></v-text-field>
          </td>
          <td>
            <v-text-field v-model.number="contaPagarNova.valor" type="number" placeholder="0,00" variant="underlined"
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
