import {ScoredLocation, SimpleLocation} from "../../types/types";
import {Street} from "../model/locationType";
import {cantons} from "../constants";



export function evaluateLocations(locations: ScoredLocation[], text: string): SimpleLocation {
    if (locations.length === 0) {
        return
    }

    const scored = locations
        .map(plusForLowPosition)
        .map(evaluateStreets)
        .map((location: ScoredLocation) => plusForOptionalCantonAbb(location, text))

    let maxScore = -Infinity
    let selectedLocation: ScoredLocation = scored[0]
    scored.forEach((location: ScoredLocation) => {
        console.log("Location:", location.value, ", Score:",  location.score)
        if (location.score > maxScore) {
            maxScore = location.score
            selectedLocation = location
        }
    })

    return mapToSimpleLocation(selectedLocation)
}


function plusForLowPosition(location: ScoredLocation): ScoredLocation {
    if (location.position < 20) {
        location.score += 20
    }
    return location
}

function plusForOptionalCantonAbb(location: ScoredLocation, text: string){
    if(cantons.some((cantonAbb: string) => location.value.includes(`(${cantonAbb})`))){
        // village/municipality contains anyway a canton abbreviation -> not interesting
        return location
    }

    const nextWord = text.split(" ")[nextWordPosition(location)]
    if(cantons.some((cantonAbb: string) => cantonAbb === nextWord || cantonAbb === `(${cantonAbb})`)){
        location.score += 10
    }

    return location
}

function evaluateStreets(location: ScoredLocation): ScoredLocation {
    if (location.locationType !== Street.id) {
        return location
    }

    // streets like "Autobahn" or "A2" are not interesting
    if (location.value === 'Autobahn' || location.value.match(/A\d{1,2}/g)) {
        location.score -= 20
        return location
    }

    location.score += 20
    return location
}


function mapToSimpleLocation(scoredLocation: ScoredLocation): SimpleLocation {

    if (scoredLocation.details.east && scoredLocation.details.north) {
        return {
            name: scoredLocation.value,
            locationType: scoredLocation.locationType,
            type: "coordinates",
            value: {east: scoredLocation.details.east, north: scoredLocation.details.north}
        }
    }
    return {
        name: scoredLocation.value,
        locationType: scoredLocation.locationType,
        type: "string",
        value: scoredLocation.value
    }

}
function nextWordPosition(location: ScoredLocation): number{
    return  location.position + location.details.mostSignificant.numberAfter + 1
}

function prevWordPosition(location: ScoredLocation): number{
    return  location.position - location.details.mostSignificant.numberBefore - 1
}
