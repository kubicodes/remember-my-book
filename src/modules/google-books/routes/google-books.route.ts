import express, { Router, Request, Response } from "express";
import { getApplicationConfig } from "../../../shared/application-config/helpers/get-application-config.helper";
import { logger } from "../../../shared/logger/logger";
import { getRedisClientSingleton } from "../../../shared/redis-client/get-redis-client";
import { AjvSchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { GenericApiResponse } from "../../../shared/schema/generic-api-response.schema";
import googleBooksApiClient from "../api-clients/google-books.client";
import { normalizeQuery } from "../helpers/normalize-query.helper";
import { GoogleBooksResolver } from "../resolvers/google-books.resolver";
import { ResolvedGoogleBooksResponse } from "../schemas/google-books.schema";
import { GoogleBooksFetchService } from "../services/google-books-fetch.service";

interface RequestQuery {
    query: string;
    limit?: string;
    offset?: string;
}

const router: Router = express.Router();

router.get("/", async (req: Request<unknown, unknown, unknown, RequestQuery>, res: Response<ResolvedGoogleBooksResponse | GenericApiResponse>) => {
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

    const { redis: redisConfig } = getApplicationConfig();
    const redis = getRedisClientSingleton(redisConfig);

    const googleBooksFetchService = new GoogleBooksFetchService(new AjvSchemaValidationService(), googleBooksApiClient, redis, logger);
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
});

export default router;
