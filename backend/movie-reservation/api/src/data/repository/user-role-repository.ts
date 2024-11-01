import UserRole from "../models/user-role";
import {AbstractRepository} from "sqite-base";

export default class UserRoleRepository extends AbstractRepository<UserRole> {
    constructor() {
        super('user_role', UserRole);
    }
}
