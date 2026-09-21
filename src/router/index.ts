import { createRouter, createWebHistory } from 'vue-router'
import AuthorCreateView from '@/views/AuthorCreateView.vue'
import AuthorEditView from '@/views/AuthorEditView.vue'
import AuthorListView from '@/views/AuthorListView.vue'
import AuthorView from '@/views/AuthorView.vue'
import BookCreateView from '@/views/BookCreateView.vue'
import BookEditView from '@/views/BookEditView.vue'
import BookListView from '@/views/BookListView.vue'
import BookView from '@/views/BookView.vue'
import LoginView from '@/views/LoginView.vue'
import ReportView from '@/views/ReportView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useSession } from '@/composables/useSession'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/books'
    },
    // Роуты книг
    {
      path: '/books',
      name: 'books',
      component: BookListView,
    },
    {
      path: '/books/:id',
      name: 'book',
      component: BookView,
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookEditView,
      meta: { auth: true },
    },
    {
      path: '/books/new',
      name: 'book-create',
      component: BookCreateView,
      meta: { auth: true },
    },
    // Роуты авторов
    {
      path: '/authors',
      name: 'authors',
      component: AuthorListView,
    },
    {
      path: '/authors/:id',
      name: 'author',
      component: AuthorView,
    },
    {
      path: '/authors/:id/edit',
      name: 'author-edit',
      component: AuthorEditView,
      meta: { auth: true },
    },
    {
      path: '/authors/new',
      name: 'author-create',
      component: AuthorCreateView,
      meta: { auth: true },
    },
    // Отчет
    {
      path: '/report',
      name: 'report',
      component: ReportView,
    },
    // Авторизация
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // 404 страница
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

const { username } = useSession()

router.beforeEach((to) => {
  if (to.meta.auth && !username.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }
})

export default router
