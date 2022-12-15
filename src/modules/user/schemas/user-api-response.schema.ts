import { User } from "@prisma/client";
import { GenericApiResponse } from "../../../shared/schema/generic-api-response.schema";
import { GoogleBooksItem } from "../../google-books/schemas/google-books.schema";

export interface UserApiResponse extends GenericApiResponse {
    user: Omit<User, "password"> & { books?: GoogleBooksItem[] }; // never send the password in a response
}
