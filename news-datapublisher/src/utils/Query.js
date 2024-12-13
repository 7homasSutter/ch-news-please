import {TABLE_ALIAS_LOCATION} from "./utils.js";

export class Query {
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
