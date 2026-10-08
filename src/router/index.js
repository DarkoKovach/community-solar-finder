import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '../views/projects/ProjectList.vue'
import ProjectDetail from '../views/projects/ProjectDetail.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: ProjectList
    },
    {
        path: '/:slug',
        name: 'project-detail',
        component: ProjectDetail,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router