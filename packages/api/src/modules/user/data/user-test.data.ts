import { Book, User } from "@prisma/client";

export type UserOptions = Partial<User>;

export function getMockUser(options?: UserOptions): User {
    return {
        id: options?.id ?? "id",
        username: options?.username ?? "username",
        password: options?.password ?? "password",
        createdAt: options?.createdAt ?? new Date("2022-12-17"),
        updatedAt: options?.updatedAt ?? new Date("2022-12-18"),
    };
}

export type BookOptions = Partial<Book>;

export function getMockBooks(options?: BookOptions[]): Book[] {
    if (!options || !options.length) {
        return [
            {
                id: "id",
                bookId: "book-id",
            },
        ];
    }

    const books: Book[] = [];
    for (const option of options) {
        books.push({ id: option.bookId as string, bookId: option.bookId as string });
    }

    return books;
}
