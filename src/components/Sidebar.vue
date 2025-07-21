<script setup>
import { ref, inject, onMounted } from 'vue';
import * as utils from '../utils/dataUtils.js';

const originalData = inject('originalData');
const data = inject('data');
const metric = inject('metric');
const selectedLocation = inject('selectedLocation');
const dayCount = inject('dayCount');

const photo = ref(localStorage.photo || '');
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

    // utils.fetchPhoto(location)
    //     .then(photoUrl => {
    //         photo.value = photoUrl;
    //         localStorage.photo = photoUrl;
    //         console.log('Photo fetched:', photo.value);
    //     })
    //     .catch(error => console.error('Error fetching photo:', error));
}

onMounted(async () => {
    console.log('App mounted, fetching weather data...');
    console.log('from App component, the location is:', selectedLocation.value);
    [originalData.value, data.value] = await utils.fetchWeather(selectedLocation.value, metric.value, dayCount.value);
});
</script>

<template>
    <!-- h-full -->
    <div class="
        sidebar flex flex-col justify-between bg-inherit p-4">
        <aside
            class="
            flex flex-col md:flex-row md:justify-around md:items-center
            xl:flex-col xl:justify-start xl:items-start
            relative
            rtl:border-r-0 rtl:border-l 
            sm:rounded-3xl
            ">

            <!-- <slot /> -->

            <!-- <input type="text"
                class="w-full py-2 pl-10 pr-4 z-3 text-gray-700 bg-white border rounded-2xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="e.g. London" v-model="selectedLocation" @input="handleSearch" /> -->

            <!-- <div class="relative w-full">
                <ul class="w-full absolute overflow-y-auto z-1000 border border-gray-400 rounded-2xl bg-white dark:bg-gray-900"
                    v-show="suggestedLocations.length > 0">
                    <li class="cursor-pointer text-center border-b border-gray-400 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        v-for="loc in suggestedLocations" :key="loc.name" @click="setSelectedLocation(`${loc.name}, ${loc.country}`);">
                        {{ loc.name }}, {{ loc.country }}
                    </li>
                </ul>
            </div> -->

            <div class="mb-2 xl:mb-10"> <!-- class="flex items-center xl:flex-col" -->
                <h1 class="text-4xl mb-2">{{ data.location?.name }}, {{ data.location?.country }}</h1>
                <p class="text-lg"> {{ data.location?.localtime }}</p>
            </div>

            <div class="
            grid grid-cols-2 items-center gap-2 mb-2 xl:mb-8 
            xl:justify-items-center xl:grid-cols-1 xl:grid-rows-[1fr_minmax(0,0.5fr)]
            ">
                <img class="w-50 scale-125 xl:w-75" :src="data.current?.condition.icon" alt="condition icon">
                
                <div>
                    <div class="flex content-start">
                        <p class="text-6xl xl:text-9xl font-bold">{{ data.current?.temp }}</p>
                        <p class="text-4xl">&deg{{ (metric === 'f') ? 'F' : 'C' }}</p>
                    </div>

                    <p class="text-lg">{{ data.forecast?.forecastday[0].condition.text }}</p>
                </div>
            </div>

        </aside>
        <div class="flex justify-between gap-2">
            <div class="bg-gray-100 dark:bg-gray-900 p-4 w-full text-center rounded-2xl text-xl">High: {{ data.forecast?.forecastday[0].maxtemp }}&deg;</div>
            <div class="bg-gray-100 dark:bg-gray-900 p-4 w-full text-center rounded-2xl text-xl">Low: {{ data.forecast?.forecastday[0].mintemp }}&deg;</div>
        </div>
        <hr class="hidden xl:block my-2 border-gray-200 dark:border-gray-600" />
        <div class="hidden xl:flex justify-center items-center py-13 px-15 rounded-4xl bg-cover text-center bg-white"
            :style="{ backgroundImage: `url(${photo})` }">
            <p class="font-bold">{{ data.location?.name }}</p>
        </div>
    </div>

</template>