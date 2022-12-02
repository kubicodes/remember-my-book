import { ErrorObject, ValidateFunction } from "ajv";
import { AxiosInstance } from "axios";
import { Logger } from "pino";
import { SchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { GoogleBooksApiResponse, GoogleBooksItem, GoogleBooksItemSchema } from "../schema/google-books.schema";

export interface IGoogleBooksFetchService {
    fetch(query: string, offset?: number, limit?: number): Promise<GoogleBooksApiResponse>;
}

export class GoogleBooksFetchService implements IGoogleBooksFetchService {
    private schemaValidationFn: ValidateFunction;
    private static cache: Map<string, GoogleBooksItem[]> = new Map();

    constructor(private schemaValidationService: SchemaValidationService, private apiClient: AxiosInstance, private logger: Logger) {
        this.schemaValidationFn = this.schemaValidationService.getValidationFunction(GoogleBooksItemSchema);
    }

    public async fetch(query: string, offset: number, limit: number): Promise<GoogleBooksApiResponse> {
        let totalItemsResponse = 0;
        let startIndex = offset;
        const allFetchedItems: GoogleBooksItem[] = [];

        const cachedItems = GoogleBooksFetchService.cache.get(query);
        if (cachedItems) {
            if (cachedItems.length >= limit) {
                return { totalItems: cachedItems.length, items: cachedItems.slice(offset, offset + limit) };
            }

            allFetchedItems.push(...cachedItems);
        }

        do {
            const {
                data: { items, totalItems },
            } = await this.apiClient.get<GoogleBooksApiResponse>(`/volumes`, {
                params: { q: query, startIndex: offset, maxResults: limit },
            });

            totalItemsResponse = totalItems;

            for (const item of items) {
                if (!this.isValid(item)) {
                    this.logValidationErrors(this.schemaValidationFn.errors as ErrorObject[]);
                    continue;
                }

                allFetchedItems.push(item);
            }

            startIndex = startIndex + limit;
        } while (totalItemsResponse === 0 || allFetchedItems.length < limit + offset);

        GoogleBooksFetchService.cache.set(query, allFetchedItems);
        console.log("offset: ", offset);
        console.log("ofset + limit: ", offset + limit);

        return { totalItems: allFetchedItems.length, items: allFetchedItems.slice(offset, limit + offset) };
    }

    private isValid(item: GoogleBooksItem): boolean {
        return this.schemaValidationFn(item);
    }

    private logValidationErrors(errors: ErrorObject[]): void {
        this.logger.error(
            JSON.stringify({
                msg: "Google Books Api Response does not fit the schema. See Error for more.Skipping this fetch.",
                err: errors,
            }),
        );
    }
}
