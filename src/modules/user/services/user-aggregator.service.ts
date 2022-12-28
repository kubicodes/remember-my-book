import { Book, User } from "@prisma/client";
import { IGoogleBooksResolver } from "src/modules/google-books/resolvers/google-books.resolver";
import { GoogleBooksItem } from "src/modules/google-books/schemas/google-books.schema";
import { IGoogleBooksFetchService } from "src/modules/google-books/services/google-books-fetch.service";
import { IUserService } from "./user.service";

export interface IUserAggregatorService {
    getUserWithBooks(id: string): Promise<Omit<User, "password"> & { books: GoogleBooksItem[] }>;
}

export class UserAggregatorService implements IUserAggregatorService {
    constructor(
        private userService: IUserService,
        private googleBooksFetchService: IGoogleBooksFetchService,
        private googleBooksResolver: IGoogleBooksResolver,
    ) {}

    public async getUserWithBooks(id: string): Promise<Omit<User, "password"> & { books: GoogleBooksItem[] }> {
        const matchingUser = await this.userService.findById(id, true);
        const bookIds = matchingUser.books?.map((book: Book) => book.bookId);

        const resolvedBooks: GoogleBooksItem[] = [];

        if (!bookIds || !bookIds?.length) {
            return { ...matchingUser, books: [] };
        }

        for (const id of bookIds) {
            const item = await this.googleBooksFetchService.fetchById(id);

            resolvedBooks.push(this.googleBooksResolver.resolveItem(item));
        }

        return { ...matchingUser, books: resolvedBooks };
    }
}
