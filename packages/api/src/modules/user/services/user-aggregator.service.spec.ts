import { mock, mockReset } from "jest-mock-extended";
import { IGoogleBooksResolver } from "../../google-books/resolvers/google-books.resolver";
import { IGoogleBooksFetchService } from "../../google-books/services/google-books-fetch.service";
import { getMockBooks, getMockUser } from "../data/user-test.data";
import { IUserAggregatorService, UserAggregatorService } from "./user-aggregator.service";
import { IUserService } from "./user.service";

let userAggregatorService: IUserAggregatorService;
describe("User Aggregator Service", () => {
    const mockUserService = mock<IUserService>();
    const mockGoogleBooksFetchService = mock<IGoogleBooksFetchService>();
    const mockGoogleBooksResolver = mock<IGoogleBooksResolver>();

    beforeEach(() => {
        mockReset(mockUserService);
        mockReset(mockGoogleBooksFetchService);
        mockReset(mockGoogleBooksResolver);

        userAggregatorService = new UserAggregatorService(mockUserService, mockGoogleBooksFetchService, mockGoogleBooksResolver);
    });

    describe("getUserWithBooks", () => {
        it("returns an empty books array when the user has no books", async () => {
            const mockUser = getMockUser();
            const mockBooks = getMockBooks();
            mockUserService.findById.mockResolvedValueOnce({ ...mockUser, books: mockBooks });

            await userAggregatorService.getUserWithBooks("id");
        });
    });
});
