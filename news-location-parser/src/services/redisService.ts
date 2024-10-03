import {redis_client} from "../config";

export async function saveKeyValue(category: string, key: string, value: any) {
    const obj = {}
    const alreadySavedValues = await getValue(category, key)
    if (alreadySavedValues === null) {
        obj[key] = JSON.stringify([value])
    } else {
        if(alreadySavedValues.includes(value)){
            return
        }
        obj[key] = JSON.stringify([...alreadySavedValues, value])
    }
    await redis_client.hSet(category, obj)
}

export async function getValue(category: string, key: string): Promise<string[]> {
    const res = await redis_client.hGet(category, key)
    return JSON.parse(res)
}

export async function deleteAllRedisData(): Promise<string>{
    return await redis_client.flushDb()
}
