import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../../entities/User";
import { FieldError } from "../common_types/error_response/FieldError";
import { RegisterOptions } from "./types/RegisterOptions";
import { UserResponse } from "./types/UserResponse";
import { validateRegisterOptions } from "./utils/validateRegisterOptions";
import bcrypt from "bcrypt";
import { LoginOptions } from "./types/LoginOptions";
import { CustomContext } from "../common_types/CustomContext";
import { validateLoginOptions } from "./utils/validateLoginOptions";
import { detectLoggedInBy } from "./utils/detectLoggedInBy";

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

  @Mutation(() => UserResponse)
  async login(
    @Arg("loginOptions") loginOptions: LoginOptions,
    @Ctx() { req, res, redis }: CustomContext
  ): Promise<UserResponse> {
    const validateLoginOptionsResult = validateLoginOptions(loginOptions);

    if (validateLoginOptionsResult !== true) {
      const typeCastedValidationResult =
        validateLoginOptionsResult as FieldError;

      return {
        errors: [
          {
            field: typeCastedValidationResult.field,
            message: typeCastedValidationResult.message,
          },
        ],
      };
    }

    let matchedUser: User | undefined;
    try {
      const loggedInBy = detectLoggedInBy(loginOptions);
      matchedUser =
        loggedInBy === "email"
          ? await User.findOne({
              where: { email: loginOptions.usernameOrEmail },
            })
          : await User.findOne({
              where: { username: loginOptions.usernameOrEmail },
            });
    } catch (error) {
      return {
        errors: [{ message: "Invalid Login Data" }],
      };
    }

    if (!matchedUser) {
      return {
        errors: [{ message: "Invalid Login Data" }],
      };
    }

    let isPasswordCorrect: boolean;
    try {
      isPasswordCorrect = await bcrypt.compare(
        loginOptions.password,
        matchedUser.password
      );
    } catch (error) {
      return {
        errors: [{ message: "Invalid Login Data" }],
      };
    }

    if (!isPasswordCorrect) {
      return {
        errors: [{ message: "Invalid Login Data" }],
      };
    }

    req.session.userId = matchedUser.id;

    return {user: matchedUser}
  }

  @Query(() => String)
  hello(): string {
    return "hello";
  }
}
