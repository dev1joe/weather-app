<script setup>
import { defineProps } from 'vue';

defineProps({
    data: Object,
    photo: String,
    location: String,
});
</script>

<template>
    <div class="sidebar bg-white dark:bg-gray-900 h-full flex flex-col justify-between">
        <aside
            class="flex flex-col px-7 overflow-y-auto bg-white rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
            
            <img class="w-8/10" :src="data.forecast?.forecastday[0].day.condition.icon" alt="condition icon">

            <div class="flex content-start pb-4">
                <p class="text-7xl">{{ data.current?.temp_c }}</p>
                <p class="text-4xl">&degC</p>
            </div>

            <p class="mb-4">Current Date, 12:00 pm</p>

            <hr class="mb-4 border-gray-200 dark:border-gray-600" />

            <!-- :src="data.forecast.forecastday[0].day.condition.icon" -->

            <div class="flex items-center mb-4">
                <img class="me-2" :src="data.current?.condition.icon" alt="">
                <p>{{ data.forecast?.forecastday[0].day.condition.text }}</p>
            </div>

            <div class="flex items-center mb-4">
                <img class="me-2" :src="data.current?.condition.icon" alt="">
                <p>Rain - {{ data.forecast?.forecastday[0].day.daily_chance_of_rain }}%</p>
            </div>

        </aside>
        <div
            class="flex justify-center items-center py-10 px-6 rounded-4xl bg-lime-700 bg-cover m-4"
            :style="{ backgroundImage: `url(${photo})` }">
            <p class="font-bold">{{ data.location?.name }}</p>
        </div>
    </div>

</template>