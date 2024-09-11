import User from "../data/models/user";
import UserRepository from "../data/repository/user-repository";
import FunctionnalError from "../exceptions/functionnal-error";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NotFoundError from "../exceptions/not-found-error";
import { JWT_SECRET } from "..";

export default class AuthService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(username: string, password: string, email: string) {
        return this.userRepository.findByUsername(username)
        .then((user) => {
            if(user) {
                throw new FunctionnalError('Username already exists');
            }

            return bcrypt.hash(password, 10)
            .then((hashedPassword) => {
                let user = new User(0, username, hashedPassword, email, new Date());
                return this.userRepository.save(user);
            });
        });
    }

    async login(username: string, password: string) {
        return this.userRepository.findByUsername(username)
        .then((user) => {
            if(!user) {
                throw new NotFoundError('Username not found');
            }

            return bcrypt.compare(password, user.password)
            .then((isPasswordValid) => {
                if(!isPasswordValid) {
                    throw new FunctionnalError('Invalid username or password');
                }

                return jwt.sign({id: user.id, username}, JWT_SECRET, { expiresIn: '1h' });
            });
        });
    }
}