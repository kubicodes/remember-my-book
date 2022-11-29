import { ApplicationConfig, ApplicationConfigSchema } from "./shared/application-config/application-config.schema";
import { AjvSchemaValidationService } from "./shared/schema-validation/schema-validation.service";
import express from "express";
import bodyParser from "body-parser";
import booksRouter from "../src/modules/google-books/routes/google-books.route";
import { getApplicationConfig } from "./shared/application-config/helpers/get-application-config.helper";

(async () => {
    const app = express();

    const config: ApplicationConfig = await getApplicationConfig();
    const schemaValidationService = new AjvSchemaValidationService<ApplicationConfig>();
    const validate = schemaValidationService.getValidationFunction(ApplicationConfigSchema);

    if (!validate(config)) {
        console.error(JSON.stringify(validate.errors));
        throw new Error("Invalid App config");
    }

    app.use(bodyParser.json());

    app.use("/books", booksRouter);

    app.listen(config.port, () => {
        console.log(`App listening on port: ${config.port}`);
    });
})();
