import { PrismaClient } from "@prisma/client";
import { mock, mockDeep, mockReset } from "jest-mock-extended";
import { Logger } from "pino";
import { UserNotFoundError } from "../schemas/custom-errors.schema";
import { IUserBooksService, UserBooksService } from "./user-books.service";

let userBooksService: IUserBooksService;
describe("User Books Service", () => {
    const mockDbClient = mockDeep<PrismaClient>();
    const mockLogger = mock<Logger>();

    beforeEach(() => {
        mockReset(mockDbClient);
        mockReset(mockLogger);

        userBooksService = new UserBooksService(mockDbClient, mockLogger);
    });

    describe("addBookToUser", () => {
        it("returns true when the update function of the prisma client does not throw an error", async () => {
            const result = await userBooksService.addBookToUser("userId", "bookId");

            expect(result).toBe(true);
        });

        it("throws and logs a UserNotFoundError when the user does not exist", async () => {
            jest.spyOn(mockDbClient.user, "update").mockImplementationOnce(() => {
                throw new Error("Required exactly one parent ID to be present for connect query, found 0");
            });

            await expect(() => userBooksService.addBookToUser("invalid-user-id", "bookId")).rejects.toThrow(UserNotFoundError);
            expect(mockLogger.error).toHaveBeenCalledWith({ msg: "Can not add books to not existing User with ID invalid-user-id" });
        });

        it("logs an error and returns false when the error is not that the user does not exist", async () => {
            jest.spyOn(mockDbClient.user, "update").mockImplementationOnce(() => {
                throw new Error("Error while updating");
            });

            const result = await userBooksService.addBookToUser("user-id", "book-id");

            expect(result).toBe(false);
            expect(mockLogger.error).toHaveBeenCalledWith({
                msg: "Error while adding book with ID book-id to user with ID user-id",
                err: "Error while updating",
            });
        });
    });
});
