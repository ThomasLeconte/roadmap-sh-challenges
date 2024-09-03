import AbstractCommand from "./abstract-command.js"

export default class ListCommand extends AbstractCommand {
    execute(...args: any): void {
        console.log(`# ID    Date${' '.repeat(9)}    Desc    Amount`)
        this.expenses.forEach(e => {
            console.log(`# ${e.id + (e.id && e.id < 10 ? ' ' : '')}    ${e.created_at.toLocaleDateString()}${' '.repeat(9 - (e.id && e.id < 10 ? 1 : 0))}${e.desc}    $${e.amount}`)
        })
    }

}