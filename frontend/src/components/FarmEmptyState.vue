<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiBarn, mdiPlus } from '@mdi/js'
import { useFarms } from '../composables/useFarms'

const emit = defineEmits<{ select: [id: string]; create: [] }>()

const { t } = useI18n()
const { farms } = useFarms()

const hasFarms = computed(() => farms.value.length > 0)
const copy = computed(() => (hasFarms.value ? 'farm.choose' : 'farm.empty'))
</script>

<template>
  <v-empty-state :icon="mdiBarn">
    <template #title>
      <h1 class="text-h5">
        {{ t(`${copy}.title`) }}
      </h1>
    </template>
    <template #text>
      {{ t(`${copy}.text`) }}
    </template>
    <v-list
      v-if="hasFarms"
      class="mx-auto my-4 text-start"
      width="100%"
      max-width="400"
      border
      rounded
      :aria-label="t('farm.list')"
    >
      <v-list-item
        v-for="farm in farms"
        :key="farm.id"
        :title="farm.name"
        :prepend-icon="mdiBarn"
        @click="emit('select', farm.id)"
      />
    </v-list>
    <template #actions>
      <v-btn
        color="primary"
        size="large"
        :variant="hasFarms ? 'tonal' : 'flat'"
        :prepend-icon="mdiPlus"
        :text="t('farm.create')"
        @click="emit('create')"
      />
    </template>
  </v-empty-state>
</template>
