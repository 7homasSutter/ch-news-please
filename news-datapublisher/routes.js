import Router from "koa-router";
import {getAllLocationArticles} from "./api.js";

export const router = new Router()
router
    .get("/articles", getAllLocationArticles)
