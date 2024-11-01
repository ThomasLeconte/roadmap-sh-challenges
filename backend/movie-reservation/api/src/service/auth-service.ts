import User from "../data/models/user";
import UserRepository from "../data/repository/user-repository";
import FunctionnalError from "../exceptions/functionnal-error";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NotFoundError from "../exceptions/not-found-error";
import { JWT_SECRET } from "..";
import RoleRepository from "../data/repository/role-repository";
import UserRoleRepository from "../data/repository/user-role-repository";
import UserRole from "../data/models/user-role";
import Role from "../data/models/role";

export default class AuthService {
    userRepository: UserRepository;
    roleRepository: RoleRepository;
    userRoleRepository: UserRoleRepository;
    tokenExpiration: string;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.userRoleRepository = new UserRoleRepository();
        this.tokenExpiration = '1h';
    }

    async register(username: string, password: string, email: string) {
        return this.userRepository.findByUsername(username)
        .then(async (user) => {
            if(user) {
                throw new FunctionnalError('Username already exists');
            }

            return bcrypt.hash(password, 10)
            .then((hashedPassword) => {
                let user = new User(0, username, hashedPassword, email, new Date());
                return this.userRepository.save(user);
            }).then(async (user) => {
                const role = await this.roleRepository.findOneBy({name: 'USER'});
                if(!role) {
                    throw new NotFoundError('Role not found');
                }

                return this.userRoleRepository.save(new UserRole(0, user.id, role.id, new Date()));
            })
        });
    }

    async login(username: string, password: string) {
        return this.userRepository.findByUsername(username)
        .then(async (user) => {
            if(!user) {
                throw new NotFoundError('Username not found');
            }

            const userRoles = await this.userRoleRepository.findBy({userId: user.id});
            const roles: Role[] = [];
            for(const userRole of userRoles) {
                const role = await this.roleRepository.findById(userRole.roleId);
                if(role) {
                    roles.push(role);
                }
            }

            return bcrypt.compare(password, user.password)
            .then((isPasswordValid) => {
                if(!isPasswordValid) {
                    throw new FunctionnalError('Invalid username or password');
                }

                return jwt.sign({id: user.id, username, roles: roles.map(r => r.name)}, JWT_SECRET, { expiresIn: this.tokenExpiration });
            });
        });
    }

    async refreshToken(token: string) {
        return Promise.resolve(jwt.verify(token, JWT_SECRET, {ignoreExpiration: true}))
        .then((decoded: any) => {
            return jwt.sign({id: decoded.id, username: decoded.username}, JWT_SECRET, { expiresIn: this.tokenExpiration });
        }).catch((err) => {
        })
    }
}