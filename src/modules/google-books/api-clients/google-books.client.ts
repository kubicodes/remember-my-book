import { AxiosInstance } from "axios";
import { ApiClientBuilderService } from "../../../shared/api-client-builder/api-client-builder.service";
import { getApplicationConfig } from "../../../shared/application-config/helpers/get-application-config.helper";
import { logger } from "../../../shared/logger/logger";

const apiClientBuilder = new ApiClientBuilderService(logger);
let apiClient: AxiosInstance;

export function getGoogleBoooksClient(): AxiosInstance {
    if (!apiClient) {
        const {
            googleBooks: { baseUrl },
        } = getApplicationConfig();

        apiClient = apiClientBuilder.buildApiClient({ baseUrl });
    }

    return apiClient;
}

export default getGoogleBoooksClient();
