import {ScoredLocation, SimpleLocation} from "../../types/types";
import {Street} from "../model/locationType";

const cantons = [
    "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
    "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG",
    "TI", "UR", "VD", "VS", "ZG", "ZH"
];

const emergencyServices = [
    "Polizei", "Feuerwehr", "Rettung", "Kantonspolizei", "Stadtpolizei", "Rettungsdienst"
]


export function evaluateLocations(locations: ScoredLocation[], text: string): SimpleLocation {
    if (locations.length === 0) {
        return
    }

    const scored = locations
        .map(plusForLowPosition)
        .map(evaluateStreets)
        .map((location: ScoredLocation) => plusForOptionalCantonAbb(location, text))
        .map((location: ScoredLocation) => minusForEmergencyServicePrefix(location, text))

    let maxScore = -Infinity
    let selectedLocation: ScoredLocation = scored[0]
    scored.forEach((location: ScoredLocation) => {
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

function minusForEmergencyServicePrefix(location: ScoredLocation, text: string): ScoredLocation {
    if (location.position <= 1) {
        return location
    }
    const wordBefore = text.split(" ")[prevWordPosition(location)]

    if (emergencyServices.includes(wordBefore)) {
        location.score -= 20
    }
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

/*

class Analyzer{
    private text: string
    private collectedMunicipalities: ScoredLocation[]
    private collectedStreets: ScoredLocation[]

    constructor(text: string, municipalities: Word[], streets: Word[]) {
        this.collectedMunicipalities = municipalities.map(word => ({...word, score: 0 }))
        this.collectedStreets = streets.map(word => ({...word, score: 0 }))
        this.text = text
    }

    plusForLowPosition(municipality: ScoredLocation): ScoredLocation{
        if(municipality.position < 20){
            municipality.score += 10
        }
        return municipality
    }

    plusForCantonAbb(municipality: ScoredLocation): ScoredLocation{
        const cantonAbb = this.text[municipality.position+1]
        if(cantons.includes(cantonAbb)){
            municipality.score += 10
        }
        return municipality
    }

    minusForEmergencyServices(municipality: ScoredLocation): ScoredLocation{
        if(municipality.position <=1){
            return municipality
        }
        const wordBefore = this.text[municipality.position-1]
        if(emergencyServices.includes(wordBefore)){
            municipality.score -= 20
        }
        return municipality
    }

    useRule(){

    }

}
*/
