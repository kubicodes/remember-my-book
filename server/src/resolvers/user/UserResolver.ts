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

    try {
      const hashedPassword = await bcrypt.hash(registerOptions.password, 10);

      const createdUser = await User.create({
        email: registerOptions.email,
        username: registerOptions.username,
        password: hashedPassword,
      }).save();

      return { user: createdUser };
    } catch (error) {
      return { errors: [{ message: "Internal Server Error" }] };
    }
  }

  @Query(() => String)
  hello(): string {
    return "hello";
  }
}
