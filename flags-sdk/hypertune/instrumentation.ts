import { registerOTel } from '@vercel/otel'
import { setTracerProvider as setEdgeConfigTracerProvider } from '@vercel/edge-config'
import { setTracerProvider as setFlagsTracerProvider } from 'flags'
import { trace } from '@opentelemetry/api'

export function register() {
  registerOTel('hypertune')
  setEdgeConfigTracerProvider(trace)
  setFlagsTracerProvider(trace)
}
