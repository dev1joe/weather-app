<script setup>
import { defineProps, ref, onMounted } from 'vue';
import * as utils from '../utils/dataUtils.js';

const props = defineProps({
    data: Object,
    metric: String,
    dayCount: Number,
});

const selectedLocation = ref(localStorage.location || 'London');
const photo = ref(localStorage.photo || '');
const suggestedLocations = ref([]);
const queryTimeout = ref(null);
const originalData = ref({});

const emit = defineEmits(['update:data', 'update:metric']);
// emit('update:data', data.value);

function handleSearch(timeout = 500) {
    clearTimeout(queryTimeout.value);

    queryTimeout.value = setTimeout(() => {
        if (selectedLocation.value.trim() === '') {
            console.warn('Search input is empty');
            suggestedLocations.value = [];
            return;
        }

        fetch(`http://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_API}&q=${selectedLocation.value}`)
            .then(response => response.json())
            .then(locations => {
                if (locations.length > 0) {
                    console.log('Suggested locations:', locations);
                    suggestedLocations.value = locations;
                } else {
                    console.warn('No locations found for:', selectedLocation.value);
                    suggestedLocations.value = [];
                }
            })
            .catch(error => console.error('Error fetching locations:', error));
    }, timeout);
}

function setSelectedLocation(location) {
    console.log('Setting selected location:', location);
    selectedLocation.value = location;
    suggestedLocations.value = [];
    fetchWeather(0); // Fetch weather data immediately after setting the location
}

// data
function fetchWeather(timeout = 500) {
    clearTimeout(queryTimeout.value);

    queryTimeout.value = setTimeout(() => {
        utils.fetchWeather(selectedLocation.value, props.dayCount)
            .then(json => {
                originalData.value = json;

                if (localStorage.metric === 'f') {
                    console.log('Using Fahrenheit data');

                    emit('update:data', utils.extractData(originalData.value, 'f'));
                    localStorage.data = utils.extractData(originalData.value, 'f');

                    emit('update:metric', 'f');
                    localStorage.metric = 'f';
                } else {
                    console.log('Using Celsius data');

                    emit('update:data', utils.extractData(originalData.value, 'c'));
                    localStorage.data = utils.extractData(originalData.value, 'c');

                    emit('update:metric', 'c');
                    localStorage.metric = 'c';
                }

                // localStorage.data = data;
                localStorage.location = selectedLocation.value;

                utils.fetchPhoto(selectedLocation.value)
                    .then(photoUrl => {
                        photo.value = photoUrl;
                        localStorage.photo = photoUrl;
                        console.log('Photo fetched:', photo.value);
                    })
                    .catch(error => console.error('Error fetching photo:', error));
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }, timeout);
}

onMounted(() => {
    console.log('App mounted, fetching weather data...');
    console.log('from App component, the location is:', selectedLocation.value);
    fetchWeather(0);
});

</script>

<template>
    <div class="sidebar bg-white p-6 dark:bg-gray-900 h-full flex flex-col justify-between">
        <aside
            class="flex flex-col items-center bg-white rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 relative">

            <!-- <slot /> -->

            <input type="text"
                class="w-full py-2 pl-10 pr-4 z-3 text-gray-700 bg-white border rounded-2xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="e.g. London" v-model="selectedLocation" @input="handleSearch()" />

            <div class="relative w-full">
                <ul class="w-full absolute overflow-y-auto z-1000 border border-gray-400 rounded-2xl bg-white dark:bg-gray-900"
                    v-show="suggestedLocations.length > 0">
                    <li class="cursor-pointer text-center border-b border-gray-400 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        v-for="loc in suggestedLocations" :key="loc.name" @click="setSelectedLocation(loc.name);">
                        {{ loc.name }}, {{ loc.country }}
                    </li>
                </ul>
            </div>

            <img class="w-40 scale-125" :src="data.current?.condition.icon" alt="condition icon">

            <div class="flex content-start pb-4">
                <p class="text-7xl">{{ data.current?.temp }}</p>
                <p class="text-4xl">&deg{{ (metric === 'f') ? 'F' : 'C' }}</p>
            </div>

            <div class="w-full px-4 text-xl">
                <img :src="data.forecast?.forecastday[0].condition.icon" alt="" class="inline">
                <span>{{ data.forecast?.forecastday[0].condition.text }}</span>
            </div>

            <div class="w-full px-4 mb-2 text-xl">
                <span class="me-2">🌡️</span>
                <span class="me-2">H: {{ data.forecast?.forecastday[0].maxtemp }} &deg</span>
                <span>L: {{ data.forecast?.forecastday[0].mintemp }}&deg</span>
            </div>

            <div class="w-full px-4 mb-2 text-xl">
                <span>⏰</span>
                <span class="me-2">{{ data.location?.localtime }}</span>
            </div>

            <div class="w-full px-4 mb-2 text-xl">
                <span>⏰</span>
                <span class="me-2">Last Update:</span>
                <span class="me-2">{{ data.current?.last_updated }}</span>
            </div>
        </aside>
        <hr class="mb-2 border-gray-200 dark:border-gray-600" />
        <div class="flex justify-center items-center mx-4 py-10 px-15 rounded-4xl bg-cover text-center bg-white"
            :style="{ backgroundImage: `url(${photo})` }">
            <p class="font-bold">{{ data.location?.name }}</p>
        </div>
    </div>

</template>