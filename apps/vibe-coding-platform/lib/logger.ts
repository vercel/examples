import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'

// Create the logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
})

// Security event logger
export const securityLogger = logger.child({ module: 'security' })

// API event logger
export const apiLogger = logger.child({ module: 'api' })

// Auth event logger
export const authLogger = logger.child({ module: 'auth' })

// Log types for security events
export type SecurityEventType =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'registration'
  | 'password_change'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'unauthorized_access'
  | 'csrf_violation'

export interface SecurityEvent {
  type: SecurityEventType
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  path?: string
  metadata?: Record<string, unknown>
}

export function logSecurityEvent(event: SecurityEvent) {
  const { type, ...data } = event

  switch (type) {
    case 'login_failure':
    case 'rate_limit_exceeded':
    case 'suspicious_activity':
    case 'unauthorized_access':
    case 'csrf_violation':
      securityLogger.warn({ type, ...data }, `Security event: ${type}`)
      break
    default:
      securityLogger.info({ type, ...data }, `Security event: ${type}`)
  }
}

// Log API requests
export interface APILogData {
  method: string
  path: string
  statusCode: number
  duration: number
  userId?: string
  ip?: string
  userAgent?: string
  error?: string
}

export function logAPIRequest(data: APILogData) {
  const level = data.statusCode >= 500 ? 'error' : data.statusCode >= 400 ? 'warn' : 'info'
  apiLogger[level](data, `${data.method} ${data.path} ${data.statusCode} ${data.duration}ms`)
}

// Log auth events
export function logAuthEvent(
  event: 'signin' | 'signout' | 'register' | 'error',
  data: { userId?: string; email?: string; provider?: string; error?: string }
) {
  if (event === 'error') {
    authLogger.error(data, `Auth error: ${data.error}`)
  } else {
    authLogger.info(data, `Auth event: ${event}`)
  }
}

export default logger
