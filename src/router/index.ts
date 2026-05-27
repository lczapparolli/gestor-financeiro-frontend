import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contas',
      name: 'contas',
      component: () => import('../views/ContaView.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriaView.vue'),
    },
    {
      path: '/previsoes',
      name: 'previsoes',
      component: () => import('../views/PrevisaoView.vue'),
    },
    {
      path: '/movimentos',
      name: 'movimentos',
      component: () => import('../views/MovimentoView.vue'),
    },
    {
      path: '/cartoes',
      name: 'cartoes',
      component: () => import('../views/CartaoView.vue'),
    },
    {
      path: '/contasPagar',
      name: 'contasPagar',
      component: () => import('../views/ContaPagarView.vue'),
    },
  ],
})

export default router
