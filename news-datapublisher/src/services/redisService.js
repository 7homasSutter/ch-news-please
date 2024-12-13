import {createClient} from 'redis'
import * as readline from "node:readline";
import dotenv from 'dotenv';
import fs from "fs";
import {sleep} from "../utils/utils.js";

dotenv.config();

const redis_client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10)
    }
})

export async function connectRedis() {
    while (true) {
        try {
            await redis_client.connect()
            return
        } catch (error) {
            const pause = 5000
            await redis_client.disconnect()
            console.log("Could not connect to redis: ", error)
            console.log("Try reconnect in ", pause, "ms...")
            await sleep(pause)
        }

    }
}


export async function initializeData(pathToCsvFile) {
    await redis_client.flushDb()
    const fileStream = fs.createReadStream(pathToCsvFile)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })
    let isHeader = true
    let counter = 0
    for await (const rawRow of rl) {
        if (isHeader) {
            isHeader = false
            continue
        }
        const city = parseRow(rawRow)
        await addElement(city.city, city)

        if (city.city !== city.cityAscii) {
            await addElement(city.cityAscii, city)
        }

        if (counter % 5000 === 0) {
            console.log("initialized ", counter, "lines")
        }
        counter++
    }
}

export async function getByKey(key) {
    const jsonResult  = await redis_client.get(key)
    return JSON.parse(jsonResult)
}

async function addElement(key, city) {
    const alreadyExists = await redis_client.exists(key)
    if (alreadyExists) {
        const savedCity = await getByKey(key)
        if (savedCity.population > city.population) {
            return
        }
    }
    redis_client.set(key, JSON.stringify({
        position: city.position,
        population: city.population,
        country: city.country
    }))

}

function parseRow(rawLine) {
    const row = rawLine.replaceAll('"', "").split(",")
    return {
        city: row[0],
        cityAscii: row[1],
        country: row[4],
        adminName: row[7],
        population: Number(row[9]),
        position: `{"lat": ${row[2]}, "lng": ${row[3]}}`
    }
}
