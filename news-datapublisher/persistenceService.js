import pkg from "pg"

const {Client} = pkg
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: 5432
})

const TABLE_ALIAS_KEYWORDS = 'k'
const TABLE_ALIAS_ARTICLES = 'a'
const TABLE_ALIAS_LOCATION = 'l'


client.connect()

class Placeholder {

    next = 1

    init() {
        this.next = 1
    }

    getNext() {
        return `$${this.next++}`
    }
}

class Query {
    queries = []
    values = []
    joinKeywords = false
    limit = 1000

    constructor() {
        this.queries.push(
            `${TABLE_ALIAS_LOCATION}.geo is not null`,
            `${TABLE_ALIAS_LOCATION}.geo != 'Unknown'`)
    }

    addQueryPart(builder, value) {
        const result = builder(value)
        if (!result) {
            return
        }
        this.queries.push(...result.queryParts)
        this.values.push(...result.values)
    }

    setJoinKeywords(joinKeywords) {
        this.joinKeywords = joinKeywords
    }

    setLimit(limit) {
        if (isNaN(limit)) {
            return //use default value
        }
        if (limit > 5000) {
            this.limit = 5000
        }

        if (limit < 1) {
            this.limit = 1
        }
        this.limit = limit
    }

    getLimitString(){
        return `LIMIT ${this.limit}`
    }

    getWhere(){
        return `where ${this.queries.join(" and ")}`
    }
}
const placeHolderGenerator = new Placeholder()


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
    return await loadArticlesFromDb(sqlQuery, query.values)

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

async function loadArticlesFromDb(sqlQuery, values) {
    const res = await client.query(sqlQuery, values)
    return res.rows
}
