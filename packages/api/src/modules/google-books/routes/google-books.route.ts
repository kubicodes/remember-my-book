import express, { Router, Request, Response } from "express";
import { logger } from "../../../shared/logger/logger";
import { GenericApiResponse } from "../../../shared/schema/generic-api-response.schema";
import { ServiceFactory } from "../../factory/services/factory.service";
import { normalizeQuery } from "../helpers/normalize-query.helper";
import { ResolvedGoogleBooksResponse } from "../schemas/google-books.schema";

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

    const googleBooksFetchService = ServiceFactory.getGoogleBooksFetchService();
    const googleBooksResolver = ServiceFactory.getGoogleBooksResolver();

    try {
        const googleBooksResponse = await googleBooksFetchService.fetchByQuery(normalizeQuery(query), parsedOffset, parsedLimit);
        const resolvedResponse = googleBooksResolver.resolveQueryResponse(googleBooksResponse, parsedLimit, parsedOffset);

        res.send(resolvedResponse);

        return;
    } catch (err) {
        logger.error(JSON.stringify({ msg: "Sending 500 in /books route. See error for more details.", error: err }));

        res.status(500);
        res.send({ message: "Internal Error. Please try again later" });
    }
});

export default router;
