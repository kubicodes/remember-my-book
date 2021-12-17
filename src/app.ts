import { loadAsync } from "node-yaml-config";
import { ApplicationConfig, ApplicationConfigSchema } from "./shared/application-config/application-config.schema";
import { AjvSchemaValidationService } from "./shared/schema-validation/schema-validation.service";
import express from "express";
import bodyParser from "body-parser";

(async () => {
    const NODE_ENV = process.env.NODE_ENV;

    const app = express();

    const config: ApplicationConfig = await loadAsync(__dirname + `/../config/${NODE_ENV}.yml`);
    const schemaValidationService = new AjvSchemaValidationService<ApplicationConfig>();
    const validate = schemaValidationService.getValidationFunction(ApplicationConfigSchema);

    if (!validate(config)) {
        console.error(JSON.stringify(validate.errors));
        throw new Error("Invalid App config");
    }

    app.use(bodyParser.json());

    app.listen(config.port, () => {
        console.log(`App listening on port: ${config.port}`);
    });
})();
