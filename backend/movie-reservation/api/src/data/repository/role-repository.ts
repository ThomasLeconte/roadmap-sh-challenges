import Role from "../models/role";
import {AbstractRepository} from "sqite-base";

export default class RoleRepository extends AbstractRepository<Role> {
    constructor() {
        super('role', Role);
    }
}
