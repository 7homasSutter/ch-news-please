import pkg from "pg"
const {Client} = pkg
import dotenv from 'dotenv'

import {TABLE_ALIAS_ARTICLES, TABLE_ALIAS_KEYWORDS, TABLE_ALIAS_LOCATION} from "../utils/utils.js";
import {Placeholder} from "../utils/Placeholder.js";
import {Query} from "../utils/Query.js";

dotenv.config()

const client = new Client({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: 5432
})


client.connect()
const placeHolderGenerator = new Placeholder()

export async function getAllDistinctNewspapers(){
    const query = "select source_domain from currentversions c group by source_domain"
    const result = await loadDataFromDb(query, [])
    return result.map(entry => entry.source_domain)
}

export async function getArticlesByQuery(filterQuery) {
    placeHolderGenerator.init()
    const query = new Query()
    for (const [key, value] of Object.entries(filterQuery)) {
        if (key === 'keywords') {
            query.addQueryPart(buildWhereForKeywords, value)
            query.setJoinKeywords(true)
        }
        if (key === 'notOlder') {
            query.addQueryPart(buildWhereForDayLimitPast, value)
        }
        if (key === 'limit') {
            query.setLimit(value)
        }
        if (key === 'newspapers') {
            query.addQueryPart(buildWhereNewspaper, value)
        }
    }

    const sqlQuery = buildSQLStatement(query)
    console.log(sqlQuery)
    return await loadDataFromDb(sqlQuery, query.values)

}

function buildWhereForKeywords(keywords) {
    const values = keywords.split("-").map(keyword => `%${keyword}%`)
    const placeholders = values.map(keyword => placeHolderGenerator.getNext())
    return {
        queryParts: placeholders.map((placeholder) => `UPPER(${TABLE_ALIAS_KEYWORDS}.keywords) like UPPER(${placeholder})`),
        values: values
    }
}

function buildWhereForDayLimitPast(dayLimit) {
    if (isNaN(dayLimit)) {
        return false
    }
    return {
        queryParts: [`${TABLE_ALIAS_ARTICLES}.date_publish < now() - (${placeHolderGenerator.getNext()}||' days')::interval `],
        values: [dayLimit]
    }
}

function buildWhereNewspaper(newspapers) {
    const list = newspapers.split("-").join(", ")
    return {
        queryParts: [`${TABLE_ALIAS_ARTICLES}.source_domain in (${placeHolderGenerator.getNext()})`],
        values: [list]
    }
}

function buildSQLStatement(query) {
    let select = `select distinct ${TABLE_ALIAS_ARTICLES}.id, title, maintext, source_domain, geo, location`
    if (query.joinKeywords) {
        select = `${select}, keywords`
    }
    const from = `from currentversions ${TABLE_ALIAS_ARTICLES}`
    let join = `join locations ${TABLE_ALIAS_LOCATION} on ${TABLE_ALIAS_ARTICLES}.id = ${TABLE_ALIAS_LOCATION}.document_id`
    if (query.joinKeywords) {
        join = `${join} join keywords ${TABLE_ALIAS_KEYWORDS} on ${TABLE_ALIAS_ARTICLES}.id = ${TABLE_ALIAS_KEYWORDS}.document_id`
    }

    return `${select} ${from} ${join} ${query.getWhere()} ${query.getLimitString()}`
}

async function loadDataFromDb(sqlQuery, values) {
    const res = await client.query(sqlQuery, values)
    return res.rows
}
