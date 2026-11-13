<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiCheck, mdiMenuDown, mdiPlus, mdiViewListOutline } from '@mdi/js'
import { useFarms } from '../composables/useFarms'
import { primaryShortcut } from '../keyboard/primaryShortcut'

const emit = defineEmits<{ select: [id: string]; create: []; manage: [] }>()

const { t } = useI18n()
const { farms, active } = useFarms()
const open = ref(false)
const shortcut = primaryShortcut('o')
const listId = 'farm-menu-list'

const hint = computed(() => {
  const menu = t('farm.hint', { shortcut: shortcut.label })
  return active.value ? `${active.value.name} · ${menu}` : menu
})

// The menu content is hidden until placed, and hidden elements reject focus.
function focusFirstItem(attempt = 1) {
  const item = document.getElementById(listId)?.querySelector<HTMLElement>('.v-list-item')
  item?.focus()
  if ((!item || document.activeElement !== item) && attempt < 10) {
    requestAnimationFrame(() => focusFirstItem(attempt + 1))
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!shortcut.matches(event)) return
  event.preventDefault()
  open.value = true
  void nextTick(() => focusFirstItem())
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <v-menu
    v-model="open"
    location="bottom end"
  >
    <template #activator="{ props: activator }">
      <v-btn
        v-bind="activator"
        variant="text"
        class="text-none"
        :append-icon="mdiMenuDown"
        :title="hint"
        :aria-keyshortcuts="shortcut.aria"
      >
        <span class="farm-name text-truncate">{{ active?.name ?? t('farm.menu') }}</span>
      </v-btn>
    </template>
    <v-list
      :id="listId"
      density="compact"
      min-width="240"
      max-width="360"
    >
      <template v-if="farms.length">
        <v-list-subheader>{{ t('farm.list') }}</v-list-subheader>
        <v-list-item
          v-for="farm in farms"
          :key="farm.id"
          :title="farm.name"
          :aria-current="farm.id === active?.id || undefined"
          @click="emit('select', farm.id)"
        >
          <template #append>
            <v-icon
              v-if="farm.id === active?.id"
              :icon="mdiCheck"
              size="small"
            />
          </template>
        </v-list-item>
        <v-divider class="my-1" />
      </template>
      <v-list-item
        :prepend-icon="mdiPlus"
        :title="t('farm.new')"
        @click="emit('create')"
      />
      <v-list-item
        :prepend-icon="mdiViewListOutline"
        :title="t('farm.manage')"
        @click="emit('manage')"
      />
    </v-list>
  </v-menu>
</template>

<style scoped>
.farm-name {
  display: block;
  max-width: min(40vw, 20rem);
}
</style>
