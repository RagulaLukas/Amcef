import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/todo/:id/:name',
      name: 'todo-detail',
      component: () => import('../views/ToDoView.vue')
    }
  ]
})

export default router
