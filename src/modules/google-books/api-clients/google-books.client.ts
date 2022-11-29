import { ApiClientBuilderService } from "../../../shared/api-client-builder/api-client-builder.service";
import { logger } from "../../../shared/logger/logger";

export const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1";
const apiClientBuilder = new ApiClientBuilderService(logger);

export default apiClientBuilder.buildApiClient({ baseUrl: GOOGLE_BOOKS_API_BASE_URL });
