export type Word = {
    position: number,
    value: string
}

export type InterpretedLocation = {
    position: number,
    value: string,
    results: {[key: string]: LocationValue[]}
}

export type ScoredLocation = {
    position: number,
    value: string,
    locationType: string,
    details: LocationValue,
    score: number,
}

export type LocationValue = {
    isMultiWord: boolean,
    mostSignificant: LocationMultiWord,
    canton: string,
    municipality: string,
    village: string,
    east: string | undefined,
    north: string | undefined
}

export type LocationMultiWord = {
    key: string,
    fullName: string,
    numberBefore: number,
    numberAfter: number
}

export type SimpleLocation = {
    name: string,
    locationType: string,
    type: "string"|"coordinates"
    value: string | {east: string, north: string}
}
