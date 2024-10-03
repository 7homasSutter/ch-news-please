import {redis_client} from "./config"
import Koa from "koa";
import bodyParser from 'koa-bodyparser'
import cors from "@koa/cors"
import {router} from "./routes";
const APP_PORT = 3000

const app = new Koa()

app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(APP_PORT, () => {
    console.log(`Server is running and available at http://localhost:${APP_PORT}/` )
    redis_client.connect().then(() => console.log("Redis is connected")).catch((error) =>console.log("Could not connect to redis: ", error))
})


