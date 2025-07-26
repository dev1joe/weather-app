<script setup>
import { inject } from 'vue';
import DarkModeSwitch from './DarkModeSwitch.vue';
import * as utils from '../utils/dataUtils.js';
import WhiteBalanceSunnyIcon from 'vue-material-design-icons/WhiteBalanceSunny.vue';
import WeatherNightIcon from 'vue-material-design-icons/WeatherNight.vue';

const isDarkMode = inject('isDarkMode');
const metric = inject('metric');
const originalData = inject('originalData');
const data = inject('data');

// metric
function useCelsius() { // update "metric" variable ?
    console.log('Using Celsius data');
    data.value = utils.extractData(originalData.value, 'c');
    metric.value = 'c';
    localStorage.metric = 'c';
}

function useFahrenheit() {
    console.log('Using Fahrenheit data');
    data.value = utils.extractData(originalData.value, 'f');
    metric.value = 'f';
    localStorage.metric = 'f';
}

// theme
function toggleTheme() {
    if (localStorage.theme === "dark") {
        document.documentElement.classList.remove('dark');
        localStorage.theme = "light";
        isDarkMode.value = false;
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = "dark";
        isDarkMode.value = true;
    }
}

</script>

<template>
    <div class="flex items-center gap-2">
        
        <!-- <DarkModeSwitch :darkMode="isDarkMode" @change="toggleTheme" /> -->

        <button type="button" @click="toggleTheme" class="rounded-4xl text-center p-2 text-xl outline-gray-200 outline-1 dark:outline-0 bg-white dark:bg-gray-900">
            <WhiteBalanceSunnyIcon size="32" class="text-yellow-500 dark:text-yellow-300" v-if="isDarkMode" />
            <WeatherNightIcon size="32" class="text-yellow-500 dark:text-yellow-300" v-else />
        </button>

        <button type="button" @click="useCelsius" class="rounded-4xl size-10 text-center text-xl outline-gray-200 outline-1 dark:outline-0"
            :class="[(metric === 'c') ? 'bg-yellow-300 text-black' : 'bg-white dark:bg-gray-900']">&deg;C</button>

        <button type="button" @click="useFahrenheit" class="rounded-4xl size-10 text-center text-xl outline-gray-200 outline-1 dark:outline-0"
            :class="[(metric === 'f') ? 'bg-yellow-300 text-black' : 'bg-white dark:bg-gray-900']">&deg;F</button>

        <!-- <button type="button" @click="" class="rounded-4xl size-10 text-center bg-gray-400 overflow-hidden">
            <img class="w-full" src="../../public/avatar-placeholder.jpg" alt="User's Avatar">
        </button> -->
    </div>
</template>