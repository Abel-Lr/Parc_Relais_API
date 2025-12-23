<script setup>
import { onMounted, ref } from 'vue'
const parcRelais = ref([])
const displayedParcRelais = ref([])
const search = ref('')
const onlyOpened = ref(false);
const btnClass = ref('hover:bg-slate-700 bg-slate-600 active:bg-slate-800')
// const API_URL = import.meta.env.VITE_API_URL
// const API_COMBO = btoa(import.meta.env.VITE_COMBO)


// import { parseOpeningHours } from "./lib/hour_parser/parseOpeningHours";
import { fuzzySearch, displayDate, reformatHoursJSON, isWeekdayToday, isClosed, isTodayFerie, displayOnlyOpened } from './utils/utils';

const toggleBtn = () => {
  onlyOpened.value = !onlyOpened.value;
  btnClass.value = onlyOpened.value ? "hover:bg-green-700 bg-green-600 active:bg-green-800" : "hover:bg-slate-700 bg-slate-600 active:bg-slate-800";
  updateDisplay()
}

onMounted(async () => {
  const response = await fetch("/get-api-parc");
  if (!response.ok) throw new Error("Network error");
  // API_URL, { headers: { Authorization: `Basic ${API_COMBO}` } }
  const data = await response.json()

  // Sort data alphabetically by parc relais name
  data.values = data.values.sort((a, b) => {
    if (a["nom"] < b["nom"]) return -1
  })
  parcRelais.value = data.values.map(parc => {
    const exploitableHours = reformatHoursJSON(parc.horaires);
    return ({ ...parc, horaires: exploitableHours["week"], ferie: exploitableHours["ferie"], closed: isClosed(exploitableHours) })
  })
  displayedParcRelais.value = data.values.map(parc => {
    const exploitableHours = reformatHoursJSON(parc.horaires);
    return ({ ...parc, horaires: exploitableHours["week"], ferie: exploitableHours["ferie"], closed: isClosed(exploitableHours) })
  })
})

function updateDisplay() {
  displayedParcRelais.value = displayOnlyOpened(fuzzySearch(search.value, parcRelais.value), onlyOpened.value);
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <header class="flex flex-col bg-white sticky top-0 py-4 shadow-sm z-10">
      <h1 class="text-3xl font-bold mx-auto w-fit">
        Parcs Relais du Grand Lyon
      </h1>
      <input type="text" v-model="search" @input="updateDisplay" placeholder="Rechercher un parc relais"
        class="w-3/4 mx-auto mt-4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
      <div>
        <p :class="`${btnClass} w-fit mx-auto text-white font-bold cursor-pointer rounded-md px-6 py-3 select-none mt-2 text-center`"
          @click="toggleBtn">{{ onlyOpened ? 'Voir tous les parcs' : 'Voir parcs ouverts' }}</p>
      </div>
    </header>
    <div class="w-full">
      <div class="grid gap-4  grid-cols-1 md:grid-cols-3 w-3/4 mx-auto">
        <div v-for="parc in displayedParcRelais" :key="parc.id">
          <div class="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4"
            :class="{ 'grayscale opacity-65': parc.closed }">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800"> <span class="text-2xl text-blue-600">🅿️</span>
                {{ parc.nom }}</h2>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-blue-800">Places disponibles</h3>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-3xl font-bold text-blue-700">{{ parc.nb_tot_place_dispo }}</p>
              </div>
            </div>
            <div v-if="parc.horaires" class="bg-gray-100 p-3 rounded-md">
              <div class="mt-2">
                <details>
                  <summary class="text-xs font-bold text-gray-700 mb-1 cursor-pointer">Horaires
                  </summary>
                  <ul class="text-xs text-gray-600">
                    <ul v-for="(Horaire, key) in parc.horaires" :key="key">
                      <li v-if="Horaire">
                        <div v-if="isWeekdayToday(key.toLowerCase()) && !isTodayFerie()" class="font-bold">
                          <span class="font-extrabold"> {{ key }} : </span>
                          {{ Horaire.open.hour }}:{{ Horaire.open.minute }} - {{ Horaire.closed.hour }}:{{
                            Horaire.closed.minute }}
                        </div>
                        <div v-else>
                          <span class="font-semibold">{{ key }} : </span>
                          {{ Horaire.open.hour }}:{{ Horaire.open.minute }} - {{ Horaire.closed.hour }}:{{
                            Horaire.closed.minute }}
                        </div>
                      </li>
                      <li v-else>
                        <span class="font-semibold">{{ key }} : </span>
                        Fermé
                      </li>
                    </ul>
                  </ul>
                </details>
              </div>
              <div v-if="parc.horaires.modalities" class="mt-2">
                <h5 class="text-xs font-bold text-gray-700 mb-1">Modalités</h5>
                <ul class="text-xs text-gray-600">
                  <li v-for="(modality, index) in parc.horaires.modalities" :key="index">
                    {{ modality }}
                  </li>
                </ul>
              </div>
              <div class="mt-2">
                <h5 class="text-xs font-bold text-gray-700 mb-1">
                  Jours feriés
                </h5>
                <ul :class="{ 'font-bold': isTodayFerie() && parc.ferie }" class="text-xs text-gray-600">
                  <li>{{ parc.ferie ? 'Fermé' : 'Ouvert' }}</li>
                </ul>
              </div>
              <div v-if="parc.last_update" class="mt-2">
                <h5 class="text-xs font-bold text-gray-700 mb-1">Dernière mise à jour</h5>
                <ul class="text-xs text-gray-600">
                  <li>
                    {{ displayDate(parc.last_update) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>

<style scoped></style>
