import Role from "../models/role";
import AbstractRepository from "./abstract-repository";

export default class RoleRepository extends AbstractRepository<Role> {
    constructor() {
        super('role', Role);
    }
}