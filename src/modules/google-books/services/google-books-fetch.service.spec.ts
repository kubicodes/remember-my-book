import { ValidateFunction } from "ajv";
import { AxiosInstance } from "axios";
import Redis from "ioredis";
import { mock, mockFn, mockReset } from "jest-mock-extended";
import { Logger } from "pino";
import { SchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { GoogleBooksFetchService, IGoogleBooksFetchService } from "./google-books-fetch.service";

describe("Google Books Fetch Service", () => {
    let googleBooksFetchService: IGoogleBooksFetchService;

    const mockSchemaValidationService = mock<SchemaValidationService>();
    const mockApiClient = mock<AxiosInstance>();
    const mockLogger = mock<Logger>();
    const mockValidateFn = mockFn<ValidateFunction>();
    const mockRedis = mock<Redis>();

    beforeEach(() => {
        mockReset(mockValidateFn);
        mockReset(mockSchemaValidationService);
        mockReset(mockApiClient);
        mockReset(mockLogger);
        mockReset(mockRedis);
        mockSchemaValidationService.getValidationFunction.mockReturnValueOnce(mockValidateFn);

        googleBooksFetchService = new GoogleBooksFetchService(mockSchemaValidationService, mockApiClient, mockRedis, mockLogger);
    });

    describe("fetch", () => {
        it("uses the cache when the query is set", async () => {
            const query = "test";
            mockApiClient.get.mockResolvedValueOnce({ data: { totalItems: 1, items: [{ id: "id" }] } });
            mockValidateFn.mockReturnValueOnce(true);

            await googleBooksFetchService.fetch(query, 0, 1);

            mockRedis.get.mockResolvedValueOnce(JSON.stringify([{ id: "id" }]));

            await googleBooksFetchService.fetch(query, 0, 1);

            expect(mockApiClient.get).toHaveBeenCalledTimes(1);
        });

        it("logs an error when the fetched item does not fit the schema", async () => {
            const query = "test";
            mockApiClient.get.mockResolvedValue({ data: { totalItems: 2, items: [{ id: "id-invalid" }, { id: "id-valid" }] } });
            mockValidateFn.mockReturnValueOnce(false);
            mockValidateFn.mockReturnValueOnce(true);
            mockValidateFn.errors = [{ instancePath: "instancePath", keyword: "keyword", params: { param: "param" }, schemaPath: "schemPath" }];

            const result = await googleBooksFetchService.fetch(query, 0, 1);

            expect(mockLogger.error).toHaveBeenCalledTimes(1);
            expect(result.totalItems).toBe(1);
            expect(result.items.length).toBe(1);
            expect(result.items[0].id).toBe("id-valid");
        });

        it("calls the google books api when the cache does not have enough items", async () => {
            const query = "test";

            mockApiClient.get.mockResolvedValueOnce({ data: { totalItems: 2, items: [{ id: "id-1" }, { id: "id-2" }] } });
            mockValidateFn.mockReturnValueOnce(true);
            mockValidateFn.mockReturnValueOnce(true);

            // 2 items in cache now
            await googleBooksFetchService.fetch(query, 0, 2);

            mockApiClient.get.mockResolvedValueOnce({ data: { totalItems: 2, items: [{ id: "id-3" }, { id: "id-4" }] } });
            mockValidateFn.mockReturnValueOnce(true);
            mockValidateFn.mockReturnValueOnce(true);
            mockRedis.get.mockResolvedValueOnce(JSON.stringify([{ id: "id-1" }, { id: "id-2" }]));

            await googleBooksFetchService.fetch(query, 0, 4);

            // expect(mockApiClient.get).toHaveBeenCalledTimes(2);
            expect(mockApiClient.get).toHaveBeenNthCalledWith(2, "/volumes", { params: { q: "test", startIndex: 2, maxResults: 4 } });
        });

        it("returns the items without any errors", async () => {
            const query = "test";

            mockApiClient.get.mockResolvedValueOnce({ data: { totalItems: 1, items: [{ id: "id-1" }] } });
            mockValidateFn.mockReturnValueOnce(true);

            mockApiClient.get.mockResolvedValueOnce({ data: { totalItems: 1, items: [{ id: "id-2" }] } });
            mockValidateFn.mockReturnValueOnce(true);

            const result = await googleBooksFetchService.fetch(query, 0, 2);

            expect(mockApiClient.get).toHaveBeenCalledTimes(2);
            expect(result.totalItems).toBe(2);
            expect(result.items.length).toBe(2);
            expect(result.items[0].id).toBe("id-1");
            expect(result.items[1].id).toBe("id-2");
        });

        it("returns the fetched items so far when an error occurs during fetching", async () => {
            const query = "test";

            mockApiClient.get.mockResolvedValueOnce({ data: { totalItems: 1, items: [{ id: "id-1" }] } });
            mockValidateFn.mockReturnValueOnce(true);

            mockApiClient.get.mockRejectedValueOnce({ status: 500 });

            const result = await googleBooksFetchService.fetch(query, 0, 2);

            expect(result.totalItems).toBe(1);
            expect(result.items.length).toBe(1);
            expect(result.items[0].id).toBe("id-1");
        });
    });
});
