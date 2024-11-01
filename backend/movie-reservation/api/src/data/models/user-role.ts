import {AbstractEntity} from "sqite-base";

export default class UserRole extends AbstractEntity {
    userId: number;
    roleId: number;

    constructor(id: number, userId: number, roleId: number, createdAt: Date, updatedAt?: Date) {
        super(id, createdAt, updatedAt);
        this.userId = userId;
        this.roleId = roleId;
    }
}
