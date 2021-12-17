import { validate } from "email-validator";
import { FieldError } from "../../common_types/error_response/FieldError";
import { LoginOptions } from "../types/LoginOptions";
import { detectLoggedInBy } from "./detectLoggedInBy";

export const validateLoginOptions = (
  loginOptions: LoginOptions
): FieldError | boolean => {
  const loggedInBy = detectLoggedInBy(loginOptions);

  const usernameValidationRegex = new RegExp(
    "^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,10}[a-zA-Z0-9]$"
  );

  const passwordValidationRegex = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$"
  );

  if (loggedInBy === "email" && !validate(loginOptions.usernameOrEmail)) {
    return { field: "email", message: "Invalid E-Mail address" };
  }

  if (
    loggedInBy === "username" &&
    !usernameValidationRegex.test(loginOptions.usernameOrEmail)
  ) {
    return {
      field: "username",
      message:
        "Allowed: alphanumeric characters, . _ -, cannot start and end with special characters, number of characters must be between 5 and 12",
    };
  }

  if (!passwordValidationRegex.test(loginOptions.password)) {
    return {
      field: "password",
      message:
        "At least one upper case letter, one lowercase letter, one digit, one special character, min length 8, max length 16",
    };
  }

  return true;
};
