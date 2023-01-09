import pino, { Logger } from "pino";
import { ApiClientBuilderService, IApiClientBuilderService } from "./api-client-builder.service";
import { mock } from "jest-mock-extended";

describe("buildApiClient", () => {
    let service: IApiClientBuilderService;
    const mockLogger: Logger = mock(pino());

    beforeEach(() => {
        service = new ApiClientBuilderService(mockLogger);
    });

    it("creates an axios api client based on the options it gets", () => {
        const baseUrl = "https://baseurl.com";
        const createdClient = service.buildApiClient({ baseUrl });

        expect(createdClient.defaults.baseURL).toBe(baseUrl);
    });
});
