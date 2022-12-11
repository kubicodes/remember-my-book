import { PrismaClient } from "@prisma/client";
import { mock, mockDeep, mockReset } from "jest-mock-extended";
import { Logger } from "pino";
import { IPasswordService } from "../../auth/password.service";
import { PRISMA_UNIQUE_CONSTRAINT_FAILED_ERROR_CODE } from "../../database/constants/database.constants";
import { IUserService, UserService } from "./user.service";

let userService: IUserService;
describe("User Service", () => {
    const mockDbClient = mockDeep<PrismaClient>(); // needs deep mock for nested functions on model props
    const mockPasswordService = mock<IPasswordService>();
    const mockLogger = mock<Logger>();

    beforeEach(() => {
        mockReset(mockDbClient);
        mockReset(mockPasswordService);
        mockReset(mockLogger);

        userService = new UserService(mockDbClient, mockPasswordService, mockLogger);
    });

    describe("create", () => {
        it("throws an error when the username is not valid", async () => {
            const invalidUsername = "us";
            const password = "password";

            await expect(() => userService.create({ username: invalidUsername, password })).rejects.toThrowError(
                "Username does not match the requirements.",
            );
        });

        it("throws an error when the password is not valid", async () => {
            const invalidUsername = "username";
            const password = "password";

            await expect(() => userService.create({ username: invalidUsername, password })).rejects.toThrowError(
                "Password does not matche the requirements.",
            );
        });

        it("returns the created user when the creation was successfull", async () => {
            const validUsername = "username";
            const validPassword = "PassWord123";

            mockPasswordService.isValidPassword.mockReturnValueOnce(true);
            mockPasswordService.hashPassword.mockResolvedValueOnce("hashed-password");

            jest.spyOn(mockDbClient.user, "create").mockResolvedValueOnce({
                id: "id",
                username: validUsername,
                password: "hashed-password",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const createdUser = await userService.create({ username: validUsername, password: validPassword });

            expect(createdUser.username).toBe(validUsername);
            expect(createdUser.password).toBe("hashed-password");
        });

        it("throws and logs an error when the creation was not successfull", async () => {
            const validUsername = "username";
            const validPassword = "Passw0rd";

            mockPasswordService.isValidPassword.mockReturnValueOnce(true);
            mockPasswordService.hashPassword.mockResolvedValueOnce("hashed-password");

            jest.spyOn(mockDbClient.user, "create").mockImplementationOnce(() => {
                throw new Error();
            });

            await expect(() => userService.create({ username: validUsername, password: validPassword })).rejects.toThrowError();
            expect(mockLogger.error).toHaveBeenCalledWith({ msg: `Error while creating user ${validUsername}` });
        });

        it("throws a customized error when username already exists", async () => {
            const alreadyExistingUsername = "username";
            const validPassword = "Passw0rd";

            mockPasswordService.isValidPassword.mockReturnValueOnce(true);
            mockPasswordService.hashPassword.mockResolvedValueOnce("hashed-password");

            class CustomError extends Error {
                code: string;
            }

            const customError = new CustomError();
            customError.code = PRISMA_UNIQUE_CONSTRAINT_FAILED_ERROR_CODE;

            jest.spyOn(mockDbClient.user, "create").mockImplementationOnce(() => {
                throw customError;
            });

            await expect(() => userService.create({ username: alreadyExistingUsername, password: validPassword })).rejects.toThrowError(
                `User ${alreadyExistingUsername} already exists`,
            );

            expect(mockLogger.error).toHaveBeenNthCalledWith(1, {
                msg: `Error while creating user ${alreadyExistingUsername}`,
            });

            expect(mockLogger.error).toHaveBeenNthCalledWith(2, {
                msg: `User ${alreadyExistingUsername} already exists`,
            });
        });
    });

    describe("findById", () => {
        it("returns the matching user", async () => {
            const mockUser = {
                id: "id",
                username: "username",
                password: "hashed-password",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(mockDbClient.user, "findUnique").mockResolvedValueOnce(mockUser);

            const matchingUser = await userService.findById("id");

            expect(matchingUser).toMatchObject(mockUser);
        });

        it("throws and logs an error when no user matches the ID", async () => {
            jest.spyOn(mockDbClient.user, "findUnique").mockResolvedValueOnce(null);

            await expect(() => userService.findById("id")).rejects.toThrowError("User with ID id does not exist");
            expect(mockLogger.error).toHaveBeenCalledWith({ msg: "User with ID id does not exist" });
        });

        it("throws and logs an error when the method fails at all", async () => {
            jest.spyOn(mockDbClient.user, "findUnique").mockImplementationOnce(() => {
                throw new Error("Some Error");
            });

            await expect(() => userService.findById("id")).rejects.toThrowError("Some Error");
            expect(mockLogger.error).toHaveBeenCalledWith({ msg: "Error in findByID method in UserService. User ID: id", err: "Some Error" });
        });
    });
});
