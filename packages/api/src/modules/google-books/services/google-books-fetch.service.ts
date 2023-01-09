import { ErrorObject, ValidateFunction } from "ajv";
import { AxiosInstance } from "axios";
import Redis from "ioredis";
import { Logger } from "pino";
import { SchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { InvalidGoogleBooksItem } from "../schemas/custom-errors.schema";
import { GoogleBooksApiResponse, GoogleBooksItem, GoogleBooksItemSchema } from "../schemas/google-books.schema";

export const name = "GoogleBooksFetchService";
export interface IGoogleBooksFetchService {
    fetchByQuery(query: string, offset: number, limit: number): Promise<GoogleBooksApiResponse>;
    fetchById(id: string): Promise<GoogleBooksItem>;
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

    public async fetchByQuery(query: string, offset: number, limit: number): Promise<GoogleBooksApiResponse> {
        const cachedData = await this.redisClient.get(JSON.stringify({ query, limit, offset }));
        const cachedItems = cachedData ? (JSON.parse(cachedData) as GoogleBooksItem[]) : undefined;

        if (cachedItems) {
            return { totalItems: cachedItems.length, items: cachedItems };
        }

        const {
            data: { items },
        } = await this.apiClient.get<GoogleBooksApiResponse>(`/volumes`, {
            params: { q: query, startIndex: offset, maxResults: limit },
        });

        const validItems: GoogleBooksItem[] = [];
        for (const item of items) {
            if (!this.isValid(item)) {
                this.logValidationErrors(this.schemaValidationFn.errors as ErrorObject[]);
                continue;
            }

            validItems.push(item);
        }

        this.redisClient.set(JSON.stringify({ query, limit, offset }), JSON.stringify([...new Set(items)]));

        return { totalItems: validItems.length, items: validItems };
    }

    public async fetchById(id: string): Promise<GoogleBooksItem> {
        const cachedData = await this.redisClient.get(id);
        if (cachedData) {
            return JSON.parse(cachedData) as GoogleBooksItem;
        }

        const { data } = await this.apiClient.get<GoogleBooksItem>(`/volumes/${id}`);

        if (!this.isValid(data)) {
            this.logValidationErrors(this.schemaValidationFn.errors as ErrorObject[]);

            throw new InvalidGoogleBooksItem(`Google Books Item with ID ${id} is invalid.`);
        }

        this.redisClient.set(id, JSON.stringify(data));

        return data;
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
