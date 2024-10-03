import {
    InterpretedLocation,
    LocationMultiWord,
    LocationValue,
    ScoredLocation,
    Word
} from "../../types/types";
import {removePunctuation} from "./utils";
import {LocationType, Municipality, Street, Village} from "../model/locationType";

export function simplifyLocationFindings(text: string, locations: InterpretedLocation[]): ScoredLocation[] {

    const allPossibleLocations: { [locationType: string]: string[] } = getAllPossibleLocations(locations)

    return locations
        .map((location: InterpretedLocation) => filterInvalidMultiWordLocations(text, location))
        .map((location: InterpretedLocation) => removeUnlikelyStreets(location, allPossibleLocations))
        .filter(hasNoLocations)
        .map(reduceToSingleLocation)
        .map(mapToScoredLocation)

    //return removeInvalidStreets(locations)

    // map to a much simpler version: we want only one location per word.
    //
    // rules:
    //  - if it has multiple villages but only one municipality -> we say it's a municipality
    //  - if it has a single village -> we say it's a village
    //  - if it has a street -> it's probably a street
    //  - if it has a street but no corresponding village/municipality -> it's probably not the street we're searching for
}

function removeUnlikelyStreets(location: InterpretedLocation, allPossibleLocations: {
    [locationType: string]: string[]
}): InterpretedLocation {
    // if we have found a street but not the corresponding village/municipality, it's probably the wrong street -> we remove this street
    // no need to remove unlikely villages/municipalities since if we have a street, we ignore villages/municipalities anyway (see #reduceToSingleLocations)
    const streets = location.results[Street.id]
    const results = streets.filter((street: LocationValue) => {
        return allPossibleLocations[Village.id].includes(street.village) || allPossibleLocations[Municipality.id].includes(street.municipality)
    })
    location.results[Street.id] = results
    return location
}

function reduceToSingleLocation(word: InterpretedLocation): InterpretedLocation {
    if (word.results[Village.id].length > 1 && word.results[Municipality.id].length === 1) {
        word.results[Village.id] = []
        word.results[Street.id] = []
        return word
    }

    if (word.results[Village.id].length === 1) {
        word.results[Municipality.id] = []
        word.results[Street.id] = []
        return word
    }

    if (word.results[Street.id].length === 1) {
        word.results[Municipality.id] = []
        word.results[Village.id] = []
        return word
    }

    return word
}

function filterInvalidMultiWordLocations(text: string, word: InterpretedLocation): InterpretedLocation {
    for (const key of Object.keys(word.results)) {
        word.results[key] = word.results[key].filter((location: LocationValue) => {
            return !location.isMultiWord || textIncludesMultiWordLocation(text, word.position, location.mostSignificant)
        })
    }
    return word
}

function hasNoLocations(word: InterpretedLocation): boolean {
    let isEmpty = false
    for (const key of Object.keys(word.results)) {
        isEmpty = isEmpty || word.results[key].length !== 0
    }
    return isEmpty
}

function textIncludesMultiWordLocation(text: string, position: number, multiWordInfo: LocationMultiWord): boolean {
    const absolutStart = position - multiWordInfo.numberBefore
    const absolutEnd = position + multiWordInfo.numberAfter
    const allWords = text
        .split(" ")
        .map(removePunctuation)
    const fullWord = allWords.slice(absolutStart /*inclusive*/, absolutEnd + 1/*exclusive*/).join(" ")
    return fullWord === multiWordInfo.fullName
}


function mapToScoredLocation(location: InterpretedLocation): ScoredLocation {
    let result: LocationValue | undefined = undefined
    let locationType: string | undefined
    for (const key of Object.keys(location.results)) {
        // there should be only one result, otherwise: good luck :P
        if (location.results[key].length !== 0) {
            result = location.results[key][0]
            locationType = key
        }
    }

    const word: Word = {position: location.position, value: result.mostSignificant.fullName}
    return {...word, locationType: locationType, details: result, score: 0}

}

function getAllPossibleLocationsOfType(locations: InterpretedLocation[], locationType: LocationType): string[] {
    return locations.map((location: InterpretedLocation) => location.results[locationType.getName()].map((locationValue: LocationValue) => locationValue.mostSignificant.fullName)).flat()
}

function getAllPossibleLocations(locations: InterpretedLocation[]): { [locationType: string]: string[] } {
    const result = {}
    result[Street.id] = getAllPossibleLocationsOfType(locations, Street.get())
    result[Village.id] = getAllPossibleLocationsOfType(locations, Village.get())
    result[Municipality.id] = getAllPossibleLocationsOfType(locations, Municipality.get())
    return result
}

