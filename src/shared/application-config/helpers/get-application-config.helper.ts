import { loadAsync } from "node-yaml-config";
import { ApplicationConfig } from "../application-config.schema";

// Caching
let config: ApplicationConfig;

export async function getApplicationConfig(): Promise<ApplicationConfig> {
    const NODE_ENV = process.env.NODE_ENV;

    if (!config) {
        config = await loadAsync(__dirname + `/../../../../config/${NODE_ENV}.yml`);
    }

    return config;
}
