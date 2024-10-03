import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redis_client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10)
    }
});


