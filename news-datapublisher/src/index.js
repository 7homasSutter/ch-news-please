import Koa from 'koa'
import cors from "@koa/cors"
import {router} from "./api/routes.js";
import {connectRedis, initializeData} from "./services/redisService.js";
import fs from "fs";
import https from 'https'
import dotenv from "dotenv";

dotenv.config()


const app = new Koa()
app.use(cors({
    origin: 'https://map.dariok.ch'
}))
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = 3000

const pathToCert = process.env.CERT
const pathToPrivateKey = process.env.PRIVATE_KEY

if (!pathToCert || !pathToPrivateKey) {
    console.log("Please provide a certificate and a private key to enable https.")
    app.listen(PORT, () => {
        handleServerStart(false)
    })
} else {
    const options = {
        key: fs.readFileSync(pathToPrivateKey),
        cert: fs.readFileSync(pathToCert)
    }
    https.createServer(options, app.callback()).listen(PORT, () => {
        handleServerStart(true)
    })
}


function handleServerStart(isHttps) {
    console.log(`Server is running and available at ${isHttps? 'https' : 'http'}://localhost:${PORT}/`)
    connectRedis().then(() => {
        console.log("Redis is connected. Initialize Data...")
        return initializeData("resources/worldcities.csv")
    }).then(() => {
        console.log("Initialization completed")
    })
}





