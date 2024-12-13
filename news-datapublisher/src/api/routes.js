import Router from "koa-router";
import {getAllLocationArticles, getAllNewspapers} from "./api.js";

export const router = new Router()
router
    .get("/articles", getAllLocationArticles)
    .get("/newspapers", getAllNewspapers)
