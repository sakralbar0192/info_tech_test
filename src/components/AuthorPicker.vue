<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { NSelect } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { listAuthors } from '@/api/authors'
import type { AuthorShort } from '@/api/types'

const props = withDefaults(defineProps<{
  modelValue: AuthorShort[]
  multiple?: boolean
}>(), {
  multiple: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: AuthorShort[]]
}>()

const loading = ref(false)
const suggestions = ref<AuthorShort[]>([])
let debounceTimer: number | undefined

const options = computed<SelectOption[]>(() => {
  const seen = new Set<number>()
  const list: SelectOption[] = []
  for (const author of [...props.modelValue, ...suggestions.value]) {
    if (seen.has(author.id)) {
      continue
    }
    seen.add(author.id)
    list.push({ label: author.full_name, value: author.id })
  }
  return list
})

const selectValue = computed(() => {
  const ids = props.modelValue.map((author) => author.id)
  return props.multiple ? ids : ids[0] ?? null
})

function onUpdateValue(value: string | number | Array<string | number> | null) {
  const byId = new Map(
    [...props.modelValue, ...suggestions.value].map((author) => [author.id, author]),
  )
  emit('update:modelValue', [value ?? []].flat().map(Number).flatMap((id) => {
    const author = byId.get(id)
    return author ? [author] : []
  }))
}

function onSearch(query: string): void {
  window.clearTimeout(debounceTimer)
  const needle = query.trim()
  if (!needle) {
    suggestions.value = []
    loading.value = false
    return
  }
  debounceTimer = window.setTimeout(async () => {
    loading.value = true
    try {
      const data = await listAuthors({
        search: needle,
        'per-page': 10,
      })
      suggestions.value = data.items
    } finally {
      loading.value = false
    }
  }, 250)
}

onUnmounted(() => {
  window.clearTimeout(debounceTimer)
})
</script>

<template>
  <n-select
    :value="selectValue"
    @update:value="onUpdateValue"
    filterable
    remote
    clearable
    :multiple="multiple"
    :options="options"
    :loading="loading"
    placeholder="Автор"
    @search="onSearch"
  />
</template>

<style scoped></style>
