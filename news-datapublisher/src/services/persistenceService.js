import pkg from "pg"
const {Client} = pkg
import dotenv from 'dotenv'

import {TABLE_ALIAS_ARTICLES, TABLE_ALIAS_KEYWORDS, TABLE_ALIAS_LOCATION} from "../utils/utils.js";
import {Placeholder} from "../utils/Placeholder.js";
import {Query} from "../utils/Query.js";

dotenv.config()

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
})


client.connect()
const placeHolderGenerator = new Placeholder()

export async function getAllDistinctNewspapers(){
   const query = new Query()
   query
       .setSelect("source_domain")
       .setGroupBy("source_domain")
       .setNoLimit(true)

    const result = await loadDataFromDb(buildSQLStatement(query), query.values)
    return result.map(entry => entry.source_domain)
}

export async function getArticlesByQuery(filterQuery) {
    placeHolderGenerator.init()
    const query = new Query()

    query.setSelect(`${TABLE_ALIAS_ARTICLES}.id`, "title", "maintext", "source_domain", "geo", "location")
        .setOrderBy("date_publish")

    for (const [key, value] of Object.entries(filterQuery)) {
        if (key === 'keywords') {
            query.setWhereWithBuilder(buildWhereForKeywords, value)
            query.setJoinKeywords(true)
        }
        if (key === 'maxAge') {
            query.setWhereWithBuilder(buildWhereForDayLimitPast, value)
        }
        if (key === 'limit') {
            query.setLimit(value)
        }
        if (key === 'newspapers') {
            query.setWhereWithBuilder(buildWhereNewspaper, value)
        }
    }

    const sqlQuery = buildSQLStatement(query)
    return await loadDataFromDb(sqlQuery, query.values)

}

function buildWhereForKeywords(keywords) {
    const SUFFIX_COMMA = ','
    const values = keywords.split("-").map(keyword => `%${keyword}${SUFFIX_COMMA}%`)
    const placeholders = values.map(_ => placeHolderGenerator.getNext())
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
        queryParts: [`${TABLE_ALIAS_ARTICLES}.date_publish > now() - (${placeHolderGenerator.getNext()}||' days')::interval `],
        values: [dayLimit]
    }
}

function buildWhereNewspaper(newspapers) {
    const list = newspapers.split("-")
    const placeholders = newspapers.split("-").map((_) => placeHolderGenerator.getNext()).join(", ")
    return {
        queryParts: [`${TABLE_ALIAS_ARTICLES}.source_domain in (${placeholders})`],
        values: list
    }
}

function buildSQLStatement(query) {
    let select = query.getSelect()
    if (query.joinKeywords) {
        select = `${select}, keywords`
    }
    const from = `from currentversions ${TABLE_ALIAS_ARTICLES}`
    let join = `join locations ${TABLE_ALIAS_LOCATION} on ${TABLE_ALIAS_ARTICLES}.id = ${TABLE_ALIAS_LOCATION}.document_id`
    if (query.joinKeywords) {
        join = `${join} join keywords ${TABLE_ALIAS_KEYWORDS} on ${TABLE_ALIAS_ARTICLES}.id = ${TABLE_ALIAS_KEYWORDS}.document_id`
    }

    return `${select} ${from} ${join} ${query.getWhere()} ${query.getGroupBy()} ${query.getOrderBy()} ${query.getLimitString()} `
}

async function loadDataFromDb(sqlQuery, values) {
    console.log(sqlQuery, values)
    const res = await client.query(sqlQuery, values)
    return res.rows
}
