<script setup>
import { ref, inject } from 'vue';
import * as utils from '../utils/dataUtils.js';
import SettingsBar from './SettingsBar.vue';
import ExpandingButton from './ExpandingButton.vue';

const suggestedLocations = ref([]);
const selectedLocation = inject('selectedLocation');
const metric = inject('metric');
const originalData = inject('originalData');
const data = inject('data');
const photo = inject('image');

const searchBar = ref('');
const queryTimeout = ref(null);

const isWideScreen = ref(window.innerWidth >= 640);

function handleSearch(event, timeout = 500) {
    clearTimeout(queryTimeout.value);

    const query = event.target.value;

    queryTimeout.value = setTimeout(() => {
        utils.fetchSuggestedLocations(query)
            .then(locations => {
                suggestedLocations.value = locations;
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
                suggestedLocations.value = [];
            });
    }, timeout);
}

async function setSelectedLocation(location) {
    console.log('Setting selected location:', location);
    // localLocation.value = location;
    [originalData.value, data.value] = await utils.fetchWeather(location, metric.value);
    selectedLocation.value = location;
    localStorage.location = location
    suggestedLocations.value = [];
    searchBar.value = "";

    utils.fetchPhoto(location)
        .then(photoUrl => {
            photo.value = photoUrl;
            localStorage.photo = photoUrl;
            console.log('Photo fetched:', photo.value);
        })
        .catch(error => console.error('Error fetching photo:', error));
}
</script>

<template>
    <div class="flex justify-between items-center gap-2">
        <div class="grow lg:max-w-3/10">
            <input type="text"
                class="w-full py-2 pl-5 pr-4 text-gray-700 bg-white border rounded-2xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="e.g. London" @input="handleSearch" v-model="searchBar" />

            <div class="relative w-full" v-show="suggestedLocations.length > 0">
                <ul
                    class="w-full absolute overflow-y-auto z-1000 border border-gray-400 rounded-2xl bg-white dark:bg-gray-900">
                    <li class="cursor-pointer text-center border-b border-gray-400 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        v-for="loc in suggestedLocations" :key="loc.name"
                        @click="setSelectedLocation(`${loc.name}, ${loc.country}`);">
                        {{ loc.name }}, {{ loc.country }}
                    </li>
                </ul>
            </div>
        </div>

        <SettingsBar class="grow-0" v-if="isWideScreen" />
        <ExpandingButton v-else />
    </div>
</template>