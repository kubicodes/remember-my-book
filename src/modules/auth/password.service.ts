import { hash } from "bcrypt";
import { Logger } from "pino";

export interface IPasswordService {
    hashPassword(password: string, salt: number): Promise<string>;
    isValidPassword(password: string): boolean;
}

export class PasswordService implements IPasswordService {
    private PASSWORD_VALIDATION_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/;

    constructor(private logger: Logger) {}

    public async hashPassword(password: string, salt: number): Promise<string> {
        try {
            return await hash(password, salt);
        } catch (error) {
            this.logger.error({ msg: "Error while hashing password" });

            throw new Error("Internal Error while hashing Password");
        }
    }

    public isValidPassword(password: string): boolean {
        return !!password.match(this.PASSWORD_VALIDATION_REGEX);
    }
}
