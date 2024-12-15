
const host = process.env.REACT_APP_API_HOST || 'localhost'
const port = process.env.REACT_APP_API_PORT || '3000'
console.log(process.env.REACT_APP_API_HOST, process.env.REACT_APP_API_PORT)
export const baseURL = `http://${host}:${port}`

