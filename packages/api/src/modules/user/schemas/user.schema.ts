import { User } from "@prisma/client";
import { GenericApiResponse } from "../../../shared/schema/generic-api-response.schema";
import { GoogleBooksItem } from "../../google-books/schemas/google-books.schema";

export type UserWithBooks = User & { books?: GoogleBooksItem[] };

export interface UserApiResponse extends GenericApiResponse {
    user: Omit<UserWithBooks, "password">; // never send the password in a response
}
