const baseUrl = process.env.BASE_URL

export const getBaseUrl = () =>
  typeof baseUrl === 'string' ? baseUrl : 'http://localhost:3000'
