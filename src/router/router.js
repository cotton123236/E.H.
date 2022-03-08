import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/frontend/Index.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/frontend/Home.vue')
        }
      ]
    }
  ]
})

export default router