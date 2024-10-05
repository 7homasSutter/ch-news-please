import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from "path";
import fs from "fs";

dotenv.config();

export const redis_client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10)
    }
});

export const getOrCreateBasePathForLocationData = (): string => {
    const dir = path.join(__dirname, '..', '..', 'data')
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true})
    }
    return dir
}
