<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useContaStore } from "@/stores/contaStore";

const descricao = ref("");
const store = useContaStore();

onMounted(() => {
  store.carregarContas();
})

const cadastrarConta = async () => {
  console.log("Inserindo conta: " + descricao.value);
  if (!descricao.value.trim())
    return;

  await store.adicionarConta(descricao.value);
  descricao.value = "";
}

</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="conta in store.contas" :key="conta.id">
          <td>{{ conta.descricao }}</td>
        </tr>
      </tbody>
    </table>
    <form @submit.prevent="cadastrarConta">
      <label for="descricao">Descrição</label>
      <input name="descricao" id="descricao" v-model="descricao" />
      <input type="submit">Salvar</input>
    </form>
  </div>
</template>
