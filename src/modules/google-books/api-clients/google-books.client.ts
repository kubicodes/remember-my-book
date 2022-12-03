import { AxiosInstance } from "axios";
import { ApiClientBuilderService } from "../../../shared/api-client-builder/api-client-builder.service";
import { ApplicationConfig } from "../../../shared/application-config/application-config.schema";
import { getApplicationConfig } from "../../../shared/application-config/helpers/get-application-config.helper";
import { logger } from "../../../shared/logger/logger";

const apiClientBuilder = new ApiClientBuilderService(logger);
let apiClient: AxiosInstance = {} as AxiosInstance;

getApplicationConfig()
    .then((appConfig: ApplicationConfig) => {
        apiClient = apiClientBuilder.buildApiClient({ baseUrl: appConfig.googleBooks.baseUrl });
    })
    .catch((error) => {
        logger.error(JSON.stringify({ msg: "Error while laoding application Config at Api Client Creation for Google Books.", err: error }));

        throw new Error("Error while loading Application Config");
    });

export default apiClient;
