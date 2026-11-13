<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiArrowLeft, mdiDeleteOutline, mdiPencilOutline, mdiPlus } from '@mdi/js'
import type { Farm } from '../api/farms'
import { useFarms } from '../composables/useFarms'
import FarmNameDialog from './FarmNameDialog.vue'

const emit = defineEmits<{ back: []; create: [] }>()

const { t } = useI18n()
const farms = useFarms()

// The farm stays set while its dialog closes, so the text does not flash.
const renaming = ref<Farm | null>(null)
const renameOpen = ref(false)
const deleting = ref<Farm | null>(null)
const deleteOpen = ref(false)
const removing = ref(false)
const deleteFailed = ref(false)

function startRename(farm: Farm) {
  renaming.value = farm
  renameOpen.value = true
}

async function rename(name: string) {
  if (renaming.value) await farms.rename(renaming.value.id, name)
}

function startDelete(farm: Farm) {
  deleting.value = farm
  deleteFailed.value = false
  deleteOpen.value = true
}

async function confirmDelete() {
  const farm = deleting.value
  if (!farm || removing.value) return
  const wasActive = farm.id === farms.active.value?.id
  removing.value = true
  try {
    await farms.remove(farm.id)
    deleteOpen.value = false
    // Without an active farm, the home screen shows the empty state.
    if (wasActive || farms.farms.value.length === 0) emit('back')
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
    <div class="d-flex align-center ga-2 mb-4">
      <v-btn
        :icon="mdiArrowLeft"
        variant="text"
        :aria-label="t('common.back')"
        @click="emit('back')"
      />
      <h1 class="text-h5 flex-grow-1">
        {{ t('farm.manage') }}
      </h1>
      <v-btn
        color="primary"
        variant="flat"
        :prepend-icon="mdiPlus"
        :text="t('farm.new')"
        @click="emit('create')"
      />
    </div>
    <v-list
      v-if="farms.farms.value.length"
      border
      rounded
    >
      <v-list-item
        v-for="farm in farms.farms.value"
        :key="farm.id"
        :title="farm.name"
        :subtitle="farm.id === farms.active.value?.id ? t('farm.active') : undefined"
      >
        <template #append>
          <v-btn
            :icon="mdiPencilOutline"
            variant="text"
            :aria-label="t('farm.renameNamed', { name: farm.name })"
            @click="startRename(farm)"
          />
          <v-btn
            :icon="mdiDeleteOutline"
            variant="text"
            color="error"
            :aria-label="t('farm.deleteNamed', { name: farm.name })"
            @click="startDelete(farm)"
          />
        </template>
      </v-list-item>
    </v-list>
    <p
      v-else
      class="text-medium-emphasis"
    >
      {{ t('farm.none') }}
    </p>

    <FarmNameDialog
      v-model="renameOpen"
      :title="t('farm.renameTitle')"
      :submit-label="t('common.save')"
      :initial-name="renaming?.name"
      :save="rename"
    />

    <v-dialog
      v-model="deleteOpen"
      max-width="480"
    >
      <v-card
        :title="t('farm.deleteTitle')"
        :text="t('farm.deleteWarning', { name: deleting?.name ?? '' })"
      >
        <v-card-text
          v-if="deleteFailed"
          class="text-error"
          role="alert"
        >
          {{ t('farm.errors.delete') }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            :text="t('common.cancel')"
            @click="deleteOpen = false"
          />
          <v-btn
            color="error"
            variant="flat"
            :loading="removing"
            :text="t('farm.delete')"
            @click="confirmDelete"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
