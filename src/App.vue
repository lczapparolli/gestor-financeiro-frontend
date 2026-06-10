<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, watch } from 'vue';

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});
</script>

<template>
  <v-responsive class="rounded border">
    <v-app>
      <v-app-bar>
        <v-app-bar-title>Gestor Financeiro</v-app-bar-title>
        <template v-slot:prepend>
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
        <v-list nav>
          <v-list-item title="Contas" to="/contas" link></v-list-item>
          <v-list-item title="Cartões" to="/cartoes" link></v-list-item>
          <v-list-item title="Categorias" to="/categorias" link></v-list-item>
          <v-list-item title="Previsões" to="/previsoes" link></v-list-item>
          <v-list-item title="Movimentos" to="/movimentos" link></v-list-item>
          <v-list-item title="Contas a Pagar" to="/contasPagar" link></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
