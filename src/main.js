import { createApp, ref } from 'vue'
import './style.css'
import App from './App.vue'
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(VueApexCharts);

const originalData = ref(localStorage.originalData || {});
const data = ref(localStorage.data || []);

const isDarkMode = ref(localStorage.theme === "dark");
const image = ref(localStorage.photo || '');

const selectedLocation = ref(localStorage.location || 'London');
const metric = ref(localStorage.metric || 'c');
const dayCount = ref(7);

const showHours = ref(true);
const hourlyScrollRef = ref(null);
const queryTimeout = ref(null);

app.provide('originalData', originalData);
app.provide('data', data);
app.provide('isDarkMode', isDarkMode);
app.provide('image', image);
app.provide('metric', metric);
app.provide('selectedLocation', selectedLocation);
app.provide('dayCount', dayCount);

app.mount('#app');
