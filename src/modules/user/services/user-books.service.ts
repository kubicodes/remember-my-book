import { PrismaClient } from "@prisma/client";
import { Logger } from "pino";
import { UserNotFoundError } from "../schemas/custom-errors.schema";

export const name = "UserBooksService";

export interface IUserBooksService {
    addBookToUser(userId: string, bookId: string): Promise<boolean>;
}

export class UserBooksService implements IUserBooksService {
    constructor(private dbClient: PrismaClient, private logger: Logger) {}

    public async addBookToUser(userId: string, bookId: string): Promise<boolean> {
        try {
            let internalBookId = (await this.dbClient.book.findFirst({ where: { bookId } }))?.id;

            if (!internalBookId) {
                internalBookId = (await this.dbClient.book.create({ data: { bookId } })).id;
            }

            await this.dbClient.user.update({
                where: {
                    id: userId,
                },
                data: {
                    books: {
                        connect: {
                            id: internalBookId,
                        },
                    },
                },
            });

            return true;
        } catch (error) {
            if (error instanceof Error && error.message.includes("Required exactly one parent ID to be present for connect query, found 0")) {
                this.logger.error({ msg: `Can not add books to not existing User with ID ${userId}` });

                throw new UserNotFoundError(`Can not add books to not existing User with ID ${userId}`);
            }

            this.logger.error({
                msg: `Error while adding book with ID ${bookId} to user with ID ${userId}`,
                ...(error instanceof Error ? { err: error.message } : {}),
            });

            return false;
        }
    }
}
