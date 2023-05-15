import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import BillView from '../views/BillView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/bill/:billId',
    name: 'Bill',
    component: BillView,
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
});

export default router;
