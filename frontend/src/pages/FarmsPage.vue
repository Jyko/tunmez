<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiPlus } from '@mdi/js'
import type { Farm } from '../api/farms'
import FarmCard from '../components/FarmCard.vue'
import { useFarms } from '../composables/useFarms'

const emit = defineEmits<{ select: [id: string]; create: [] }>()

const { t } = useI18n()
const farms = useFarms()

const isActive = (farm: Farm) => farm.id === farms.active.value?.id

const activeFarms = computed(() => farms.farms.value.filter(isActive))
const others = computed(() => farms.farms.value.filter((farm) => !isActive(farm)))

const activeHeading = ref<HTMLElement | null>(null)

// Opening a farm keeps the user on this page: its card moves to the active
// section, so focus follows it there instead of being lost with the old card.
watch(
  () => farms.active.value?.id,
  async (id) => {
    if (!id) return
    await nextTick()
    activeHeading.value?.focus()
  },
)
</script>

<template>
  <v-container max-width="720">
    <div class="d-flex align-center flex-wrap ga-2 mb-6">
      <h1
        class="text-h4 flex-grow-1"
        tabindex="-1"
      >
        {{ t('nav.farms') }}
      </h1>
      <v-btn
        color="primary"
        variant="flat"
        :prepend-icon="mdiPlus"
        :text="t('farm.new')"
        @click="emit('create')"
      />
    </div>
    <template v-if="farms.farms.value.length">
      <section
        class="mb-8"
        aria-labelledby="farms-active"
      >
        <h2
          id="farms-active"
          ref="activeHeading"
          class="text-h6 mb-3"
          tabindex="-1"
        >
          {{ t('farm.active') }}
        </h2>
        <v-row
          v-if="activeFarms.length"
          role="list"
          aria-labelledby="farms-active"
        >
          <v-col
            v-for="farm in activeFarms"
            :key="farm.id"
            role="listitem"
            cols="12"
            sm="6"
          >
            <FarmCard
              :farm="farm"
              active
              @open="emit('select', farm.id)"
            />
          </v-col>
        </v-row>
        <p
          v-else
          class="text-medium-emphasis"
        >
          {{ t('farm.noneActive') }}
        </p>
      </section>
      <section
        v-if="others.length"
        aria-labelledby="farms-others"
      >
        <h2
          id="farms-others"
          class="text-h6 mb-3"
        >
          {{ t('farm.others') }}
        </h2>
        <v-row
          role="list"
          aria-labelledby="farms-others"
        >
          <v-col
            v-for="farm in others"
            :key="farm.id"
            role="listitem"
            cols="12"
            sm="6"
          >
            <FarmCard
              :farm="farm"
              @open="emit('select', farm.id)"
            />
          </v-col>
        </v-row>
      </section>
    </template>
    <p
      v-else
      class="text-medium-emphasis"
    >
      {{ t('farm.none') }}
    </p>
  </v-container>
</template>
