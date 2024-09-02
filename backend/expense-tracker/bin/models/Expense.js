export default class Expense {
    constructor(id, category, desc, amount, created_at) {
        this.id = id;
        this.category = category;
        this.desc = desc;
        this.amount = amount;
        this.created_at = created_at;
    }
    static deserialize(data) {
        return new Expense(data?.id, data?.category, data?.desc, data?.amount, data?.created_at);
    }
}
