import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

const handler = createMcpHandler((server) => {
  server.tool(
    'roll_dice',
    'Rolls an N-sided die',
    { sides: z.number().int().min(2) },
    async ({ sides }) => {
      const value = 1 + Math.floor(Math.random() * sides)
      return {
        content: [{ type: 'text', text: `🎲 You rolled a ${value}!` }],
      }
    }
  )
  server.tool(
    'get_weather',
    'Get the current weather at a location',
    {
      latitude: z.number(),
      longitude: z.number(),
      city: z.string(),
    },
    async ({ latitude, longitude, city }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      )
      const weatherData = await response.json()
      return {
        content: [
          {
            type: 'text',
            text: `The weather in ${city} is ${weatherData.current_weather.temperature}°C currently.`,
          },
        ],
      }
    }
  )
})

export { handler as GET, handler as POST, handler as DELETE }
