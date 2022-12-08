export const USERNAME_VALIDATION_REGEX = /^[a-zA-Z0-9._-]{3,12}$/;

// want to explicitly test the regex, therefore it gets an own helper file so it can easily be exported
// separated file should also be good for future cases when the user service gets extended
export function isUsernameValid(username: string): boolean {
    if (!username.match(USERNAME_VALIDATION_REGEX)) {
        return false;
    }

    return true;
}
