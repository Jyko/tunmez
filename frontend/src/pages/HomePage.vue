<script setup lang="ts">
import FarmEmptyState from '../components/FarmEmptyState.vue'
import { useFarms } from '../composables/useFarms'

const emit = defineEmits<{ select: [id: string]; create: [] }>()

const farms = useFarms()
</script>

<template>
  <FarmEmptyState
    v-if="!farms.active.value"
    @select="emit('select', $event)"
    @create="emit('create')"
  />
</template>
