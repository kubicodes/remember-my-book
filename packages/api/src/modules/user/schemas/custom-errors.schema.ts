import { CustomError } from "../../../shared/schema/custom-error.schema";

export class UserAlreadyExistsError extends CustomError {}
export class UserNotFoundError extends CustomError {}
export class InvalidUsername extends CustomError {}
export class InvalidPassword extends CustomError {}
