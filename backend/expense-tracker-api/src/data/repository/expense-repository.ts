import Database from "../../database/Database";
import Expense from "../models/expense";
import AbstractRepository from "./abstract-repository";

export default class ExpenseRepository extends AbstractRepository<Expense> {
    constructor() {
        super('expense', Expense);
    }
}