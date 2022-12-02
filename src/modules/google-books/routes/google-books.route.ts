import express, { Router, Request, Response } from "express";
import { logger } from "../../../shared/logger/logger";
import { AjvSchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import googleBooksApiClient from "../api-clients/google-books.client";
import { normalizeQuery } from "../helpers/normalize-query.helper";
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
        const { query, limit, offset } = req.query;
        const parsedLimit = limit ? parseInt(limit) : 20;
        const parsedOffset = offset ? parseInt(offset) : 0;

        if (parsedLimit > 20) {
            res.status(500);
            res.send({ message: "Max query limit is 20" });
            return;
        }

        if (!query || query === "") {
            res.status(500);
            res.send({ message: "Query param needs to be specified!" });

            return;
        }

        const googleBooksFetchService = new GoogleBooksFetchService(new AjvSchemaValidationService(), googleBooksApiClient, logger);
        const googleBooksResolver = new GoogleBooksResolver();

        try {
            // TODO: Standardize query to avoid duplicates in cache
            const googleBooksResponse = await googleBooksFetchService.fetch(normalizeQuery(query), parsedOffset, parsedLimit);
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
