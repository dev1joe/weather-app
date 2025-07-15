import fetch from 'node-fetch';

exports.handler = async function (event, context) {
    // API key from environment variables
    const WEATHER_API = process.env.WEATHER_API;

    // Request Parameters
    const location = event.queryStringParameters.location || 'London, UK';


    try {
        const locationResponse = await fetch(`https://api.weatherapi.com/v1/search.json?key=${WEATHER_API}&q=${location}`);
        const locationData = await locationResponse.json();

        // Check for WeatherAPI errors
        if (locationData.error) {
            console.error("WeatherAPI Error:", locationData.error.message);
            return {
                statusCode: locationData.error.code === 1003 ? 404 : 500, // 1003 is "No matching location found"
                body: JSON.stringify({ error: `Weather data error: ${locationData.error.message}` }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                // It's good practice to set CORS headers for functions
                'Access-Control-Allow-Origin': '*', // Allows all origins, adjust for production
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(locationData),
        };

    } catch (error) {
        console.error('Error in Netlify Function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error while fetching data.' }),
        };
    }
}
