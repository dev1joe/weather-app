<script setup>
import { ref, onMounted, inject } from 'vue';
import * as utils from './utils/dataUtils.js';
import Sidebar from './components/Sidebar.vue';
import DayCard from './components/DayCard.vue';
import CompassChart from './components/CompassChart.vue';
import UVChart from './components/UVChart.vue';
import Header from './components/Header.vue';
import HourCard from './components/HourCard.vue';
import CustomCarousel from './components/CustomCarousel.vue';
import { SwiperSlide } from 'swiper/vue';
import SwiperCarousel from './components/SwiperCarousel.vue';
import ThermometerWaterIcon from 'vue-material-design-icons/ThermometerWater.vue';
import WeatherRainyIcon from 'vue-material-design-icons/WeatherRainy.vue';
import EyeOutlineIcon from 'vue-material-design-icons/EyeOutline.vue';


const originalData = inject('originalData');
const data = inject('data');
const isDarkMode = inject('isDarkMode');
const metric = inject('metric');

const selectedLocation = ref(localStorage.location || 'London');
const dayCount = ref(7);
const showHours = ref(true);
const queryTimeout = ref(null);
const currentHour = (new Date()).getHours() || 12; // Default to 12 if hours are 0 (midnight)

onMounted(() => {
  console.log('App mounted, fetching weather data...');
  console.log('from App component, the location is:', selectedLocation.value);
  // fetchWeather(0);
});
</script>

