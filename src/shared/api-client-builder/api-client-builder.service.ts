import axios, { AxiosInstance } from "axios";
import { Logger } from "pino";

export interface ApiClientOptions {
    baseUrl: string;
}

export interface IApiClientBuilderService {
    buildApiClient(options: ApiClientOptions): AxiosInstance;
}

export class ApiClientBuilderService implements IApiClientBuilderService {
    constructor(private logger: Logger) {}

    public buildApiClient(options: ApiClientOptions): AxiosInstance {
        const client = axios.create({
            baseURL: options.baseUrl,
        });

        client.interceptors.request.use((request) => {
            this.logger.debug(`Sending a request to ${request.url}`);

            return request;
        });

        return client;
    }
}
