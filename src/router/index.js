import Vue from 'vue'
import VueRouter from 'vue-router'
import clientes from '../views/clientes.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'clientes',
    component: clientes
  },
  {
    path: '/mapa',
    name: 'mapa',
    component: () => import('../views/mapa.vue')
  },
  {
    path: '/agregar',
    name: 'agregar',
    component: () => import('../views/agregar.vue')
  },
  {
    path: '/transportistas',
    name: 'transportistas',
    component: () => import('../views/transportistas.vue')
  },
  {
    path: '/editar/:cod',
    name: 'editar',
    component: () => import('../views/editar.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
