import UserRole from "../models/user-role";
import AbstractRepository from "./abstract-repository";

export default class UserRoleRepository extends AbstractRepository<UserRole> {
    constructor() {
        super('user_role', UserRole);
    }
}