import { PrismaClient } from "@prisma/client";
import { logger } from "../shared/logger/logger";
import { IPasswordService, name as passwordServiceName, PasswordService } from "./auth/password.service";
import {
    GoogleBooksFetchService,
    IGoogleBooksFetchService,
    name as googleBooksFetchServiceName,
} from "./google-books/services/google-books-fetch.service";
import { IUserBooksService, name as userBooksServiceName, UserBooksService } from "./user/services/user-books.service";
import { IUserService, name as userServiceName, UserService } from "./user/services/user.service";
import { name as dbClientServiceName, PrismaDBClient } from "./database/services/database-client.service";
import { AjvSchemaValidationService } from "../shared/schema-validation/schema-validation.service";
import { getApplicationConfig } from "../shared/application-config/helpers/get-application-config.helper";
import googleBooksClient from "./google-books/api-clients/google-books.client";
import { getRedisClientSingleton } from "../shared/redis-client/get-redis-client";
import { ApplicationConfig } from "../shared/application-config/application-config.schema";
import { GoogleBooksResolver, IGoogleBooksResolver, name as googleBooksResolverName } from "./google-books/resolvers/google-books.resolver";

export type FactoryObjectNames =
    | typeof passwordServiceName
    | typeof dbClientServiceName
    | typeof googleBooksFetchServiceName
    | typeof googleBooksResolverName
    | typeof userBooksServiceName
    | typeof userServiceName;

// using singleton for existing services, as multiple instances are not needed for the current ones
export class Factory {
    private static passwordService: IPasswordService;
    private static dbClient: PrismaClient = PrismaDBClient.getInstance();
    private static googleBooksFetchService: IGoogleBooksFetchService;
    private static googleBooksResolver: IGoogleBooksResolver;
    private static userBooksService: IUserBooksService;
    private static userService: IUserService;
    private static applicationConfig: ApplicationConfig = getApplicationConfig();
    private static redisClient = getRedisClientSingleton(this.applicationConfig.redis);
    private static schemaValidationService = new AjvSchemaValidationService();

    // Function overload for proper ts inference at usage of the Factory
    public static getInstance(name: typeof passwordServiceName): IPasswordService;
    public static getInstance(name: typeof dbClientServiceName): PrismaClient;
    public static getInstance(name: typeof googleBooksFetchServiceName): IGoogleBooksFetchService;
    public static getInstance(name: typeof googleBooksResolverName): IGoogleBooksResolver;
    public static getInstance(name: typeof userBooksServiceName): IUserBooksService;
    public static getInstance(name: typeof userServiceName): IUserService;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public static getInstance(name: FactoryObjectNames) {
        switch (name) {
            case "PasswordService":
                if (!this.passwordService) {
                    this.passwordService = new PasswordService(logger);
                }
                return this.passwordService;
            case "PrismaDBClient":
                return this.dbClient;
            case "GoogleBooksFetchService":
                if (!this.googleBooksFetchService) {
                    this.googleBooksFetchService = new GoogleBooksFetchService(
                        this.schemaValidationService,
                        googleBooksClient,
                        this.redisClient,
                        logger,
                    );
                }
                return this.googleBooksFetchService;
            case "GoogleBooksResolver":
                if (!this.googleBooksResolver) {
                    this.googleBooksResolver = new GoogleBooksResolver();
                }
                return this.googleBooksResolver;
            case "UserBooksService":
                if (!this.userBooksService) {
                    this.userBooksService = new UserBooksService(this.dbClient, logger);
                }
                return this.userBooksService;
            case "UserService":
                if (!this.userService) {
                    this.userService = new UserService(this.dbClient, this.passwordService, logger);
                }
                return this.userService;
        }
    }
}
