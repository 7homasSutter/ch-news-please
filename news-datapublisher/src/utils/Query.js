import {TABLE_ALIAS_LOCATION} from "./utils.js";

export class Query {
    select = []
    queries = []
    values = []
    joinKeywords = false
    noLimit = false
    limit = 1000
    groupBy = undefined
    orderBy = undefined

    constructor() {
        this.queries.push(
/*            `${TABLE_ALIAS_LOCATION}.geo is not null`,
            `${TABLE_ALIAS_LOCATION}.geo != 'Unknown'`)*/
        `${TABLE_ALIAS_LOCATION}.location not in ('Unknown', 'None', 'null')`)
    }

    setSelect(...element){
        this.select.push(...element)
        return this
    }

    setWhereWithBuilder(builder, value) {
        const result = builder(value)
        if (!result) {
            return
        }
        this.queries.push(...result.queryParts)
        this.values.push(...result.values)
        return this
    }

    setJoinKeywords(joinKeywords) {
        this.joinKeywords = joinKeywords
        return this
    }

    setNoLimit(noLimit){
        this.noLimit = noLimit
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
        return this
    }

    setGroupBy(value){
        this.groupBy = value
        return this
    }

    setOrderBy(column){
        if(!this.select.includes('column')){
            this.select.push(column)
        }
        this.orderBy = column
    }

    getSelect(){
        return `select distinct ${this.select.join(",")}`
    }

    getLimitString(){
        if(this.noLimit){
            return ''
        }
        return `LIMIT ${this.limit}`
    }

    getWhere(){
        return `where ${this.queries.join(" and ")}`
    }

    getGroupBy(){
        if(!this.groupBy){
            return ''
        }
        return `group by ${this.groupBy}`
    }

    getOrderBy(){
        if(!this.orderBy){
            return ''
        }
        return `order by ${this.orderBy} desc`
    }
}
