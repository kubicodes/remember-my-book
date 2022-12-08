import { User } from "@prisma/client";

export interface UserApiResponse {
    message: string;
    user: Omit<User, "password">; // never send the password in a response
}
