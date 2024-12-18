
const host = import.meta.env.VITE_API_HOST || 'localhost'
const port = import.meta.env.VITE_API_PORT || '3000'
export const baseURL = `https://${host}:${port}`

