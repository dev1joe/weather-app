<script setup>
import Card from './components/Card.vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { ref, onMounted } from 'vue';

const data = ref([]);
const photo = ref('');
const selectedLocation = ref('London');
const dayCount = ref(7);

async function fetchWeather() {
  console.log('Fetching weather data for:', selectedLocation.value);

  let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${selectedLocation.value}&days=${dayCount.value}`);
  
  if (response.ok) {
    let json = await response.json();
    data.value = json;

    await fetchPhoto();
    console.log('Weather data fetched successfully:', data.value);
  } else {
    console.log('Error fetching weather data:', response.statusText);
  }
}

async function fetchPhoto() {
  let photoQuery = `${data.value.location?.name}, ${data.value.location?.country}`;
  console.log('Fetching photo for query:', photoQuery);
  let photoResponse = await fetch(`https://api.unsplash.com/search/photos?query=${photoQuery}&client_id=${import.meta.env.VITE_UNSPLASH_API}&per_page=1&orientation=landscape`);

  if (photoResponse.ok) {
    let photoJson = await photoResponse.json();
    photo.value = photoJson.results[0].urls.regular;
    console.log('Photo data fetched successfully:', photoJson);
  } else {
    console.log('Error fetching photo:', photoResponse.statusText);
  }
}

onMounted(() => {
  console.log(import.meta.env.VITE_WEATHER_API);
  console.log('App mounted, fetching weather data...');
  console.log('from App component, the location is:', selectedLocation.value);
  fetchWeather();
});
</script>

<template>
  <div class="main-container w-dvw h-dvh grid grid-cols-[1fr_4fr]">

    <Sidebar :data="data" :photo="photo" :location="selectedLocation" />

    <div class="right-content bg-gray-100 dark:bg-gray-700 p-4">

      <div class="upper my-4">
        <input type="text"
          class="w-full mb-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          placeholder="e.g. London" v-model="selectedLocation" @input="fetchWeather" />
      </div>

      <!-- Cards Section -->
      <!-- TODO: convert to card component -->
      <div class="week-weather mb-4">
        <h1 class="mb-4 ms-4 text-3xl font-bold capitalize">this week</h1>
        <div class="grid grid-cols-7 gap-2">
          <div class="card bg-white dark:bg-gray-900 rounded-3xl text-sm" v-for="(day, index) in data.forecast?.forecastday"
            :key="index">
            <p class="mb-2">{{ day.date }}</p>
            <img class="mb-2" :src="day.day.condition.icon" alt="condition icon">
            <p>
              <span>{{ day.day.maxtemp_c }}&deg</span>
              <span class="ms-1 text-gray-400">{{ day.day.mintemp_c }}&deg</span>
            </p>
          </div>
        </div>
      </div>

      <!-- TODO: Highlights section -->
      <div class="highlights mb-4">
        <h1 class="mb-4 ms-4 text-3xl font-bold capitalize">Today's Highlights</h1>
        <div class="grid grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">wind status</p>
            <h1>{{ data.current?.wind_mph }}</h1>
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