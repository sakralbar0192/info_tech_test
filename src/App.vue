<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useSession } from '@/composables/useSession'

const route = useRoute()
const router = useRouter()
const { username, signOut } = useSession()

function onSignOut(): void {
  signOut()
  if (!route.meta.auth) {
    return
  }
  void router.replace({
    name: 'login',
    query: { redirect: route.fullPath },
  })
}
</script>

<template>
  <header class="header">
    <nav class="header__nav">
      <router-link :to="{ name: 'books' }">
        Каталог книг
      </router-link>
      <router-link :to="{ name: 'authors' }">
        Авторы
      </router-link>
      <router-link :to="{ name: 'report' }">
        Отчёт
      </router-link>
    </nav>
    <div class="header__auth">
        <template v-if="username">
          <router-link :to="{ name: 'book-create' }">
            Добавить книгу
          </router-link>
          <router-link :to="{ name: 'author-create' }">
          Добавить автора
        </router-link>
          <span>{{ username }}</span>
          <n-button
            quaternary
            size="small"
            @click="onSignOut"
          >
            Выйти
          </n-button>
        </template>
        <router-link
          v-else
          :to="{ name: 'login' }"
        >
          Войти
        </router-link>
      </div>
  </header>
  <router-view />
</template>

<style scoped lang="scss">
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;

    &__nav,
    &__auth {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    a {
      color: inherit;
      text-decoration: none;
    }
  }
</style>
