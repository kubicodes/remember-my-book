// doing this as we want to always check if it's a custom error before including the error
// messages to the api response. It is easier to it with a single type check
export class CustomError extends Error {}

export class UserAlreadyExistsError extends CustomError {}
export class UserNotFoundError extends CustomError {}
export class InvalidUsername extends CustomError {}
export class InvalidPassword extends CustomError {}
