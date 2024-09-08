export default class Expense {
    id?: number;
    category: string;
    desc: string;
    amount: number;
    created_at: Date;


    constructor(category: string, desc: string, amount: number, created_at: Date) {
        this.category = category;
        this.desc = desc;
        this.amount = amount;
        this.created_at = created_at;
    }

    static deserialize(data: any) {
        const result = new Expense(data?.category, data?.desc, data?.amount, new Date(data?.created_at));
        result.id = data?.id;

        return result;
    }
}