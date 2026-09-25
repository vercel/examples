import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

const weatherResponseSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
  }),
})

const handler = createMcpHandler((server) => {
  server.registerTool(
    'roll_dice',
    {
      title: 'Roll Dice',
      description: 'Roll an N-sided die',
      inputSchema: z
        .object({
          sides: z.number().int().min(2).max(100),
        })
        .strict(),
      outputSchema: z
        .object({
          value: z.number().int(),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ sides }) => {
      const value = 1 + Math.floor(Math.random() * sides)
      return {
        content: [{ type: 'text', text: `🎲 You rolled a ${value}!` }],
        structuredContent: { value },
      }
    }
  )
  server.registerTool(
    'get_weather',
    {
      title: 'Get Weather',
      description: 'Get the current weather at a location',
      inputSchema: z
        .object({
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
          city: z.string().min(1).max(100),
        })
        .strict(),
      outputSchema: z
        .object({
          city: z.string(),
          temperatureC: z.number(),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ latitude, longitude, city }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
      )

      if (!response.ok) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Weather request failed with status ${response.status}. Try again with valid coordinates.`,
            },
          ],
        }
      }

      const weatherData = weatherResponseSchema.parse(await response.json())
      const output = {
        city,
        temperatureC: weatherData.current.temperature_2m,
      }

      return {
        content: [
          {
            type: 'text',
            text: `The weather in ${city} is ${output.temperatureC}°C currently.`,
          },
        ],
        structuredContent: output,
      }
    }
  )
})

export { handler as GET, handler as POST }
