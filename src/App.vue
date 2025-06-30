<script setup>
import { ref, onMounted, isReadonly } from 'vue';
import * as utils from './utils/dataUtils.js';
import Sidebar from './components/Sidebar.vue';
import DarkModeSwitch from './components/DarkModeSwitch.vue';
import DayCard from './components/DayCard.vue';

const data = ref(localStorage.data || []);
const selectedLocation = ref(localStorage.location || 'London');
const dayCount = ref(7);
const isDarkMode = ref(localStorage.theme === "dark");
const metric = ref(localStorage.metric || 'c');
const showHours = ref(true);
const hourlyScrollRef = ref(null);

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

// slider
function scrollHours(direction) {
  const el = hourlyScrollRef.value;
  if (!el) return;
  const scrollAmount = 200; // px per click
  el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}
</script>

<template>
  <div class="main-container w-dvw h-dvh grid grid-cols-[1fr_3fr] dark:text-white">
    <Sidebar v-model:data="data" v-model:metric="metric" :dayCount="dayCount" />

    <div class="right-content bg-gray-100 dark:bg-gray-700 px-8">

      <!-- upper section of the right container -->
      <div class="upper mt-4 flex justify-between items-center">
        <div>
          <button class="bg-transparent border-none mb-4 text-2xl font-bold capitalize text-gray-400"
            @click="showHours = true" :class="{ '!text-black dark:!text-white underline': showHours }">today</button>
          <button class="bg-transparent border-none mb-4 ms-4 text-2xl font-bold capitalize text-gray-400"
            @click="showHours = false" :class="{ '!text-black dark:!text-white underline': !showHours }">this
            week</button>
        </div>

        <div class="ms-auto flex items-center gap-2">
          <DarkModeSwitch :darkMode="isDarkMode" @change="toggleTheme" />
          <button type="button" @click="useCelsius" class="rounded-4xl size-8 text-center"
            :class="[(metric === 'c') ? 'bg-yellow-300 text-black' : 'bg-white dark:bg-gray-900']">&deg;C</button>
          <button type="button" @click="useFahrenheit" class="rounded-4xl size-8 text-center"
            :class="[(metric === 'f') ? 'bg-yellow-300 text-black' : 'bg-white dark:bg-gray-900']">&deg;F</button>
        </div>
      </div>

      <!-- Day Cards Section -->
      <div class="mb-6" v-if="!showHours">
        <div class="grid grid-cols-7 gap-2">
          <DayCard v-for="(day, index) in data.forecast?.forecastday" :key="index" :day="day.name"
            :maxtemp="day.maxtemp" :mintemp="day.mintemp" :icon="day.condition.icon" />
        </div>
      </div>

      <!-- Hours Cards Section -->
      <div class="mb-6 w-full" v-else>
        <div class="relative" style="max-width: 70vw;">
          
          <!-- Left Button -->
          <button @click="scrollHours(-1)"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full shadow size-8"
            style="transform: translate(-70%, -20%);" aria-label="Scroll left">
            &#8592;
          </button>
          
          <!-- Right Button -->
          <button @click="scrollHours(1)"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full shadow size-8"
            style="transform: translate(70%, -20%);" aria-label="Scroll right">
            &#8594;
          </button>
          
          <div ref="hourlyScrollRef" class="overflow-x-auto w-full scrollbar-hide" style="max-width: 70vw;">
            <div class="min-w-max flex gap-2 mb-2">
              <div v-for="(hour, index) in data.forecast?.forecastday[0].hour" :key="index"
                class="inline-block p-4 bg-white dark:bg-gray-900 rounded-3xl text-center" style="min-width: 100px;">
                <p class="">{{ hour?.time }}</p>
                <img class="mx-auto" :src="hour.condition?.icon" alt="condition icon">
                <p class="text-2xl">{{ hour?.temp }}&deg;</p>
              </div>
            </div>
          </div>

        </div>
      </div>


      <!-- Highlights section -->
      <div class="highlights">
        <h1 class="mb-4 ms-4 text-2xl font-bold capitalize">Today's Highlights</h1>

        <!-- cards -->
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">wind status</p>
            <p class="mb-4"><span class="text-6xl">{{ data.current?.wind }}</span> km/h</p>
            <p>{{ data.current?.wind_dir }}</p>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">Humidity</p>
            <p class="mb-4"><span class="text-6xl">{{ data.current?.humidity }}</span> %</p>
            <p>Normal</p>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">Sunrise & Sunset</p>

            <div class="h-10 flex items-center mb-4">
              <div class="inline-block size-9 rounded-4xl text-center me-2 text-3xl bg-gray-100 dark:bg-gray-700">&uarr;
              </div>
              <span class="text-xl">{{ data.forecast?.forecastday[0].astro.sunrise }}</span>
            </div>

            <div class="h-10 flex items-center mb-4">
              <div class="inline-block size-9 rounded-4xl text-center me-2 text-3xl bg-gray-100 dark:bg-gray-700">&darr;
              </div>
              <span class="text-xl">{{ data.forecast?.forecastday[0].astro.sunset }}</span>
            </div>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">UV index</p>
            <p class="text-6xl mb-4 text-center">{{ data.current?.uv }}</p>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">visibility</p>
            <p class="mb-4"><span class="text-6xl">{{ data.current?.visibility }}</span> km</p>
            <p>Average</p>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">Chance of rain</p>
            <p class="mb-4"><span class="text-6xl">{{ data.forecast?.forecastday[0].daily_chance_of_rain }}</span> %
            </p>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<!-- <div class="grid grid-cols-3">
  <Card />
  <Card />
  <Card />
</div> -->

<!-- <div v-if="data.current" class="grid grid-cols-2 gap-4 justify-center justify-items-center items-center pb-4">
    <div class="w-full"><img :src="data?.current.condition.icon" alt="" class="w-1/2"></div>
    <div class="w-full"><h1 class="text-9xl">{{ data?.current.temp_c }}</h1></div>
    <div class="w-full text-3xl"><p>{{  data?.current.condition.text }}</p></div>
    <div class="w-full text-3xl"><p>{{ data?.location.name }}, {{ data.location.country }}</p></div>
  </div>

  <div v-else>Loading Weather data....</div> -->