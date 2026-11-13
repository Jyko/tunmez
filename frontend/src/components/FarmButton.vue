<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiBarn } from '@mdi/js'
import { useFarms } from '../composables/useFarms'
import { useNavigation } from '../composables/useNavigation'
import { primaryShortcut } from '../keyboard/primaryShortcut'

const { t } = useI18n()
const { farms, active } = useFarms()
const navigation = useNavigation()
const shortcut = primaryShortcut('o')

const label = computed(() => {
  if (active.value) return active.value.name
  return t(farms.value.length ? 'farm.placeholder.choose' : 'farm.placeholder.none')
})

const hint = computed(() => {
  const page = t('farm.hint', { shortcut: shortcut.label })
  return active.value ? `${active.value.name} · ${page}` : page
})

function open() {
  navigation.navigate('farms')
}

function onKeydown(event: KeyboardEvent) {
  if (!shortcut.matches(event)) return
  event.preventDefault()
  open()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <v-btn
    variant="text"
    class="text-none"
    :prepend-icon="mdiBarn"
    :title="hint"
    :aria-keyshortcuts="shortcut.aria"
    :aria-current="navigation.current.value === 'farms' ? 'page' : undefined"
    @click="open"
  >
    <span class="farm-name text-truncate">{{ label }}</span>
  </v-btn>
</template>

<style scoped>
.farm-name {
  display: block;
  max-width: min(40vw, 20rem);
}
</style>
