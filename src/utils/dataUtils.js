export async function fetchSuggestedLocations(query) {
    if (query.trim() === '') {
        console.warn('Search input is empty');
        return [];
    }

    const response = await fetch(`/api/search-location?location=${encodeURIComponent(query)}`);
    const json = await response.json();

    if (json.length > 0) {
        console.log('Suggested locations:', json);
        return json;
    } else {
        console.warn('No locations found for:', query);
        return [];
    }
}

export async function fetchWeather(location, metric, dayCount = 7) {
    const response = await fetch(`/api/get-weather-data?location=${encodeURIComponent(location)}&dayCount=${encodeURIComponent(dayCount)}`);
    const json = await response.json();
    localStorage.originalData = json;
    console.log('Weather data fetched successfully:', json);

    // Process and return the metric data
    return [json, setMetric(json, metric)];
}

function setMetric(data, metric = 'c') {
    if (metric === 'f') {
        console.log('Using Fahrenheit data');
        localStorage.metric = 'f';

        const metricData = extractData(data, 'f')
        localStorage.data = metricData;
        return metricData;
    } else {
        console.log('Using Celsius data');
        localStorage.metric = 'c';

        const metricData = extractData(data, 'c')
        localStorage.data = metricData;
        return metricData;
    }
}

export function extractData(json, metric = 'c') {
    // current.localTime
    const localTime = new Date(json.location.localtime);
    // const timeString = getDayOfWeek(localTime) + " " + getClockString(localTime, true);

    const tmpString = localTime.toString().split(" ");
    const timeString = `${tmpString[0]}, ${tmpString[1]} ${tmpString[2]}`;

    // current.last_updated
    const lastUpdated = new Date(json.current.last_updated);

    // current.temperature
    const temp = (metric === 'f') ? json.current.temp_f : json.current.temp_c;
    const feelsLike = (metric === 'f') ? json.current.feelslike_f : json.current.feelslike_c;

    // forecast
    // let tmpJson = JSON.parse(JSON.stringify(json)); // deep copy original json

    const forecast = json.forecast.forecastday.map(day => {
        let tempDate = new Date(day.date);

        return {
            hour: day.hour.map(hour => {
                let hourDate = new Date(hour.time);

                return {
                    condition: hour.condition,
                    temp: (metric === 'f') ? Math.floor(hour.temp_f) : Math.floor(hour.temp_c),
                    feelslike: (metric === 'f') ? Math.floor(hour.feelslike_f) : Math.floor(hour.feelslike_c),
                    time12: getClockString(hourDate),
                    time24: getClockString(hourDate, false),
                }
            }),
            name: getDayOfWeek(tempDate),
            maxtemp: (metric === 'f') ? Math.floor(day.day.maxtemp_f) : Math.floor(day.day.maxtemp_c),
            mintemp: (metric === 'f') ? Math.floor(day.day.mintemp_f) : Math.floor(day.day.mintemp_c),
            uv: day.day.uv,
            chance_of_rain: day.day.daily_chance_of_rain,
            chance_of_rain_eval: evaluateRain(day.day.daily_chance_of_rain),
            condition: { ...day.day.condition },
            astro: { ...day.astro },
        }
    });

    console.log('forecast', forecast);

    const result = {
        current: {
            last_updated: getClockString(lastUpdated, true),
            condition: json.current.condition,
            temp: Math.floor(temp),
            feelslike: Math.floor(feelsLike),
            humidity: json.current.humidity,
            humidity_eval: evaluateHumidity(json.current.humidity),
            wind: json.current.wind_kph,
            wind_dir: json.current.wind_dir,
            wind_degree: json.current.wind_degree,
            uv: json.current.uv,
            visibility: json.current.vis_km,
            visibility_eval: evaluateVisibility(json.current.vis_km),
        },
        location: {
            name: json.location.name,
            country: json.location.country,
            region: json.location.region,
            localtime: timeString,
        },
        forecast: {
            forecastday: forecast,
        }
    };

    // tmpJson = null;
    console.log('Extracted data:', result);
    return result;
}

function getDayOfWeek(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function getClockString(date, hour12 = true,  minutes = false) {
    let options = { hour: '2-digit', hour12 };

    if (minutes) {
        options.minute = '2-digit';
    }

    return date.toLocaleTimeString([], options);
}

function evaluateHumidity(humidity) {
    if (humidity <= 20) {
        return 'Very Dry';
    } else if (humidity <= 40) {
        return 'Dry';
    } else if (humidity <= 60) {
        return 'Comfortable';
    } else if (humidity <= 80) {
        return 'Humid';
    } else {
        return 'Very Humid';
    }
}

function evaluateVisibility(visibility) {
    // visibility is in km
    if (visibility <= 1) {
        return 'Very Low';
    } else if (visibility <= 4) {
        return 'Light Fog or Mist';
    } else if (visibility <= 10) {
        return 'Good, \Slightly Hazy';
    } else {
        return 'Clear';
    }
}

function evaluateRain(rainChance) {
    if (rainChance == 0) {
        return 'No Chance'
    } else if (rainChance <= 10) {
        return 'very low chance';
    } else if (rainChance <= 30) {
        return 'slight chance';
    } else if (rainChance <= 60) {
        return 'probably going to rain';
    } else if (rainChance <= 80) {
        return 'high chance of rain';
    } else {
        return 'almost certain';
    }
}

export async function fetchPhoto(query, orientation = 'landscape') {
    // let photoQuery = `${data.value.location?.name}, ${data.value.location?.country}`;
    console.log('Fetching photo for query:', query);
    let photoResponse = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${import.meta.env.VITE_UNSPLASH_API}&per_page=1&orientation=${orientation}`);

    if (photoResponse.ok) {
        let photoJson = await photoResponse.json();
        return photoJson.results[0].urls.regular;
    } else {
        throw new Error(`Error fetching photo: ${photoResponse.statusText}`);
    }
}