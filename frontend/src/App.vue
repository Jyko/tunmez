<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiAccountCircle } from '@mdi/js'
import FarmEmptyState from './components/FarmEmptyState.vue'
import FarmManagement from './components/FarmManagement.vue'
import FarmMenu from './components/FarmMenu.vue'
import FarmNameDialog from './components/FarmNameDialog.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import { useFarms } from './composables/useFarms'

const { t } = useI18n()
const farms = useFarms()

// Screens switch through this state: the application has no router.
const screen = ref<'home' | 'farms'>('home')
const creating = ref(false)
const openFailed = ref(false)

async function selectFarm(id: string) {
  try {
    await farms.select(id)
    screen.value = 'home'
  } catch (error) {
    console.error('Failed to open farm', error)
    openFailed.value = true
  }
}
</script>

<template>
  <v-app>
    <v-app-bar :title="t('app.name')">
      <template #append>
        <span class="text-medium-emphasis me-2">{{ t('app.tagline') }}</span>
        <FarmMenu
          @select="selectFarm"
          @create="creating = true"
          @manage="screen = 'farms'"
        />
        <!-- Placeholder for the account features to come. -->
        <v-icon
          :icon="mdiAccountCircle"
          size="x-large"
          color="medium-emphasis"
          class="mx-2"
        />
        <SettingsMenu />
      </template>
    </v-app-bar>
    <v-main>
      <FarmManagement
        v-if="screen === 'farms'"
        @back="screen = 'home'"
        @create="creating = true"
      />
      <FarmEmptyState
        v-else-if="!farms.active.value"
        @select="selectFarm"
        @create="creating = true"
      />
    </v-main>
    <FarmNameDialog
      v-model="creating"
      :title="t('farm.new')"
      :submit-label="t('farm.create')"
      :save="farms.create"
    />
    <v-snackbar
      v-model="openFailed"
      color="error"
    >
      {{ t('farm.errors.open') }}
    </v-snackbar>
  </v-app>
</template>
