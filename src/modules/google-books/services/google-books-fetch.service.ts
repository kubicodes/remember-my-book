import { ValidateFunction } from "ajv";
import { AxiosInstance } from "axios";
import { Logger } from "pino";
import { ApplicationConfig } from "../../../shared/application-config/application-config.schema";
import { SchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { GoogleBooksApiResponse, GoogleBooksItem, GoogleBooksItemSchema } from "../schema/google-books.schema";

export interface IGoogleBooksFetchService {
    fetch(query: string, offset?: number, limit?: number): Promise<GoogleBooksApiResponse>;
}

export class GoogleBooksFetchService implements IGoogleBooksFetchService {
    private schemaValidationFn: ValidateFunction;

    constructor(
        private schemaValidationService: SchemaValidationService,
        private apiClient: AxiosInstance,
        private applicationConfig: ApplicationConfig,
        private logger: Logger,
    ) {
        this.schemaValidationFn = this.schemaValidationService.getValidationFunction(GoogleBooksItemSchema);
    }

    public async fetch(query: string, offset?: number, limit?: number): Promise<GoogleBooksApiResponse> {
        let fetchLimit = limit ?? this.applicationConfig.googleBooks.queryLimit;
        let startIndex = offset ?? 0;

        const allFetchedItems: GoogleBooksItem[] = [];
        do {
            try {
                const { data } = await this.apiClient.get<GoogleBooksApiResponse>(`/volumes`, {
                    params: { q: query, startIndex, maxResults: fetchLimit },
                });

                data.items.forEach((item: GoogleBooksItem) => {
                    const isItemValid = this.schemaValidationFn(item);
                    if (!isItemValid) {
                        this.logger.error(
                            JSON.stringify({
                                msg: "Google Books Api Response does not fit the schema. See Error for more.Skipping this fetch.",
                                err: this.schemaValidationFn.errors,
                            }),
                        );

                        return;
                    }

                    allFetchedItems.push(item);
                });

                startIndex += data.items.length;
            } catch (err) {
                this.logger.debug(
                    JSON.stringify({
                        msg: "Error while fetching from Google Books. See error for more details.",
                        error: err,
                    }),
                );

                if (allFetchedItems.length !== 0) {
                    return { totalItems: allFetchedItems.length, items: allFetchedItems };
                }

                throw new Error("Internal Error. Try again later");
            }
        } while (startIndex < fetchLimit);

        return { totalItems: allFetchedItems.length, items: allFetchedItems };
    }
}
