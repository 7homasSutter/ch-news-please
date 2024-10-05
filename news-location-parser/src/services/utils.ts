import fs from "fs/promises";
import {Word} from "../../types/types"


export async function saveFile(filepath: string, bufferData: Buffer) {
    try {
        await fs.writeFile(filepath, bufferData)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export function wordStartsWithCapitalLetter(word: Word): boolean {
    return word.value[0] === word.value[0].toUpperCase()
}

export function removePunctuation(word: string): string {
    const punctuation = /[\.,?!]/g;
    word = word.replace(punctuation, "")
    return word
}

export function sleep(ms: number){
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}
