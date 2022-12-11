import { User } from "@prisma/client";
import { GenericApiResponse } from "../../../shared/schema/generic-api-response.schema";

export interface UserApiResponse extends GenericApiResponse {
    user: Omit<User, "password">; // never send the password in a response
}
