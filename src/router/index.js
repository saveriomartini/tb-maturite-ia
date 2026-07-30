import { createRouter, createWebHashHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'

// createWebHashHistory : GitHub Pages ne reecrit pas les routes profondes vers
// index.html. En mode history, un rechargement sur /parcours renverrait 404.
export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'accueil', component: AccueilView },
    { path: '/parcours', name: 'parcours', component: () => import('../views/ParcoursView.vue') },
    { path: '/dimension/:id', name: 'dimension', component: () => import('../views/DimensionView.vue') },
    { path: '/ca/:id', name: 'ca', component: () => import('../views/CapabilityAreaView.vue') },
    { path: '/restitution', name: 'restitution', component: () => import('../views/RestitutionView.vue') }
  ],
  scrollBehavior: () => ({ top: 0 })
})
