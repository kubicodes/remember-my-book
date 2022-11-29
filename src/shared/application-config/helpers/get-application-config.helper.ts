import { loadAsync } from "node-yaml-config";
import { ApplicationConfig } from "../application-config.schema";

export async function getApplicationConfig(): Promise<ApplicationConfig> {
    const NODE_ENV = process.env.NODE_ENV;
    const config: ApplicationConfig = await loadAsync(__dirname + `/../../../../config/${NODE_ENV}.yml`);

    return config;
}
