<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePrevisaoStore } from '@/stores/previsaoStore';

const store = usePrevisaoStore();

const dataReferencia = ref(new Date());
const nomeMesAtual = computed(() => dataReferencia.value.toLocaleString('pt-BR', { month: 'long' }));
const anoAtual = computed(() => dataReferencia.value.getFullYear());

const idCategoriaEdicao = ref(null);
const valorEdicao = ref(0);

const totalGeral = computed(() => store.previsoes.reduce((acc, current) => acc + (current.valor || 0), 0));

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
  minimumFractionDigits: 2
});

const totalCor = computed(() => {
  if (totalGeral.value > 0) return 'sucess';
  if (totalGeral.value < 0) return 'error';
  return 'grey';
});

const alterarMes = (delta) => {
  const novaData = new Date(dataReferencia.value);
  novaData.setMonth(novaData.getMonth() + delta);
  dataReferencia.value = novaData;
  buscarPrevisoesDoMes();
}

const buscarPrevisoesDoMes = async () => {
  try {
    cancelarEdicao();
    await store.carregarPrevisoes(dataReferencia.value);
  } catch (exception) {
    console.error(`Erro ao buscar previsões: ${exception}`);
  }
}

const salvarPrevisao = async () => {
  try {
    console.log(`Salvando previsao: ${idCategoriaEdicao.value} - ${valorEdicao.value}`);
    if (idCategoriaEdicao.value) {
      await store.salvarPrevisao(idCategoriaEdicao.value, dataReferencia.value, valorEdicao.value);
      cancelarEdicao();
    }
  } catch (exception) {
    console.error(`Erro ao salvar a previsão: ${exception}`);
  }
}

const iniciarEdicao = (idCategoria, valorAtual) => {
  idCategoriaEdicao.value = idCategoria;
  valorEdicao.value = valorAtual;
}

const cancelarEdicao = () => {
  idCategoriaEdicao.value = null;
  valorEdicao.value = 0;
}

onMounted(() => {
  buscarPrevisoesDoMes();
})

</script>

<template>
  <v-card class="pa-4 mx-auto" max-width="800">
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

    <v-table>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Categoria</th>
          <th class="text-right font-weight-bold" style="width: 200px">Valor previsto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="previsao in store.previsoes" :key="previsao.categoria.id">
          <td>{{ previsao.categoria.descricao }}</td>
          <td>
            <div v-if="idCategoriaEdicao === previsao.categoria.id" class="d-flex align-center justify-end">
              <v-text-field v-model.number="valorEdicao" type="number" density="compact" hide-details variant="outlined"
                autofocus @keyup.enter="salvarPrevisao" @keyup.esc="cancelarEdicao"></v-text-field>
              <v-btn icon="mdi-check" size="x-small" color="sucess" variant="tonal" class="ml-2"
                @click="salvarPrevisao"></v-btn>
              <v-btn icon="mdi-close" size="x-small" color="error" variant="tonal" class="ml-2"
                @click="cancelarEdicao"></v-btn>
            </div>

            <div v-else class="editable-value d-flex align-center justify-end"
              @click="iniciarEdicao(previsao.categoria.id, previsao.valor)">
              <span>{{ formatter.format(previsao.valor) }}</span>
              <v-icon size="x-small" class="edit-icon ml-2" color="grey">mdi-pencil</v-icon>
            </div>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="bg-gray-lighten-4 font-weight-black">
          <td class="text-right">Total Previsto:</td>
          <td class="text-right" :class="totalCor">{{ formatter.format(totalGeral) }}</td>
        </tr>
      </tfoot>
    </v-table>
  </v-card>
</template>

<style lang="css" scoped>
.valor-input-edit {
  max-width: 130px;
}

.editable-value {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

editable-value:hover {
  background-color: #f5f5f5;
}

.edit-icon {
  opacity: 0;
}

.editable-value:hover .edit-icon {
  opacity: 1;
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(input[type=number]) {
  -moz-appearance: textfield;
  appearance: textfield;
  text-align: right;
}
</style>
