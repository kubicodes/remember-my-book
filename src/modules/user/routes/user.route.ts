import express, { Router, Request, Response } from "express";
import { logger } from "../../../shared/logger/logger";
import { ErrorResponse } from "../../../shared/schema/error-api-response.schema";
import { PasswordService } from "../../auth/password.service";
import { PrismaDBClient } from "../../database/services/database-client.service";
import { UserAlreadyExistsError, UserNotFoundError } from "../schemas/custom-errors.schema";
import { UserApiResponse } from "../schemas/user-api-response.schema";
import { UserService } from "../services/user.service";

interface CreateUserRequestBody {
    username: string;
    password: string;
}

interface FindUserByIdRequestParams {
    id: string;
}

const router: Router = express.Router();

router.post("/", async (req: Request<unknown, unknown, CreateUserRequestBody>, res: Response<UserApiResponse | ErrorResponse>) => {
    logger.debug("POST Request coming into /user");

    const dbClient = PrismaDBClient.getInstance();
    const passwordService = new PasswordService(logger);

    const { username, password } = req.body;
    const userService = new UserService(dbClient, passwordService, logger);

    try {
        const createdUser = await userService.create({ username, password });

        res.status(200);
        res.send({
            message: "Succesfully created User.",
            user: { id: createdUser.id, username: createdUser.username, createdAt: createdUser.createdAt, updatedAt: createdUser.updatedAt },
        });
    } catch (error) {
        logger.error({ msg: "Error while creating user", err: (error as Error).message });

        // when the error is from this type we want to expose the internal error as well, as it's well formatted
        const errorMessage = error instanceof UserAlreadyExistsError ? `Error while creating user. ${error.message}` : "Error while creating user.";

        res.status(500);
        res.send({
            message: errorMessage,
        });
    }
});

router.get("/:id", async (req: Request<FindUserByIdRequestParams>, res: Response<UserApiResponse | ErrorResponse>) => {
    const id = req.params.id;

    logger.debug(`GET Request coming into /user/${id}`);

    const dbClient = PrismaDBClient.getInstance();
    const passwordService = new PasswordService(logger);

    const userService = new UserService(dbClient, passwordService, logger);

    try {
        const matchingUser = await userService.findById(id);

        res.status(200);
        res.send({
            message: "Successfully found matching user",
            user: { id: matchingUser.id, username: matchingUser.username, createdAt: matchingUser.createdAt, updatedAt: matchingUser.updatedAt },
        });
    } catch (error) {
        const errorMessage = error instanceof UserNotFoundError ? error.message : `Error while finding user with ID ${id}`;

        res.status(500);
        res.send({
            message: errorMessage,
        });
    }
});

export default router;
