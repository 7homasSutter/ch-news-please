import {LocationMultiWord, LocationValue} from "../../types/types";

export abstract class LocationType {
    abstract rowParser: (row: string[]) => { key: string, value: LocationValue }
    abstract getName: () => string

    isMultiWord(word: string): boolean {
        return word.split(" ").length > 1
    }

    mostSignificantWordPart(text: string): LocationMultiWord {
        const words = text.split(" ")
        let maxLength = 0
        let mostSignificantIndex = 0
        words.forEach((word: string, index: number) => {
            if (word.length > maxLength) {
                mostSignificantIndex = index
                maxLength = word.length
            }
        })
        return {
            key: words[mostSignificantIndex],
            fullName: text,
            numberBefore: mostSignificantIndex,
            numberAfter: (words.length-1) - mostSignificantIndex
        }

    }
}

export class Municipality extends LocationType {
    static id = "municipalities"

    static get(): LocationType {
        return new Municipality()
    }

    getName = (): string => Municipality.id
    rowParser = (row: string[]): { key: string, value: LocationValue } => {
        const key = row[5]
        const value: LocationValue = {
            isMultiWord: this.isMultiWord(key),
            mostSignificant: this.mostSignificantWordPart(key),
            canton: row[1],
            municipality: key,
            village: key,
            east: undefined,
            north: undefined,
        }
        return {key: key, value: value}
    }
}

export class Street extends LocationType {
    static id = "streets"

    static get(): LocationType {
        return new Street()
    }

    getName = (): string => Street.id
    rowParser = (row: string[]): { key: string, value: LocationValue } => {
        const key = row[1]
        const value: LocationValue = {
            isMultiWord: key.split(" ").length > 1,
            mostSignificant: this.mostSignificantWordPart(key),
            canton: row[5],
            municipality: row[4],
            village: row[2].substring(4).trim(), //remove zip code
            east: row[10],
            north: row[11]
        }
        return {key: key, value: value}
    }
}

export class Village extends LocationType {
    static id = "villages"

    static get(): LocationType {
        return new Village()
    }

    getName = (): string => Village.id
    rowParser = (row: string[]): { key: string, value: LocationValue } => {
        const key = row[0]
        const value: LocationValue = {
            isMultiWord: key.split(" ").length > 1,
            mostSignificant: this.mostSignificantWordPart(key),
            canton: row[5],
            municipality: row[3],
            village: key,
            east: row[6],
            north: row[7]
        }
        return {key: key, value: value}
    }
}

