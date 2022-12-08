import { isUsernameValid } from "./user-validation.helper";

describe("User validation Helper", () => {
    describe("isUsernameValid", () => {
        it("returns false when the username's length is less than 3", () => {
            const username = "ab";
            const result = isUsernameValid(username);

            expect(result).toBe(false);
        });

        it("returns false when the username's length is greater than 12", () => {
            const username = "abcdefghijklm";
            const result = isUsernameValid(username);

            expect(result).toBe(false);
        });

        it("returns true when the username's length is 3 and fullfils all other constraints", () => {
            const username = "abc";
            const result = isUsernameValid(username);

            expect(result).toBe(true);
        });

        it("returns true when the username's length is 12 and fullfils all other constraints", () => {
            const username = "abcdefghijkl";
            const result = isUsernameValid(username);

            expect(result).toBe(true);
        });

        it("returns false when the username contains a special character which is not . - _", () => {
            const username = "helo@";
            const result = isUsernameValid(username);

            expect(result).toBe(false);
        });

        it("returns false when the username contains a special character which is not . - _", () => {
            const username = "helo@";
            const result = isUsernameValid(username);

            expect(result).toBe(false);
        });

        it("returns true when the username contains the allowed special character . - _", () => {
            const username = "he_l-l.o.2-.";
            const result = isUsernameValid(username);

            expect(result).toBe(true);
        });

        it("returns true when the username matches the regex", () => {
            const username = "Hel.lo-123.";
            const result = isUsernameValid(username);

            expect(result).toBe(true);
        });
    });
});
