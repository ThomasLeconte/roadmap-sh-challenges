export default class Expense {
    constructor(category, desc, amount, created_at) {
        this.category = category;
        this.desc = desc;
        this.amount = amount;
        this.created_at = created_at;
    }
    static deserialize(data) {
        const result = new Expense(data?.category, data?.desc, data?.amount, new Date(data?.created_at));
        result.id = data?.id;
        return result;
    }
}
