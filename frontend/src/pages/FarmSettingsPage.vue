<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiDeleteOutline, mdiPencilOutline } from '@mdi/js'
import FarmNameDialog from '../components/FarmNameDialog.vue'
import { useFarms } from '../composables/useFarms'
import { useNavigation } from '../composables/useNavigation'

const { t } = useI18n()
const farms = useFarms()
const navigation = useNavigation()

const farm = computed(() => farms.active.value)

const renameOpen = ref(false)
const deleteOpen = ref(false)
// Typing the farm name confirms the deletion (danger zone pattern).
const confirmation = ref('')
const removing = ref(false)
const deleteFailed = ref(false)
// Kept while the dialog closes, so its text does not flash once the farm is gone.
const deletingName = ref('')

const confirmed = computed(() => confirmation.value === deletingName.value)

// These settings belong to the active farm; without one, home offers to pick one.
watch(
  farm,
  (current) => {
    if (!current && !deleteOpen.value) navigation.navigate('home')
  },
  { immediate: true },
)

async function rename(name: string) {
  if (farm.value) await farms.rename(farm.value.id, name)
}

function startDelete() {
  if (!farm.value) return
  deletingName.value = farm.value.name
  confirmation.value = ''
  deleteFailed.value = false
  deleteOpen.value = true
}

async function confirmDelete() {
  const current = farm.value
  if (!current || !confirmed.value || removing.value) return
  removing.value = true
  try {
    await farms.remove(current.id)
    deleteOpen.value = false
    navigation.navigate('home')
  } catch (error) {
    console.error('Failed to delete farm', error)
    deleteFailed.value = true
  } finally {
    removing.value = false
  }
}
</script>

<template>
  <v-container max-width="720">
    <h1
      class="text-h4 mb-6"
      tabindex="-1"
    >
      {{ t('farmSettings.title') }}
    </h1>

    <template v-if="farm">
      <section
        aria-labelledby="farm-settings-general"
        class="mb-8"
      >
        <h2
          id="farm-settings-general"
          class="text-h6 mb-2"
        >
          {{ t('farmSettings.general') }}
        </h2>
        <v-card variant="outlined">
          <v-list-item
            class="py-3"
            :title="t('farm.name')"
            :subtitle="farm.name"
          >
            <template #append>
              <v-btn
                variant="outlined"
                :prepend-icon="mdiPencilOutline"
                :text="t('farmSettings.rename')"
                @click="renameOpen = true"
              />
            </template>
          </v-list-item>
        </v-card>
      </section>

      <section aria-labelledby="farm-settings-danger">
        <h2
          id="farm-settings-danger"
          class="text-h6 mb-2"
        >
          {{ t('farmSettings.danger') }}
        </h2>
        <v-card
          variant="outlined"
          color="error"
        >
          <v-list-item
            class="py-3 text-high-emphasis"
            :title="t('farmSettings.delete')"
            :subtitle="t('farmSettings.deleteHint')"
          >
            <template #append>
              <v-btn
                color="error"
                variant="outlined"
                :prepend-icon="mdiDeleteOutline"
                :text="t('farmSettings.delete')"
                @click="startDelete"
              />
            </template>
          </v-list-item>
        </v-card>
      </section>
    </template>

    <FarmNameDialog
      v-model="renameOpen"
      :title="t('farm.renameTitle')"
      :submit-label="t('common.save')"
      :initial-name="farm?.name"
      :save="rename"
    />

    <v-dialog
      v-model="deleteOpen"
      max-width="480"
    >
      <v-card :title="t('farm.deleteTitle')">
        <form
          novalidate
          @submit.prevent="confirmDelete"
        >
          <v-card-text>
            <p class="mb-4">
              {{ t('farm.deleteWarning', { name: deletingName }) }}
            </p>
            <v-text-field
              v-model="confirmation"
              :label="t('farmSettings.confirmLabel', { name: deletingName })"
              autocomplete="off"
              spellcheck="false"
              autofocus
              hide-details
            />
            <p
              v-if="deleteFailed"
              class="text-error mt-4"
              role="alert"
            >
              {{ t('farm.errors.delete') }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :text="t('common.cancel')"
              @click="deleteOpen = false"
            />
            <v-btn
              type="submit"
              color="error"
              variant="flat"
              :disabled="!confirmed"
              :loading="removing"
              :text="t('farm.delete')"
            />
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-container>
</template>
