import { load } from "node-yaml-config";
import { ApplicationConfig } from "../application-config.schema";

// Caching
let config: ApplicationConfig;

export function getApplicationConfig(): ApplicationConfig {
    const NODE_ENV = process.env.NODE_ENV;

    if (!config) {
        config = load(__dirname + `/../../../../config/${NODE_ENV}.yml`);
    }

    return config;
}
