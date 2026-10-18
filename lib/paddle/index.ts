import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk'

export function getPaddle() {
  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) {
    throw new Error('PADDLE_API_KEY is not configured')
  }

  const configuredEnvironment = process.env.PADDLE_ENV ?? 'sandbox'
  if (configuredEnvironment !== 'sandbox' && configuredEnvironment !== 'production') {
    throw new Error('PADDLE_ENV must be either "sandbox" or "production"')
  }

  return new Paddle(apiKey, {
    environment: configuredEnvironment === 'production' ? Environment.production : Environment.sandbox,
    logLevel: process.env.NODE_ENV === 'production' ? LogLevel.error : LogLevel.warn,
  })
}

export function getReportPriceId() {
  const priceId = process.env.PADDLE_REPORT_PRICE_ID
  if (!priceId) {
    throw new Error('PADDLE_REPORT_PRICE_ID is not configured')
  }
  return priceId
}
