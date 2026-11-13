<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <v-container max-width="720">
    <h1
      class="text-h4 mb-6"
      tabindex="-1"
    >
      {{ t('profile.title') }}
    </h1>
  </v-container>
</template>
