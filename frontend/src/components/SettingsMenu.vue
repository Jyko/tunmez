<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiCogOutline } from '@mdi/js'
import type { LocaleChoice, ThemeChoice } from '../api/displayPreferences'
import { useDisplayPreferences } from '../composables/useDisplayPreferences'

const { t } = useI18n()
const prefs = useDisplayPreferences()

// Language names are shown in their own language, whatever the interface language.
const locales = computed<{ value: LocaleChoice; label: string }[]>(() => [
  { value: '', label: t('settings.system') },
  { value: 'fr-FR', label: 'Français' },
  { value: 'en', label: 'English' },
])

const themes = computed<{ value: ThemeChoice; label: string }[]>(() => [
  { value: 'system', label: t('settings.system') },
  { value: 'light', label: t('settings.light') },
  { value: 'dark', label: t('settings.dark') },
])

const locale = computed({
  get: () => prefs.locale.value,
  set: (value: LocaleChoice) => void prefs.setLocale(value),
})

const theme = computed({
  get: () => prefs.theme.value,
  set: (value: ThemeChoice) => void prefs.setTheme(value),
})
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props: activator }">
      <v-btn
        v-bind="activator"
        :icon="mdiCogOutline"
        :aria-label="t('settings.open')"
      />
    </template>
    <v-card min-width="240">
      <v-card-text>
        <div
          id="settings-language"
          class="text-subtitle-2 mb-1"
        >
          {{ t('settings.language') }}
        </div>
        <v-radio-group
          v-model="locale"
          aria-labelledby="settings-language"
          hide-details
        >
          <v-radio
            v-for="option in locales"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </v-radio-group>
        <div
          id="settings-theme"
          class="text-subtitle-2 mt-4 mb-1"
        >
          {{ t('settings.theme') }}
        </div>
        <v-radio-group
          v-model="theme"
          aria-labelledby="settings-theme"
          hide-details
        >
          <v-radio
            v-for="option in themes"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
