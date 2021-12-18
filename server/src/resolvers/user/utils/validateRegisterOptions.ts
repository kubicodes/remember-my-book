import { validate } from "email-validator";
import { FieldError } from "../../common_types/error_response/FieldError";
import { RegisterOptions } from "../types/RegisterOptions";
import { passwordRegex, usernameRegex } from "./constants";

export const validateRegisterOptions = (
  registerOptions: RegisterOptions
): FieldError | boolean => {
  const usernameValidationRegex = new RegExp(usernameRegex);
  const passwordValidationRegex = new RegExp(passwordRegex);

  if (!validate(registerOptions.email)) {
    return { field: "email", message: "Invalid E-Mail address" };
  }

  if (!usernameValidationRegex.test(registerOptions.username)) {
    return {
      field: "username",
      message:
        "Allowed: alphanumeric characters, . _ -, cannot start and end with special characters, number of characters must be between 5 and 12",
    };
  }

  if (!passwordValidationRegex.test(registerOptions.password)) {
    return {
      field: "password",
      message:
        "At least one upper case letter, one lowercase letter, one digit, one special character, min length 8, max length 16",
    };
  }

  return true;
};
