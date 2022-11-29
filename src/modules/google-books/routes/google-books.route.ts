import express, { Router, Request, Response } from "express";
import { getApplicationConfig } from "../../../shared/application-config/helpers/get-application-config.helper";
import { logger } from "../../../shared/logger/logger";
import { AjvSchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import googleBooksApiClient from "../api-clients/google-books.client";
import { GoogleBooksResolver } from "../resolvers/google-books.resolver";
import { GoogleBooksErrorResponse } from "../schema/google-books-error-response.schema";
import { ResolvedGoogleBooksResponse } from "../schema/google-books.schema";
import { GoogleBooksFetchService } from "../services/google-books-fetch.service";

const router: Router = express.Router();

router.get(
    "/",
    async (
        req: Request<{}, {}, {}, { query: string; limit?: string; offset?: string }>,
        res: Response<ResolvedGoogleBooksResponse | GoogleBooksErrorResponse>,
    ) => {
        const applicationConfig = await getApplicationConfig();
        const {
            googleBooks: { queryLimit },
        } = applicationConfig;

        const { query, limit, offset } = req.query;
        const parsedLimit = limit ? parseInt(limit) : undefined;
        const parsedOffset = offset ? parseInt(offset) : undefined;

        if (!query || query === "") {
            res.status(500);
            res.send({ message: "Query param needs to be specified!" });

            return;
        }

        if (parsedLimit && parsedLimit > queryLimit) {
            res.status(500);
            res.send({ message: `Maximal fetch limit: ${queryLimit}` });

            return;
        }

        if (parsedOffset && parsedLimit && parsedOffset + parsedLimit > queryLimit) {
            res.status(500);
            res.send({ message: `You can only fetch ${queryLimit} entries` });

            return;
        }

        const schemaValidationService = new AjvSchemaValidationService();
        const googleBooksFetchService = new GoogleBooksFetchService(schemaValidationService, googleBooksApiClient, applicationConfig, logger);
        const googleBooksResolver = new GoogleBooksResolver();

        try {
            // TODO: Standardize query to avoid duplicates in cache
            const googleBooksResponse = await googleBooksFetchService.fetch(query, parsedOffset, parsedLimit);
            // TODO: Adjust resolver with new limit and stuff
            const resolvedResponse = googleBooksResolver.resolve(googleBooksResponse, parsedLimit, parsedOffset);

            res.send(resolvedResponse);

            return;
        } catch (err) {
            logger.error(JSON.stringify({ msg: "Sending 500 in /books route. See error for more details.", error: err }));

            res.status(500);
            res.send({ message: "Internal Error. Please try again later" });
        }
    },
);

export default router;
