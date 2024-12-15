<script setup>
import { onMounted, ref } from 'vue'
const parcRelais = ref([])
const displayedParcRelais = ref([])
const search = ref('')
const btnClass = ref('hover:bg-red-700 bg-red-600 active:bg-red-800')
const API_URL = "https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaisst/all.json?maxfeatures=100&start=1&filename=parcs-relais-reseau-transports-commun-lyonnais"

import { fuzzySearch } from './utils/utils';

function extractHours(description) {
  // Function to extract main hours
  const extractMainHours = (desc) => {
    const hourPattern = /Ouvert de (\d{1,2}h\d{2}) à (\d{1,2}h\d{2})/;
    const matchBase = desc.match(hourPattern);
    
    if (!matchBase) {
      // Handle "En accès libre" case
      if (/accès libre/i.test(desc)) {
        return {
          weekdays: { open: null, close: null },
          weekends: { open: null, close: null }
        };
      }
      return null;
    }

    // Check for different day ranges
    const weekdayPatterns = [
      /du lundi au jeudi/,
      /du dimanche au jeudi/,
      /du lundi au vendredi/,
      /du lundi au dimanche/
    ];

    const weekendPatterns = [
      /de 4h30 à 3h00 les vendredis et samedis/,
      /vendredi et samedi/
    ];

    const defaultHours = {
      open: matchBase[1],
      close: matchBase[2]
    };

    const result = {
      weekdays: defaultHours,
      weekends: defaultHours
    };

    // Specific day range modifications
    if (weekdayPatterns.some(pattern => pattern.test(desc))) {
      result.weekdays = defaultHours;
    }

    if (weekendPatterns.some(pattern => pattern.test(desc))) {
      result.weekends = {
        open: '4h30',
        close: '3h00'
      };
    }

    return result;
  };

  // Function to extract modalities
  const extractModalities = (desc) => {
    const modalities = [];

    // List of potential modality patterns
    const modalityPatterns = [
      /Réservé aux abonnés TCL/,
      /Réservé aux abonnés PREMIUM/,
      /Fermé les dimanches et jours fériés/,
      /Accès libre en dehors de ces horaires/,
      /Présence de \d+ arceaux et \d+ consignes vélos/,
      /Niveau \d+ réservé aux abonnés/
    ];

    modalityPatterns.forEach(pattern => {
      const match = desc.match(pattern);
      if (match) {
        modalities.push(match[0]);
      }
    });

    return modalities.length > 0 ? modalities : null;
  };

  // Combine hours and modalities
  return {
    hours: extractMainHours(description),
    modalities: extractModalities(description)
  };
}

function toggleBtn() {
  btnClass.value = btnClass.value.includes("red") ? "hover:bg-green-700 bg-green-600 active:bg-green-800" : "hover:bg-red-700 bg-red-600 active:bg-red-800"
}

onMounted(async () => {
  const response = await fetch(API_URL)
  const data = await response.json()
  parcRelais.value = data.values.map(parc => ({ ...parc, horaires: extractHours(parc.horaires) })) 
  displayedParcRelais.value = data.values.map(parc => ({ ...parc, horaires: extractHours(parc.horaires) }))
})

function showSearchResult() {
  displayedParcRelais.value = fuzzySearch(search.value, parcRelais.value)
}
</script>

<template>
  <div class="w-full flex flex-col mt-2 gap-2">
    <h1 class="text-3xl font-bold mx-auto w-fit">
      Quel parc relais ?
    </h1>
    <input type="text" v-model="search" @input="showSearchResult" placeholder="Rechercher un parc relais"
      class="w-3/4 mx-auto mt-4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
    <div>
      <p :class="`${btnClass} w-fit mx-auto text-white font-bold cursor-pointer rounded-md px-2 py-2 select-none`" @click="toggleBtn">OUVERTS</p>
    </div>
    <div class="w-full">
      <div class="grid gap-4  grid-cols-1 md:grid-cols-3 w-3/4 mx-auto">
        <div v-for="parc in displayedParcRelais" :key="parc.id">
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800"> <span className="text-2xl text-blue-600">🅿️</span>
                {{ parc.nom }}</h2>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-blue-800">Places dispo</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold text-blue-700">{{ parc.capacite }}</p>
              </div>
            </div>
            <div v-if="parc.horaires" className="bg-gray-100 p-3 rounded-md">
              <div class="mt-2">
                <h5 class="text-xs font-bold text-gray-700 mb-1">Horaires
                </h5>
                <ul class="text-xs text-gray-600">
                  <ul v-for="(Horaire, key) in parc.horaires.hours" :key="key">
                    <li v-if="Horaire.open">
                      <span v-if="key === 'weekdays'" class="font-semibold">Semaine:</span>
                      <span v-else class="font-semibold">Week-end:</span>
                      {{ Horaire.open }} - {{ Horaire.close }}
                    </li>
                  </ul>
                </ul>
              </div>
              <div v-if="parc.horaires.modalities" class="mt-2">
                <h5 class="text-xs font-bold text-gray-700 mb-1">Modalités</h5>
                <ul class="text-xs text-gray-600">
                  <li v-for="(modality, index) in parc.horaires.modalities" :key="index">
                    {{ modality }}
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
