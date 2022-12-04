import { ErrorObject, ValidateFunction } from "ajv";
import { AxiosInstance } from "axios";
import Redis from "ioredis";
import { Logger } from "pino";
import { SchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { GoogleBooksApiResponse, GoogleBooksItem, GoogleBooksItemSchema } from "../schemas/google-books.schema";

export interface IGoogleBooksFetchService {
    fetch(query: string, offset: number, limit: number): Promise<GoogleBooksApiResponse>;
}

export class GoogleBooksFetchService implements IGoogleBooksFetchService {
    private schemaValidationFn: ValidateFunction;

    constructor(
        private schemaValidationService: SchemaValidationService,
        private apiClient: AxiosInstance,
        private redisClient: Redis,
        private logger: Logger,
    ) {
        this.schemaValidationFn = this.schemaValidationService.getValidationFunction(GoogleBooksItemSchema);
    }

    public async fetch(query: string, offset: number, limit: number): Promise<GoogleBooksApiResponse> {
        let totalItemsResponse = 0;
        let startIndex = offset;
        const allFetchedItems: GoogleBooksItem[] = [];

        const redisCachedData = await this.redisClient.get(query);
        const cachedItems = redisCachedData ? (JSON.parse(redisCachedData) as GoogleBooksItem[]) : undefined;

        if (cachedItems) {
            if (cachedItems.length >= limit) {
                return { totalItems: cachedItems.length, items: cachedItems.slice(offset, offset + limit) };
            }

            allFetchedItems.push(...cachedItems);
            // no need to fetch them again from google
            startIndex = cachedItems.length;
        }

        do {
            try {
                const {
                    data: { items, totalItems },
                } = await this.apiClient.get<GoogleBooksApiResponse>(`/volumes`, {
                    params: { q: query, startIndex, maxResults: limit },
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
            } catch (error) {
                this.logger.error(JSON.stringify({ msg: "Error while fetching from Google Books API", err: (error as Error)?.message }));

                return { totalItems: allFetchedItems.length, items: allFetchedItems.slice(offset, limit + offset) };
            }
        } while (totalItemsResponse === 0 || allFetchedItems.length < limit + offset);

        await this.redisClient.set(query, JSON.stringify([...new Set(allFetchedItems)]));

        return { totalItems: allFetchedItems.length, items: allFetchedItems.slice(offset, limit + offset) };
    }

    private isValid(item: GoogleBooksItem): boolean {
        return this.schemaValidationFn(item);
    }

    private logValidationErrors(errors: ErrorObject[]): void {
        this.logger.error(
            JSON.stringify({
                msg: "Google Books Api Response does not fit the schema. See Error for more. Skipping this fetch.",
                err: errors,
            }),
        );
    }
}
