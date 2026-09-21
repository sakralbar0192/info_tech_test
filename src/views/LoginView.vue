<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { apiMessage } from '@/lib/apiMessage'
import { useSession } from '@/composables/useSession'

const route = useRoute()
const router = useRouter()
const { signIn } = useSession()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

function redirectPath(): string {
  const raw = route.query.redirect
  return typeof raw === 'string' && raw.startsWith('/') ? raw : '/'
}

async function onSubmit(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await signIn({ username: username.value, password: password.value })
    await router.push(redirectPath())
  } catch (cause) {
    error.value = apiMessage(cause, 'Не удалось войти')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <n-form
    class="form"
    @submit.prevent="onSubmit"
  >
    <n-form-item label="Логин">
      <n-input
        v-model:value="username"
        autocomplete="username"
      />
    </n-form-item>
    <n-form-item label="Пароль">
      <n-input
        v-model:value="password"
        type="password"
        autocomplete="current-password"
      />
    </n-form-item>
    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
    <n-button
      type="primary"
      attr-type="submit"
      :loading="loading"
    >
      Войти
    </n-button>
  </n-form>
</template>

<style scoped>
.form {
  max-width: 320px;
  padding: 16px;
}

.error {
  margin: 0 0 12px;
  color: #d03050;
}
</style>
