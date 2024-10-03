import path from "path";
import fs from 'fs';

import {InterpretedLocation, LocationValue, Word} from "../../types/types"

import {removePunctuation, saveFile, wordStartsWithCapitalLetter} from "./utils";
import {getValue, saveKeyValue} from "./redisService";
import {LocationType, Municipality, Street, Village} from "../model/locationType";
import * as readline from "node:readline";

export async function handleDirectoryUpload(locationType: LocationType, bufferData: Buffer,) {
    const saveAs = path.join(__dirname, '..', '..', 'data', `${locationType.getName()}.csv`)
    const success = saveFile(saveAs, bufferData)
    if (!success) {
        return false
    }

    saveFileContentToRedis(saveAs, locationType).then((numberElementsAdded: number) => {
        console.log(`added ${numberElementsAdded} ${locationType.getName()} to redis!`)
    }).catch(error =>{
        console.log(error)
    })
    return true
}

async function saveFileContentToRedis(filePath: string, locationType: LocationType): Promise<number> {
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })
    let isHeader = true
    let counter = 0
    for await (const data of rl) {
        if (isHeader) {
            isHeader = false
            continue
        }
        const row = data.split(";")
        const value: LocationValue = locationType.rowParser(row).value
        // we want to have a lookup table with keys consisting of only one word keys
        // (if it's not a multiWord Location, mostSignificant.key is equals to key)
        await saveKeyValue(locationType.getName(), value.mostSignificant.key, JSON.stringify(value))
        counter++
        if(counter % 5000 === 0){
            console.log("added", counter, locationType.getName() ,'...')
        }
    }
    return counter
}

export async function findLocationsInText(text: string): Promise<InterpretedLocation[]> {
    const list = text
        .split(" ")
        .map(removePunctuation)
        .map((value: string, index: number) => ({position: index, value: value}))
        .filter(wordStartsWithCapitalLetter)
    return findLocationsInList(list)
}

async function findLocationsInList(list: Word[]): Promise<InterpretedLocation[]> {
    const collector = new Collector()
    await Promise.all(list.map(word => collectLocation(word, collector, [Municipality.get(), Street.get(), Village.get()])))
    return collector.locations

}

async function collect(searchKey: string, locationType: LocationType): Promise<LocationValue[]> {
    const results = await getValue(locationType.getName(), searchKey)
    if (results === null) {
        return []
    }
    return results.map(result => JSON.parse(result))
}

async function collectLocation(location: Word, collector: Collector, useLocationTypes: LocationType[]): Promise<void> {
    const results = await Promise.all(useLocationTypes.map(locationType => collect(location.value, locationType)))
    if (!results.flat().length) {
        return
    }

    const foundLocations = {}

    results.forEach((result: LocationValue[], index: number) => {
        foundLocations[useLocationTypes[index].getName()] = result
    })

    const interpretedWord: InterpretedLocation = {
        ...location,
        results: foundLocations
    }

    collector.add(interpretedWord)
}


class Collector {
    private _locations: InterpretedLocation[] = []

    add(word: InterpretedLocation) {
        this._locations.push(word)
    }

    get locations(): InterpretedLocation[] {
        return this._locations;
    }
}

