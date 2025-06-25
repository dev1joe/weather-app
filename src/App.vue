<script setup>
import Card from './components/Card.vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { ref, onMounted } from 'vue';

const data = ref([]);
const photo = ref('');
const selectedLocation = ref('London');
const dayCount = ref(7);


/* TODO: Celsius VS Fahrenheit
* get data from api result
* extract celsius data in data_c and fahrenheit data in data_f
* set data to data_c automatically
* add C and F buttons
* add event listener to C and F buttons
* onclick switch data to either data_c or data_f
*/

// TODO: weather evaluation e.g. average UV index, low visibility, etc..
// TODO: add a loading state
// TODO: custom icons


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
  <!-- TODO: add dark/light mode switch -->
  <div class="main-container w-dvw h-dvh grid grid-cols-[1fr_3fr]">

    <!-- TODO: pass only pieces of information not the whole data object  -->
    <Sidebar :data="data" :photo="photo" :location="selectedLocation">
      <input type="text"
        class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-2xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
        placeholder="e.g. London" v-model="selectedLocation" @input="fetchWeather" />
    </Sidebar>

    <div class="right-content bg-gray-100 dark:bg-gray-700 px-8">

      <!-- TODO: include a tab for today's timeline -->
      <div class="upper mt-4 grid grid-cols-[1fr_3fr]">
        <h1 class="mb-4 ms-4 text-3xl font-bold capitalize">this week</h1>

        <div class="ms-auto">
          <button type="button" class="bg-black rounded-4xl size-8 text-center ">&deg;C</button>
          <button type="button" class="!bg-white !text-black rounded-4xl size-8 text-center ">&deg;F</button>
        </div>
      </div>

      <!-- Cards Section -->
      <!-- TODO: convert to card component -->
      <div class="week-weather mb-6">
        <div class="grid grid-cols-7 gap-2">
          <div class="day-card p-4 bg-white dark:bg-gray-900 rounded-3xl text-sm text-center"
            v-for="(day, index) in data.forecast?.forecastday" :key="index">
            <p class="mb-2">{{ day.date }}</p>
            <img class="mb-2 mx-auto" :src="day.day.condition.icon" alt="condition icon">
            <p>
              <span>{{ Math.floor(day.day.maxtemp_c) }}&deg;</span>
              <span class="ms-1 text-gray-400">{{ Math.floor(day.day.mintemp_c) }}&deg;</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Highlights section -->
      <div class="highlights">
        <h1 class="mb-4 ms-4 text-3xl font-bold capitalize">Today's Highlights</h1>

        <!-- cards -->
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">wind status</p>
            <p class="mb-4"><span class="text-6xl">{{ data.current?.wind_mph }}</span> km/h</p>
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
              <div class="inline-block size-9 rounded-4xl text-center me-2 text-3xl bg-gray-100 dark:bg-gray-700">&uarr;</div>
              <span class="text-xl">{{ data.forecast?.forecastday[0].astro.sunrise }}</span>
            </div>
            
            <div class="h-10 flex items-center mb-4">
              <div class="inline-block size-9 rounded-4xl text-center me-2 text-3xl bg-gray-100 dark:bg-gray-700">&darr;</div>
              <span class="text-xl">{{ data.forecast?.forecastday[0].astro.sunset }}</span>
            </div>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">UV index</p>
            <p class="text-6xl mb-4 text-center">{{ data.current?.uv }}</p>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">visibility</p>
            <p class="mb-4"><span class="text-6xl">{{ data.current?.vis_km }}</span> km</p>
            <p>Average</p>
          </div>

          <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl ">
            <p class="text-gray-400 capitalize mb-4">Chance of rain</p>
            <p class="mb-4"><span class="text-6xl">{{ data.forecast?.forecastday[0].day.daily_chance_of_rain }}</span> %</p>
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