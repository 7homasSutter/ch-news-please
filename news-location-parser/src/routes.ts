import Router from "koa-router";
import multer from "@koa/multer";
import {
    addMunicipalities,
    addStreets,
    addVillages,
    parseToLocation,
    debugMethod, deleteAll,
    municipalityExists, streetExists, villageExists, reloadLocations
} from "./api/LocationApi";
import {Municipality, Street, Village} from "./model/locationType";

export const router = new Router()
const upload = multer()

router.post('/location/municipalities', upload.single(Municipality.id), addMunicipalities)
router.post('/location/streets', upload.single(Street.id), addStreets)
router.post('/location/villages', upload.single(Village.id), addVillages)
router.get('/location/reload', reloadLocations)
router.get('/location/municipalities/:name', municipalityExists)
router.get('/location/villages/:name', villageExists)
router.get('/location/streets/:name', streetExists)

router.post('/location', parseToLocation)
router.delete('/location', deleteAll)
router.get("/", debugMethod)
