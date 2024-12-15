
const host = import.meta.env.VITE_API_HOST || 'localhost'
const port = import.meta.env.VITE_API_PORT || '3000'
console.log(import.meta.env.VITE_API_HOST, import.meta.env.VITE_API_PORT)
export const baseURL = `http://${host}:${port}`

