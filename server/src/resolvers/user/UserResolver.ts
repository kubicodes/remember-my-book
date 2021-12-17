import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../../entities/User";
import { FieldError } from "../common_types/error_response/FieldError";
import { RegisterOptions } from "./types/RegisterOptions";
import { UserResponse } from "./types/UserResponse";
import { validateRegisterOptions } from "./utils/validateRegisterOptions";
import bcrypt from "bcrypt";

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("RegisterOptions") registerOptions: RegisterOptions
  ): Promise<UserResponse> {
    const registerOptionsValidationResult =
      validateRegisterOptions(registerOptions);

    if (registerOptionsValidationResult !== true) {
      const typeCastedValidationResult =
        registerOptionsValidationResult as FieldError;

      return {
        errors: [
          {
            field: typeCastedValidationResult?.field,
            message: typeCastedValidationResult?.message,
          },
        ],
      };
    }
  }

  @Query(() => String)
  hello(): string {
    return "hello";
  }
}
