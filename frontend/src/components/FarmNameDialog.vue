<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FARM_NAME_MAX_LENGTH } from '../api/farms'
import { farmNameError } from '../composables/useFarms'

const props = defineProps<{
  title: string
  submitLabel: string
  initialName?: string
  save: (name: string) => Promise<void>
}>()

const open = defineModel<boolean>({ required: true })

const { t } = useI18n()
const name = ref('')
const touched = ref(false)
const saving = ref(false)
const failed = ref(false)

watch(
  open,
  (isOpen) => {
    if (!isOpen) return
    name.value = props.initialName ?? ''
    touched.value = false
    failed.value = false
  },
  { immediate: true },
)

const error = computed(() => {
  const reason = farmNameError(name.value)
  return reason && t(`farm.errors.${reason}`, { max: FARM_NAME_MAX_LENGTH })
})

const messages = computed(() => {
  if (failed.value) return [t('farm.errors.save')]
  return touched.value && error.value ? [error.value] : []
})

// Counts characters, not UTF-16 code units, like the Go service.
const characterCount = (value: string) => [...value].length

function onInput() {
  touched.value = true
  failed.value = false
}

async function submit() {
  touched.value = true
  if (error.value || saving.value) return
  saving.value = true
  failed.value = false
  try {
    await props.save(name.value)
    open.value = false
  } catch (err) {
    console.error('Failed to save farm', err)
    failed.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="480"
  >
    <v-card :title="title">
      <form
        novalidate
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model="name"
            :label="t('farm.name')"
            :error-messages="messages"
            :counter="FARM_NAME_MAX_LENGTH"
            :counter-value="characterCount"
            required
            autofocus
            @update:model-value="onInput"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            :text="t('common.cancel')"
            @click="open = false"
          />
          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            :loading="saving"
            :text="submitLabel"
          />
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
