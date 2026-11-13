<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiAccountCircleOutline, mdiCogOutline } from '@mdi/js'
import FarmButton from './components/FarmButton.vue'
import FarmNameDialog from './components/FarmNameDialog.vue'
import MainNavigation from './components/MainNavigation.vue'
import { useDisplayPreferences } from './composables/useDisplayPreferences'
import { useFarms } from './composables/useFarms'
import { useNavigation } from './composables/useNavigation'
import FarmSettingsPage from './pages/FarmSettingsPage.vue'
import FarmsPage from './pages/FarmsPage.vue'
import HomePage from './pages/HomePage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import SettingsPage from './pages/SettingsPage.vue'

const { t } = useI18n()
const farms = useFarms()
const prefs = useDisplayPreferences()
const navigation = useNavigation()

const navExpanded = ref(false)
const creating = ref(false)
const openFailed = ref(false)
// Shown once at startup; the file is replaced when a setting changes.
const invalidConfigShown = ref(prefs.invalidConfig.value !== '')

// Keyboard and screen reader users land on the new page (see guideline).
watch(navigation.current, async () => {
  await nextTick()
  document.querySelector<HTMLElement>('main h1')?.focus()
})

async function selectFarm(id: string) {
  try {
    // The user stays on the current page, which shows the newly active farm.
    await farms.select(id)
  } catch (error) {
    console.error('Failed to open farm', error)
    openFailed.value = true
  }
}
</script>

<template>
  <v-app>
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon
          :aria-label="t('nav.toggle')"
          :aria-expanded="navExpanded"
          aria-controls="main-navigation"
          @click="navExpanded = !navExpanded"
        />
      </template>
      <v-app-bar-title>{{ t('app.name') }}</v-app-bar-title>
      <template #append>
        <FarmButton />
        <v-btn
          :icon="mdiAccountCircleOutline"
          :aria-label="t('profile.title')"
          :aria-current="navigation.current.value === 'profile' ? 'page' : undefined"
          @click="navigation.navigate('profile')"
        />
        <v-btn
          :icon="mdiCogOutline"
          :aria-label="t('settings.title')"
          :aria-current="navigation.current.value === 'settings' ? 'page' : undefined"
          @click="navigation.navigate('settings')"
        />
      </template>
    </v-app-bar>
    <MainNavigation
      id="main-navigation"
      v-model:expanded="navExpanded"
    />
    <v-main>
      <FarmsPage
        v-if="navigation.current.value === 'farms'"
        @select="selectFarm"
        @create="creating = true"
      />
      <FarmSettingsPage v-else-if="navigation.current.value === 'farmSettings'" />
      <SettingsPage v-else-if="navigation.current.value === 'settings'" />
      <ProfilePage v-else-if="navigation.current.value === 'profile'" />
      <HomePage
        v-else
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
    <v-snackbar
      v-model="invalidConfigShown"
      color="warning"
      timeout="-1"
      multi-line
    >
      {{ t('settings.invalidFile', { path: prefs.invalidConfig.value }) }}
      <template #actions>
        <v-btn
          :text="t('common.close')"
          @click="invalidConfigShown = false"
        />
      </template>
    </v-snackbar>
  </v-app>
</template>
