import { logger } from "../../../shared/logger/logger";
import { IPasswordService, PasswordService } from "../../auth/password.service";
import { GoogleBooksFetchService, IGoogleBooksFetchService } from "../../google-books/services/google-books-fetch.service";
import { IUserBooksService, UserBooksService } from "../../user/services/user-books.service";
import { IUserService, UserService } from "../../user/services/user.service";
import { PrismaDBClient } from "../../database/services/database-client.service";
import { AjvSchemaValidationService } from "../../../shared/schema-validation/schema-validation.service";
import { getApplicationConfig } from "../../../shared/application-config/helpers/get-application-config.helper";
import googleBooksClient from "../../google-books/api-clients/google-books.client";
import { getRedisClientSingleton } from "../../../shared/redis-client/get-redis-client";
import { GoogleBooksResolver, IGoogleBooksResolver } from "../../google-books/resolvers/google-books.resolver";

// using singleton for existing services, as multiple instances are not needed for the current ones
export class ServiceFactory {
    private static passwordService: IPasswordService;
    private static googleBooksFetchService: IGoogleBooksFetchService;
    private static googleBooksResolver: IGoogleBooksResolver;
    private static userBooksService: IUserBooksService;
    private static userService: IUserService;
    // Services which don't need to be instanciated here, but used for dependency injection
    private static schemaValidationService = new AjvSchemaValidationService();
    private static applicationConfig = getApplicationConfig();
    private static redisClient = getRedisClientSingleton(this.applicationConfig.redis);
    private static dbClient = PrismaDBClient.getInstance();

    public static getGoogleBooksFetchService(): IGoogleBooksFetchService {
        if (!this.googleBooksFetchService) {
            this.googleBooksFetchService = new GoogleBooksFetchService(this.schemaValidationService, googleBooksClient, this.redisClient, logger);
        }

        return this.googleBooksFetchService;
    }

    public static getGoogleBooksResolver(): IGoogleBooksResolver {
        if (!this.googleBooksResolver) {
            this.googleBooksResolver = new GoogleBooksResolver();
        }

        return this.googleBooksResolver;
    }

    public static getUserBooksService(): IUserBooksService {
        if (!this.userBooksService) {
            this.userBooksService = new UserBooksService(this.dbClient, logger);
        }

        return this.userBooksService;
    }

    public static getUserService(): IUserService {
        if (!this.userService) {
            this.userService = new UserService(this.dbClient, this.getPasswordService(), logger);
        }

        return this.userService;
    }

    public static getPasswordService(): IPasswordService {
        if (!this.passwordService) {
            this.passwordService = new PasswordService(logger);
        }

        return this.passwordService;
    }
}
