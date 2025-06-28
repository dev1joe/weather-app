export async function fetchWeather(location, dayCount) {
    console.log('Fetching weather data for:', location);

    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${location}&days=${dayCount}`);

    if (response.ok) {
        let json = await response.json();
        return json;
        // data.value = json;
        // await fetchPhoto();
    } else {
        // console.log('Error fetching weather data:', response.statusText);
        throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
}

export function extractData(json, metric = 'c') {
    // current.localtime
    const localtime = new Date(json.location.localtime);    
    const timeString = getDayOfWeek(localtime) + " " + getClockString(localtime, true);

    // current.last_updated
    const lastUpdated = new Date(json.current.last_updated);

    // current.temperature
    const temp = (metric === 'f')? json.current.temp_f : json.current.temp_c;
    const feelsLike = (metric === 'f')? json.current.feelslike_f : json.current.feelslike_c;    
    
    // forecast
    // let tmpJson = JSON.parse(JSON.stringify(json)); // deep copy original json
    
    const forecast = json.forecast.forecastday.map(day => {
        let tempDate = new Date(day.date);

        return {
            hour: day.hour.map(hour => {
                let hourDate = new Date(hour.time);

                return {
                    condition: hour.condition,
                    temp: (metric === 'f')? Math.floor(hour.temp_f) : Math.floor(hour.temp_c),
                    feelslike: (metric === 'f')? Math.floor(hour.feelslike_f) : Math.floor(hour.feelslike_c),
                    time: getClockString(hourDate),
                }
            }),
            name: getDayOfWeek(tempDate),
            maxtemp: (metric === 'f')? Math.floor(day.day.maxtemp_f) : Math.floor(day.day.maxtemp_c),
            mintemp: (metric === 'f')? Math.floor(day.day.mintemp_f) : Math.floor(day.day.mintemp_c),
            uv: day.day.uv,
            daily_chance_of_rain: day.day.daily_chance_of_rain,
            condition: {...day.day.condition},
            astro: {...day.astro},
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
            wind: json.current.wind_kph,
            uv: json.current.uv,
            visibility: json.current.vis_km,
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

function getClockString(date, minutes=false) {
    let queryObject = { hour: '2-digit'}
    
    if(minutes) {
        queryObject.minute = '2-digit';
    }

    return date.toLocaleTimeString([], queryObject)
}

export async function fetchPhoto(query, orientation='landscape') {
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