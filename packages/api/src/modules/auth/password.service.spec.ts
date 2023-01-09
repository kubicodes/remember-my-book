import { mock, mockReset } from "jest-mock-extended";
import { Logger } from "pino";
import { BCRYPT_SALT_ROUNDS } from "../../shared/constants/constants";
import { IPasswordService, PasswordService } from "./password.service";

let passwordService: IPasswordService;
describe("Password Service", () => {
    const mockLogger = mock<Logger>();

    beforeEach(() => {
        mockReset(mockLogger);

        passwordService = new PasswordService(mockLogger);
    });

    describe("hashPassword", () => {
        it("returns the hashed password", async () => {
            const rawPassword = "password";

            const hashedPassword = await passwordService.hashPassword(rawPassword, BCRYPT_SALT_ROUNDS);

            expect(hashedPassword).not.toEqual(rawPassword);
            expect(typeof hashedPassword).toBe("string");
            expect(hashedPassword.length).toBeGreaterThan(rawPassword.length);
        });
    });

    describe("isPasswordValid", () => {
        it("returns false when the password length is less than 8", () => {
            const password = "hlA2";
            const result = passwordService.isValidPassword(password);

            expect(result).toBe(false);
        });

        it("returns false when the password length is less greater than 32", () => {
            const password = "hlA2skdlskdlskdlskdlskldskAlskdlskdlksldksldksldks";
            const result = passwordService.isValidPassword(password);

            expect(result).toBe(false);
        });

        it("returns false when the password does not contain capital letters", () => {
            const password = "halskd123skdskjd";
            const result = passwordService.isValidPassword(password);

            expect(result).toBe(false);
        });

        it("returns false when the password does not contain numbers", () => {
            const password = "halskdAAAAskds";
            const result = passwordService.isValidPassword(password);

            expect(result).toBe(false);
        });

        it("returns true when the password length is between 8 and 32, contains capital letters and numbers", () => {
            const password = "hellOWorld123";
            const result = passwordService.isValidPassword(password);

            expect(result).toBe(true);
        });

        it("returns true when the password length is between 8 and 32, contains capital letters, numbers and special characters", () => {
            const password = "hellOWorld123@@!!--";
            const result = passwordService.isValidPassword(password);

            expect(result).toBe(true);
        });
    });
});