<template>
  <div class="
    main-container
    max-w-dvw min-h-screen p-4 overflow-y-auto box-border
    bg-gray-100 dark:text-white dark:bg-gray-900
    xl:grid xl:auto-rows-min
    overflow-x-hidden
    xl:grid-cols-[1fr_3fr] xl:overflow-hidden xl:p-0
    ">

    <Header class="!mb-4 xl:col-start-2 xl:px-4" />
    <Sidebar class="
    !p-4 xl:!p-8 rounded-3xl box-border xl:rounded-none
    xl:h-screen xl:col-start-1 xl:col-end-1 xl:row-start-1 xl:row-end-3 
    !bg-white dark:!bg-gray-800 dark:border-gray-700
    " />

    <div class="
    right-content
    box-border md:rounded-3xl
    lg:px-8
    xl:col-start-2
    /* xl:max-h-dvh */
    grid
    bg-inherit
    "> <!-- md:overflow-auto-->

      <!-- upper section of the right container -->

      <!-- Hourly VS Daily Data -->
      <div>
        <button class="bg-transparent border-none mb-4 text-2xl font-bold capitalize text-gray-400"
          @click="showHours = true" :class="{ '!text-black dark:!text-white underline': showHours }">today</button>
        <button class="bg-transparent border-none mb-4 ms-4 text-2xl font-bold capitalize text-gray-400"
          @click="showHours = false" :class="{ '!text-black dark:!text-white underline': !showHours }">this
          week</button>
      </div>

      <!-- Day Cards Section -->
      <div class="mb-6" v-if="!showHours">
        <div class="grid grid-cols-3 xl:grid-cols-7 gap-2">
          <DayCard class="!bg-white dark:!bg-gray-800" v-for="(day, index) in data.forecast?.forecastday" :key="index"
            :day="day.name" :maxtemp="day.maxtemp" :mintemp="day.mintemp" :icon="day.condition.icon" />
        </div>
      </div>

      <!-- Hours Cards Section -->
      <CustomCarousel v-else>
        <HourCard class="bg-white dark:bg-gray-800" v-for="(hour, index) in data.forecast?.forecastday[0].hour"
          :time12="hour.time12" :temp="hour.temp" :icon="hour.condition.icon" :key="index"
          :class="{ '!bg-yellow-400 !text-black': (new Date().getHours()) == index }" />
      </CustomCarousel>

      <!-- <div v-else>
        <SwiperCarousel>
          <swiper-slide v-for="(hour, index) in data.forecast?.forecastday[0].hour" :key="index">
            <HourCard class="bg-white dark:bg-gray-800 !w-full !h-full" :class="{ '!bg-yellow-400 !text-black': (new Date().getHours()) == index }"
              :time12="hour.time12" :time24="hour.time24" :temp="hour.temp" :icon="hour.condition.icon" :key="index"/>
          </swiper-slide>
        </SwiperCarousel>
      </div> -->


      <!-- Highlights section -->
      <div class="highlights xl:overflow-hidden">
        <h1 class="mb-4 ms-4 text-2xl font-bold capitalize">Today's Highlights</h1>

        <!-- cards -->
        <div
          class="big-cards xl:overflow-hidden grid gap-2 *:min-h-0 *:overflow-y-auto md:grid-cols-2 md:grid-rows-4 md:grid-flow-col xl:grid-cols-3 xl:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-flow-row">
          <!-- md:grid-flow-col -->
          <!-- compass Gauge -->
          <div
            class="py-4 px-8 min-h-0 bg-white dark:bg-gray-800 rounded-3xl md:row-span-2 md:flex md:flex-col xl:row-[span_1]">
            <p class="capitalize mb-2">wind status</p>
            <div class="min-h-0">
              <CompassChart :windSpeed="data.current?.wind" :windDegree="data.current?.wind_degree" />
            </div>
          </div>

          <!-- UV index gauge -->
          <div
            class="py-4 px-8 min-h-0 bg-white dark:bg-gray-800 rounded-3xl md:row-span-2 md:flex md:flex-col xl:row-[span_1]">
            <p class="capitalize mb-2">UV index</p>
            <div class="min-h-0">
              <!-- <GaugeChart v-if="typeof data.current?.uv === 'number'" :uvIndex="data.current?.uv" /> -->
              <UVChart :uvIndex="data.current?.uv" />
            </div>
          </div>

          <!-- Sunrise and Sunset -->
          <div class="py-4 px-8 min-h-0 bg-white dark:bg-gray-800 rounded-3xl">
            <p class="capitalize mb-4">Sunrise & Sunset</p>

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

          <!-- Chance of Rain -->
          <div class="py-4 px-8 min-h-0 bg-white dark:bg-gray-800 rounded-3xl">
            <p class="capitalize mb-4">Chance of rain</p>
            <div class="flex justify-between items-center">
              <div class="mb-4 text-6xl">
                <span>{{ data.forecast?.forecastday[0].chance_of_rain }}</span>
                <span class="text-base opacity-70">%</span>
              </div>
              <div class="opacity-70">
                <WeatherRainyIcon />
                <p class="capitalize text-sm">{{ data.forecast?.forecastday[0].chance_of_rain_eval }}</p>
              </div>
            </div>
          </div>

          <!-- Humidity -->
          <div class="py-4 px-8 bg-white dark:bg-gray-800 rounded-3xl">
            <p class="capitalize mb-4">Humidity</p>
            <div class="flex justify-between items-center">
              <div class="mb-4 text-6xl">
                <span>{{ data.current?.humidity }}</span>
                <span class="text-base opacity-70">%</span>
              </div>

              <div class="opacity-70">
                <ThermometerWaterIcon />
                <p class="capitalize text-sm">{{ data.current?.humidity_eval }}</p>
              </div>
            </div>
          </div>

          <!-- Visibility -->
          <div class="py-4 px-8 bg-white dark:bg-gray-800 rounded-3xl">
            <p class="capitalize mb-4">visibility</p>
            <div class="flex justify-between items-center">
              <div class="mb-4 text-6xl">
                <span>{{ data.current?.visibility }}</span>
                <span class="text-base opacity-70">km</span>
              </div>
              <div class="opacity-70">
                <EyeOutlineIcon />
                <p class="capitalize text-sm">{{ data.current?.visibility_eval }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.background-effect {
  background: radial-gradient(circle at 50% 50%,
      rgb(130, 154, 204) 0%,
      /* Slightly lighter in the center */
      rgb(41, 53, 77) 70%,
      /* Transitions to darker */
      rgba(16, 24, 40) 100%
      /* Very dark at the edges */
    );

  .inner-shadow-dark {
    box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.7) !important;
  }
}
</style>