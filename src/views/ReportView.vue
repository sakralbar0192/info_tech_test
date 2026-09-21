<script setup lang="ts">
import { NDataTable, NEmpty, NResult, NSpin } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import YearPicker from '@/components/YearPicker.vue'
import type { TopAuthor } from '@/api/types'
import { useTopAuthors } from './useTopAuthors'

const { items, loading, error, year, setYear } = useTopAuthors()

const columns: DataTableColumns<TopAuthor> = [
  { title: 'Место', key: 'rank' },
  { title: 'Автор', key: 'full_name' },
  { title: 'Книг', key: 'books_count' },
]
</script>

<template>
  <div class="toolbar">
    <YearPicker
      class="toolbar__year"
      :model-value="year ?? null"
      clearable
      placeholder="Год"
      @update:model-value="setYear"
    />
  </div>
  <n-spin :show="loading">
    <n-result
      v-if="error"
      status="error"
      title="Не удалось загрузить отчёт"
      :description="error"
    />
    <n-empty
      v-else-if="year === undefined"
      description="Укажите год"
    />
    <n-empty
      v-else-if="!loading && items.length === 0"
      description="Авторов нет"
    />
    <n-data-table
      v-else
      class="table"
      :columns="columns"
      :data="items"
      :pagination="false"
    />
  </n-spin>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 0;
}

.toolbar__year {
  width: 140px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.table {
  padding: 16px;
}
</style>
