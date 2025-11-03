import express from 'express'
import { z } from 'zod'
import { createMcpHandler } from 'mcp-handler'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// ============================================
// EXISTING EXPRESS WEATHER API
// ============================================

app.get('/api/weather/:city', async (req, res) => {
  try {
    const city = req.params.city
    const units = req.query.units as string | undefined

    // Normalize units parameter
    const normalizedUnits = units === 'imperial' ? 'imperial' : 'metric'

    // Step 1: Geocode city to get coordinates
    const geoParams = new URLSearchParams({
      name: city,
      count: '1',
      language: 'en',
      format: 'json',
    })

    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${geoParams}`
    )

    if (!geoResponse.ok) {
      return res.status(geoResponse.status).json({
        error: 'Failed to fetch geocoding data',
      })
    }

    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: `City '${city}' not found` })
    }

    const location = geoData.results[0]
    const { name, country, latitude, longitude } = location

    // Step 2: Fetch current weather data
    const weatherParams: Record<string, string> = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m',
      timezone: 'auto',
    }

    // Add unit parameters for imperial if needed
    if (units === 'imperial') {
      weatherParams.temperature_unit = 'fahrenheit'
      weatherParams.wind_speed_unit = 'mph'
    }

    const weatherUrlParams = new URLSearchParams(weatherParams)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?${weatherUrlParams}`
    )

    if (!weatherResponse.ok) {
      return res.status(weatherResponse.status).json({
        error: 'Failed to fetch weather data',
      })
    }

    const weatherData = await weatherResponse.json()

    // Return structured weather data
    res.json({
      city: name,
      country,
      latitude,
      longitude,
      units: normalizedUnits,
      current: weatherData.current,
    })
  } catch (error) {
    console.error('Weather API error:', error)
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// ============================================
// HELPER: Call our own Express API
// ============================================

async function callWeatherAPI(
  city: string,
  units: 'metric' | 'imperial' = 'metric'
) {
  const response = await fetch(
    `http://localhost:${PORT}/api/weather/${city}?units=${units}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch weather')
  }

  return await response.json()
}

// ============================================
// MCP SERVER - Uses Express API as backend
// ============================================

const mcpHandler = createMcpHandler(
  (server) => {
    // Tool 1: Get Temperature
    server.tool(
      'get_temperature',
      'Get current temperature and "feels like" temperature for a city',
      {
        city: z.string().describe('City name (e.g., "London", "Tokyo")'),
        units: z
          .enum(['metric', 'imperial'])
          .optional()
          .describe('metric (Celsius) or imperial (Fahrenheit)'),
      },
      async ({ city, units = 'metric' }) => {
        try {
          const data = await callWeatherAPI(city, units)
          const tempUnit = units === 'imperial' ? '°F' : '°C'

          return {
            content: [
              {
                type: 'text',
                text: `Temperature in ${data.city}, ${data.country}:
- Current: ${data.current.temperature_2m}${tempUnit}
- Feels like: ${data.current.apparent_temperature}${tempUnit}`,
              },
            ],
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
            isError: true,
          }
        }
      }
    )

    // Tool 2: Get Humidity
    server.tool(
      'get_humidity',
      'Get current relative humidity for a city',
      {
        city: z.string().describe('City name (e.g., "London", "Tokyo")'),
      },
      async ({ city }) => {
        try {
          const data = await callWeatherAPI(city, 'metric')

          return {
            content: [
              {
                type: 'text',
                text: `Humidity in ${data.city}, ${data.country}:
- Relative Humidity: ${data.current.relative_humidity_2m}%`,
              },
            ],
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
            isError: true,
          }
        }
      }
    )

    // Tool 3: Get Wind Speed
    server.tool(
      'get_wind_speed',
      'Get current wind speed for a city',
      {
        city: z.string().describe('City name (e.g., "London", "Tokyo")'),
        units: z
          .enum(['metric', 'imperial'])
          .optional()
          .describe('metric (km/h) or imperial (mph)'),
      },
      async ({ city, units = 'metric' }) => {
        try {
          const data = await callWeatherAPI(city, units)
          const speedUnit = units === 'imperial' ? 'mph' : 'km/h'

          return {
            content: [
              {
                type: 'text',
                text: `Wind Speed in ${data.city}, ${data.country}:
- Current: ${data.current.wind_speed_10m} ${speedUnit}`,
              },
            ],
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
            isError: true,
          }
        }
      }
    )

    // Tool 4: Get Full Weather
    server.tool(
      'get_full_weather',
      'Get complete weather information for a city',
      {
        city: z.string().describe('City name (e.g., "London", "Tokyo")'),
        units: z
          .enum(['metric', 'imperial'])
          .optional()
          .describe('metric or imperial units'),
      },
      async ({ city, units = 'metric' }) => {
        try {
          const data = await callWeatherAPI(city, units)
          const tempUnit = units === 'imperial' ? '°F' : '°C'
          const speedUnit = units === 'imperial' ? 'mph' : 'km/h'

          return {
            content: [
              {
                type: 'text',
                text: `Weather for ${data.city}, ${data.country}:

📍 Location: ${data.latitude}, ${data.longitude}
🌡️ Temperature: ${data.current.temperature_2m}${tempUnit} (feels like ${data.current.apparent_temperature}${tempUnit})
💧 Humidity: ${data.current.relative_humidity_2m}%
💨 Wind: ${data.current.wind_speed_10m} ${speedUnit}
🕐 Updated: ${data.current.time}`,
              },
            ],
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
            isError: true,
          }
        }
      }
    )
  },
  {},
  { basePath: '/api' }
)

// Helper: Convert Express req to Web Request
function toWebRequest(req: express.Request): Request {
  const url = `http://${req.headers.host}${req.url}`
  return new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : undefined,
  })
}

// Mount MCP handler on Express routes with proper conversion
app.all('/api/mcp', async (req, res) => {
  try {
    const webRequest = toWebRequest(req)
    const webResponse = await mcpHandler(webRequest)

    // Convert Web Response back to Express response
    res.status(webResponse.status)
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    const body = await webResponse.text()
    res.send(body)
  } catch (error) {
    console.error('MCP handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Express + MCP Weather Server',
    endpoints: {
      weather: '/api/weather/:city?units=metric|imperial',
      mcp: '/api/mcp',
    },
    tools: [
      'get_temperature',
      'get_humidity',
      'get_wind_speed',
      'get_full_weather',
    ],
  })
})

export default app
