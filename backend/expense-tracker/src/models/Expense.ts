export default class Expense {
    id: string;
    category: string;
    desc: string;
    amount: number;
    created_at: Date;


    constructor(id: string, category: string, desc: string, amount: number, created_at: Date) {
        this.id = id;
        this.category = category;
        this.desc = desc;
        this.amount = amount;
        this.created_at = created_at;
    }


    static deserialize(data: any) {
        return new Expense(data?.id, data?.category, data?.desc, data?.amount, data?.created_at);
    }
}