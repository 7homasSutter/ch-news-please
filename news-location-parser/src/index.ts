import {redis_client} from "./config"
import Koa from "koa";
import bodyParser from 'koa-bodyparser'
import cors from "@koa/cors"
import {router} from "./routes";
import {sleep} from "./services/utils";
const APP_PORT = 3000

const app = new Koa()

app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(APP_PORT, () => {
    console.log(`Server is running and available at http://localhost:${APP_PORT}/` )
    connectRedis().then(() =>console.log("Redis is connected"))
})

async function connectRedis(){
    while(true){
        try {
            await redis_client.connect()
            return
        } catch (error){
            const pause = 5000
            await redis_client.disconnect()
            console.log("Could not connect to redis: ", error)
            console.log("Try reconnect in ", pause, "ms...")
            await sleep(pause)
        }

    }
}
