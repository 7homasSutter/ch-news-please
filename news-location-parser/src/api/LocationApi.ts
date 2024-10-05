import {Context} from "koa";
import {deleteAllRedisData, getValue} from "../services/redisService";
import {LocationType, Municipality, Street, Village} from "../model/locationType";
import {findLocationsInText, handleDirectoryUpload, resetRedisAndLoadDataFromFiles} from "../services/locationService";
import {simplifyLocationFindings} from "../services/SimplificationService";
import {evaluateLocations} from "../services/EvalutationService";

async function addLocationDirectory(ctx: Context, handlerMethod: (locationType: LocationType, buffer: Buffer) => Promise<boolean>, locationType: LocationType) {
    if (ctx.file.mimetype !== "text/csv") {
        ctx.status = 400
        ctx.body = 'Upload a csv file.'
        return
    }

    const success = await handlerMethod(locationType, ctx.file.buffer)
    if (!success) {
        ctx.status = 500
        ctx.body = 'error';
        return
    }
    ctx.status = 204
}

export async function addMunicipalities(ctx: Context) {
    addLocationDirectory(ctx, handleDirectoryUpload, Municipality.get()).then()
}

export async function addStreets(ctx: Context) {
    addLocationDirectory(ctx, handleDirectoryUpload, Street.get()).then()
}


export async function addVillages(ctx: Context) {
    addLocationDirectory(ctx, handleDirectoryUpload, Village.get()).then()
}

export async function reloadLocations(ctx: Context){
    resetRedisAndLoadDataFromFiles([Municipality.get(), Village.get(), Street.get()]).then()
    ctx.body = "This operation could take a while. Check the logs for progress."
}

export async function parseToLocation(ctx: Context) {
    // @ts-ignore
    const body = ctx.request.body
    const foundLocations = await findLocationsInText(body.text)
    const simplifiedLocations = simplifyLocationFindings(body.text, foundLocations)
    const scoredLocations = evaluateLocations(simplifiedLocations, body.text)

    ctx.body = scoredLocations
}

export async function municipalityExists(ctx: Context) {
    await locationExists(ctx, Municipality.get())
}

export async function villageExists(ctx: Context) {
    await locationExists(ctx, Village.get())
}

export async function streetExists(ctx: Context) {
    await locationExists(ctx, Street.get())
}

export async function locationExists(ctx: Context, locationType: LocationType): Promise<void>{
    const location = ctx.params.name
    const result = await getValue(locationType.getName(), location)
    if(result === null){
        ctx.body = `${location} doesn't exist.`
    }else{
        ctx.body = `${location} exists.`
    }
}

export async function deleteAll(ctx: Context){
    ctx.body = await deleteAllRedisData()
    ctx.status = 200
}

export async function debugMethod(ctx: Context) {
    //do something
    ctx.status = 200
}
