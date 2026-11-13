<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiHomeOutline, mdiTuneVariant } from '@mdi/js'
import { useFarms } from '../composables/useFarms'
import { useNavigation, type Page } from '../composables/useNavigation'

defineProps<{ id: string }>()

// Expanded shows icons with labels; collapsed shows icons only.
const expanded = defineModel<boolean>('expanded', { required: true })

const { t } = useI18n()
const navigation = useNavigation()
const farms = useFarms()

const destinations = computed<{ page: Page; title: string; icon: string }[]>(() => [
  { page: 'home', title: t('nav.home'), icon: mdiHomeOutline },
  // Settings of the open farm, so only shown while a farm is open.
  ...(farms.active.value ? [{ page: 'farmSettings' as const, title: t('nav.farmSettings'), icon: mdiTuneVariant }] : []),
])
</script>

<template>
  <v-navigation-drawer
    :id="id"
    permanent
    :rail="!expanded"
    rail-width="72"
    width="256"
    :aria-label="t('nav.label')"
  >
    <v-list nav>
      <v-tooltip
        v-for="destination in destinations"
        :key="destination.page"
        :text="destination.title"
        location="end"
        :disabled="expanded"
      >
        <template #activator="{ props: tooltip }">
          <v-list-item
            v-bind="tooltip"
            :prepend-icon="destination.icon"
            :title="destination.title"
            :aria-label="destination.title"
            :active="navigation.current.value === destination.page"
            :aria-current="navigation.current.value === destination.page ? 'page' : undefined"
            @click="navigation.navigate(destination.page)"
          />
        </template>
      </v-tooltip>
    </v-list>
  </v-navigation-drawer>
</template>
