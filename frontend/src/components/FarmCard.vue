<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { mdiBarn } from '@mdi/js'
import type { Farm } from '../api/farms'

defineProps<{ farm: Farm; active?: boolean }>()
const emit = defineEmits<{ open: [] }>()

const { t } = useI18n()
</script>

<template>
  <v-card
    :variant="active ? 'tonal' : 'flat'"
    :color="active ? 'primary' : undefined"
    :border="!active"
    rounded="lg"
    class="h-100 d-flex align-center"
  >
    <!-- Primary action covering the card (M3 actionable card). The active farm is already open. -->
    <v-btn
      v-if="!active"
      class="farm-card__open"
      variant="text"
      rounded="inherit"
      :aria-label="t('farm.openNamed', { name: farm.name })"
      @click="emit('open')"
    />
    <v-card-item
      class="farm-card__item flex-1-1-0"
      :prepend-icon="mdiBarn"
      :title="farm.name"
    />
  </v-card>
</template>

<style scoped>
.farm-card__open {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Long names wrap on two lines at most.
   Clicks on the icon and the name go through to the open button below. */
.farm-card__item {
  min-width: 0;
  pointer-events: none;
}

.farm-card__item :deep(.v-card-title) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
