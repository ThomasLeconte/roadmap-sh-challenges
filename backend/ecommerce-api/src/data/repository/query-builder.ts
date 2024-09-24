export default class QueryBuilder {

    private tableName: string;
    private fields: string[] = [];
    private whereConditions: string[];
    private orderByField: string | null;
    private orderByDirection: 'ASC' | 'DESC' | null;
    private groupByField: string | null = null;
    private limitValue: number | null;

    constructor(tableName: string){
        this.tableName = tableName;
        this.fields = [];
        this.whereConditions = [];
        this.orderByField = null;
        this.orderByDirection = null;
        this.groupByField = null;
        this.limitValue = null;
    }

    public build(): string {

        const fields = this.fields.length > 0 ? this.fields.join(', ') : '*';

        let result = `SELECT ${fields} FROM ${this.tableName}`;

        if(this.whereConditions.length > 0){
            result += ` WHERE ${this.whereConditions.join(' AND ')}`;
        }

        if(this.groupByField){
            result += ` GROUP BY ${this.groupByField}`;
        }

        if(this.orderByField){
            result += ` ORDER BY ${this.orderByField} ${this.orderByDirection}`;
        }

        if(this.limitValue){
            result += ` LIMIT ${this.limitValue}`;
        }

        return result;
    }

    public select(field: string | string[]): this {
        if(Array.isArray(field)){
            this.fields.push(...field);
        } else {
            this.fields.push(field);
        }
        return this;
    }

    public where(field: string, value: string): this {
        this.whereConditions.push(`${field} = ${value}`);
        return this;
    }

    public whereLike(field: string, value: string): this {
        this.whereConditions.push(`${field} LIKE '%${value}%'`);
        return this;
    }

    public orderBy(field: string, direction: 'ASC' | 'DESC'): this {
        this.orderByField = field;
        this.orderByDirection = direction;
        return this;
    }

    public groupBy(field: string): this {
        this.groupByField = field;
        return this
    }

    public limit(limit: number): this {
        this.limitValue = limit;
        return this;
    }
}