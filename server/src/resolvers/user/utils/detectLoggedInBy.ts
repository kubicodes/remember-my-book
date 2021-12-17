import { loggedInByOptions } from "../types/LoggedInByOptions";
import { LoginOptions } from "../types/LoginOptions";

export const detectLoggedInBy = (
  loginOptions: LoginOptions
): loggedInByOptions => {
  let loggedInBy: loggedInByOptions;

  if (loginOptions.usernameOrEmail.includes("@")) {
    loggedInBy = "email";
  } else {
    loggedInBy = "username";
  }

  return loggedInBy;
};
