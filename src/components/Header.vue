<script setup>
import { ref } from 'vue';
import SettingsBar from './SettingsBar.vue';
import ExpandingButton from './ExpandingButton.vue';

const suggestedLocations = ref([]);

const queryTimeout = ref(null);

function handleSearch(event, timeout = 500) {
    clearTimeout(queryTimeout.value);

    const query = event.target.value;

    queryTimeout.value = setTimeout(() => {
        if (query.trim() === '') {
            console.warn('Search input is empty');
            suggestedLocations.value = [];
            return;
        }

        // fetch(`https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_API}&q=${query}`)
        fetch(`/api/search-location?location=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(locations => {
                if (locations.length > 0) {
                    console.log('Suggested locations:', locations);
                    suggestedLocations.value = locations;
                } else {
                    console.warn('No locations found for:', query);
                    suggestedLocations.value = [];
                }
            })
            .catch(error => console.error('Error fetching locations:', error));
    }, timeout);
}

function setSelectedLocation(location) {
    console.log('Setting selected location:', location);
    // localLocation.value = location;
    fetchWeather();
    selectedLocation.value = location;
    localStorage.location = location
    suggestedLocations.value = [];
}
</script>

<template>
    <div class="flex justify-between items-center gap-2">
        <div class="grow lg:max-w-3/10">
            <input type="text"
                class="w-full py-2 pl-5 pr-4 text-gray-700 bg-white border rounded-2xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="e.g. London" v-model="selectedLocation" @input="handleSearch" />

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

        <SettingsBar class="grow-0" />
        <!-- <ExpandingButton /> -->
    </div>
</template>