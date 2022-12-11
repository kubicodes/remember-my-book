import { Factory } from "./factory.service";

describe("Factory", () => {
    describe("getInstance", () => {
        it("returns a Singleton instance", () => {
            const passwordService1 = Factory.getInstance("PasswordService");
            const passwordService2 = Factory.getInstance("PasswordService");
            expect(passwordService1).toBe(passwordService2);

            const dbClient1 = Factory.getInstance("PrismaDBClient");
            const dbClient2 = Factory.getInstance("PrismaDBClient");
            expect(dbClient1).toBe(dbClient2);

            const googleBooksFetchService1 = Factory.getInstance("GoogleBooksFetchService");
            const googleBooksFetchService2 = Factory.getInstance("GoogleBooksFetchService");
            expect(googleBooksFetchService1).toBe(googleBooksFetchService2);

            const googleBooksResolver1 = Factory.getInstance("GoogleBooksResolver");
            const googleBooksResolver2 = Factory.getInstance("GoogleBooksResolver");
            expect(googleBooksResolver1).toBe(googleBooksResolver2);

            const userBooksService1 = Factory.getInstance("UserBooksService");
            const userBooksService2 = Factory.getInstance("UserBooksService");
            expect(userBooksService1).toBe(userBooksService2);

            const userService1 = Factory.getInstance("UserService");
            const userService2 = Factory.getInstance("UserService");
            expect(userService1).toBe(userService2);
        });
    });
});
