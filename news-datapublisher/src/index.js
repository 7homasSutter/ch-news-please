import Koa from 'koa'
import cors from "@koa/cors"
import {router} from "./api/routes.js";
import {connectRedis, initializeData} from "./services/redisService.js";

const app = new Koa()
app.use(cors({
    origin: 'https://map.dariok.ch'
}))
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running and available at http://localhost:${PORT}/`)
    connectRedis().then(() => {
        console.log("Redis is connected. Initialize Data...")
        return initializeData("resources/worldcities.csv")
    }).then(() => {
        console.log("Initialization completed")
    })
})



