<script setup>
import { defineProps } from 'vue';

defineProps({
    data: Object,
    photo: String,
    location: String,
    metric: String
});
</script>

<template>
    <div class="sidebar bg-white p-6 dark:bg-gray-900 h-full flex flex-col justify-between">
        <aside
            class="flex flex-col items-center bg-white rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">

            <slot />

            <img class="w-40 scale-125" :src="data.current?.condition.icon" alt="condition icon">

            <div class="flex content-start pb-4">
                <p class="text-7xl">{{ data.current?.temp }}</p>
                <p class="text-4xl">&deg{{ (metric === 'f')? 'F' : 'C' }}</p>
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

            <!-- :src="data.forecast.forecastday[0].condition.icon" -->

            <!-- <div class="flex items-center mb-4">
                <img class="me-2" :src="data.current?.condition.icon" alt="">
                <p>{{ data.forecast?.forecastday[0].condition.text }}</p>
            </div>

            <div class="flex items-center mb-4">
                <img class="me-2" :src="data.current?.condition.icon" alt="">
                <p>Rain - {{ data.forecast?.forecastday[0].daily_chance_of_rain }}%</p>
            </div> -->

        </aside>
        <hr class="mb-2 border-gray-200 dark:border-gray-600" />
        <div
            class="flex justify-center items-center mx-4 py-10 px-15 rounded-4xl bg-cover text-center bg-white"
            :style="{ backgroundImage: `url(${photo})` }">
            <p class="font-bold">{{ data.location?.region }}</p>
        </div>
    </div>

</template>