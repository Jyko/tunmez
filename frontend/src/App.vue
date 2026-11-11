<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SettingsMenu from './components/SettingsMenu.vue'

const { t } = useI18n()
</script>

<template>
  <v-app>
    <v-app-bar :title="t('app.name')">
      <template #append>
        <span class="text-medium-emphasis me-2">{{ t('app.tagline') }}</span>
        <SettingsMenu />
      </template>
    </v-app-bar>
    <v-main />
  </v-app>
</template>
