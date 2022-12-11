import { PrismaClient, User } from "@prisma/client";
import { Logger } from "pino";
import { isUsernameValid } from "../helpers/user-validation.helper";
import { BCRYPT_SALT_ROUNDS } from "../../../shared/constants/constants";
import { PRISMA_UNIQUE_CONSTRAINT_FAILED_ERROR_CODE } from "../../database/constants/database.constants";
import { IPasswordService } from "../../auth/password.service";
import { UserAlreadyExistsError, UserNotFoundError } from "../schemas/custom-errors.schema";

export interface UserCreateOptions {
    username: string;
    password: string;
}

export interface IUserService {
    create(options: UserCreateOptions): Promise<User>;
    findById(id: string): Promise<User>;
}

export class UserService implements IUserService {
    constructor(private dbClient: PrismaClient, private passwordService: IPasswordService, private logger: Logger) {}

    public async create(options: UserCreateOptions): Promise<User> {
        const { username, password } = options;

        const isValidUsername = isUsernameValid(username);
        if (!isValidUsername) {
            throw new Error("Username does not match the requirements.");
        }

        const isValidPassword = this.passwordService.isValidPassword(password);
        if (!isValidPassword) {
            throw new Error("Password does not matche the requirements.");
        }

        try {
            const hashedPassword = await this.passwordService.hashPassword(password, BCRYPT_SALT_ROUNDS);

            return await this.dbClient.user.create({ data: { username, password: hashedPassword } });
        } catch (error) {
            this.logger.error({ msg: `Error while creating user ${username}` });

            // This could be every unique constraint error. But for now we only have this on the username
            // So the check is fine for now but might need to be adjusted in future cases
            if (error.code === PRISMA_UNIQUE_CONSTRAINT_FAILED_ERROR_CODE) {
                this.logger.error({ msg: `User ${username} already exists` });
                throw new UserAlreadyExistsError(`User ${username} already exists`);
            }

            throw error;
        }
    }

    public async findById(id: string): Promise<User> {
        try {
            const matchingUser = await this.dbClient.user.findUnique({ where: { id } });

            if (matchingUser === null) {
                throw new UserNotFoundError(`User with ID ${id} does not exist`);
            }

            return matchingUser;
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                this.logger.error({ msg: `User with ID ${id} does not exist` });
                throw error;
            }

            this.logger.error({ msg: `Error in findByID method in UserService. User ID: ${id}`, err: error?.message });
            throw error;
        }
    }
}
