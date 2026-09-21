<script setup lang="ts">
import { computed } from 'vue'
import { NDatePicker } from 'naive-ui'

const props = defineProps<{modelValue: number | null}>()
const emit = defineEmits<{'update:modelValue': [value: number | null]}>()

const YEAR_MIN = 1000
const YEAR_MAX = new Date().getFullYear()
const FALLBACK_YEAR = 2007

function yearToTimestamp(year: number): number {
  return new Date(year, 0, 1).getTime()
}

function timestampToYear(timestamp: number): number {
  return new Date(timestamp).getFullYear()
}

function isYearDisabled(timestamp: number): boolean {
  const year = timestampToYear(timestamp)
  return year < YEAR_MIN || year > YEAR_MAX
}

const timestamp = computed<number | null>({
  get() {
    return props.modelValue === null ? null : yearToTimestamp(props.modelValue)
  },
  set(value) {
    emit('update:modelValue', value === null ? null : timestampToYear(value))
  },
})

const calendarStart = computed(() => yearToTimestamp(props.modelValue ?? FALLBACK_YEAR))
</script>

<template>
  <n-date-picker
    v-model:value="timestamp"
    :style="{width: '140px'}"
    type="year"
    clearable
    placeholder="Год"
    :default-calendar-start-time="calendarStart"
    :year-range="[YEAR_MIN, YEAR_MAX + 1]"
    :is-date-disabled="isYearDisabled"
  />
</template>

<style scoped></style>
