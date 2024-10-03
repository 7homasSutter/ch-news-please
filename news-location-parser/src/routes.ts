import Router from "koa-router";
import multer from "@koa/multer";
import {
    addMunicipalities,
    addStreets,
    addVillages,
    checkForLocations,
    debugMethod, deleteAll,
    municipalityExists
} from "./api/LocationApi";
import {Municipality, Street, Village} from "./model/locationType";

export const router = new Router()
const upload = multer()


console.log(Municipality.id)
router.post('/location/municipalities', upload.single(Municipality.id), addMunicipalities)
router.post('/location/streets', upload.single(Street.id), addStreets)
router.post('/location/villages', upload.single(Village.id), addVillages)
router.get('/location/municipalities/:municipality', municipalityExists)
router.post('/location', checkForLocations)
router.delete('/location', deleteAll)
router.get("/", debugMethod)
