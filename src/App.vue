<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-responsive class="rounded border">
    <v-app>
      <v-app-bar title="Gestor Financeiro"></v-app-bar>

      <v-navigation-drawer>
        <v-list nav>
          <v-list-item title="Contas" to="/contas" link></v-list-item>
          <v-list-item title="Categorias" to="/categorias" link></v-list-item>
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
