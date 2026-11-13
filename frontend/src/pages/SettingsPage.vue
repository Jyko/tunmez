<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LocaleChoice, ThemeChoice } from '../api/displayPreferences'
import { useDisplayPreferences } from '../composables/useDisplayPreferences'

const { t } = useI18n()
const prefs = useDisplayPreferences()

// Language names are shown in their own language, whatever the interface language.
const locales = computed<{ value: LocaleChoice; title: string }[]>(() => [
  { value: '', title: t('settings.system') },
  { value: 'fr-FR', title: 'Français' },
  { value: 'en', title: 'English' },
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
  <v-container max-width="720">
    <h1
      class="text-h4 mb-6"
      tabindex="-1"
    >
      {{ t('settings.title') }}
    </h1>

    <section
      aria-labelledby="settings-language"
      class="mb-8"
    >
      <h2
        id="settings-language"
        class="text-h6 mb-2"
      >
        {{ t('settings.language') }}
      </h2>
      <v-card
        variant="outlined"
        class="pa-4"
      >
        <v-select
          v-model="locale"
          :items="locales"
          :label="t('settings.interfaceLanguage')"
          :hint="t('settings.languageHint')"
          persistent-hint
        />
      </v-card>
    </section>

    <section aria-labelledby="settings-appearance">
      <h2
        id="settings-appearance"
        class="text-h6 mb-2"
      >
        {{ t('settings.appearance') }}
      </h2>
      <v-card
        variant="outlined"
        class="pa-4"
      >
        <div
          id="settings-theme"
          class="text-subtitle-1"
        >
          {{ t('settings.theme') }}
        </div>
        <div
          id="settings-theme-hint"
          class="text-body-2 text-medium-emphasis mb-2"
        >
          {{ t('settings.themeHint') }}
        </div>
        <v-radio-group
          v-model="theme"
          inline
          hide-details
          aria-labelledby="settings-theme"
          aria-describedby="settings-theme-hint"
        >
          <v-radio
            v-for="option in themes"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </v-radio-group>
      </v-card>
    </section>
  </v-container>
</template>
