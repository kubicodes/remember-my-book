import { ApplicationConfig, ApplicationConfigSchema } from "./shared/application-config/application-config.schema";
import { AjvSchemaValidationService } from "./shared/schema-validation/schema-validation.service";
import express from "express";
import bodyParser from "body-parser";
import booksRouter from "../src/modules/google-books/routes/google-books.route";
import userRouter from "../src/modules/user/routes/user.route";
import { getApplicationConfig } from "./shared/application-config/helpers/get-application-config.helper";
import { logger } from "./shared/logger/logger";

(async (): Promise<void> => {
    // Initialising express server
    const app = express();

    // Loading and validating config
    const config: ApplicationConfig = getApplicationConfig();
    const schemaValidationService = new AjvSchemaValidationService<ApplicationConfig>();
    const validate = schemaValidationService.getValidationFunction(ApplicationConfigSchema);

    if (!validate(config)) {
        logger.error(JSON.stringify(validate.errors));
        throw new Error("Invalid App config");
    }

    // Middleware
    app.use(bodyParser.json());

    // Routes
    app.use("/books", booksRouter);
    app.use("/user", userRouter);

    // Starting Server
    app.listen(config.port, () => {
        logger.info(`App listening on port: ${config.port}`);
    });
})();
