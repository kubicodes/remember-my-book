import { ApplicationConfig } from "../application-config.schema";

interface Options {
    port?: number;
    redis?: {
        host?: string;
        port?: number;
        password?: string;
    };
    googleBooks?: {
        baseUrl?: string;
    };
}

export function getApplicationConfigMock(options?: Options): ApplicationConfig {
    return {
        port: options?.port ?? 8000,
        redis: {
            host: options?.redis?.host ?? "host",
            port: options?.redis?.port ?? 8000,
            password: options?.redis?.password ?? "password",
        },
        googleBooks: {
            baseUrl: options?.googleBooks?.baseUrl ?? "baseUrl",
        },
    };
}
