export const USERNAME_VALIDATION_REGEX = /^[a-zA-Z0-9._-]{3,12}$/;
export const PASSWORD_VALIDATION_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/;

export function isUsernameValid(username: string): boolean {
    if (!username.match(USERNAME_VALIDATION_REGEX)) {
        return false;
    }

    return true;
}

export function isPasswordValid(password: string): boolean {
    if (!password.match(PASSWORD_VALIDATION_REGEX)) {
        return false;
    }

    return true;
}
