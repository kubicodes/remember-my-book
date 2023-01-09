import { ServiceFactory } from "./factory.service";

describe("Service Factory", () => {
    it("returns a Singleton instance", () => {
        const passwordService1 = ServiceFactory.getPasswordService();
        const passwordService2 = ServiceFactory.getPasswordService();
        expect(passwordService1).toBe(passwordService2);

        const googleBooksFetchService1 = ServiceFactory.getGoogleBooksFetchService();
        const googleBooksFetchService2 = ServiceFactory.getGoogleBooksFetchService();
        expect(googleBooksFetchService1).toBe(googleBooksFetchService2);

        const googleBooksResolver1 = ServiceFactory.getGoogleBooksResolver();
        const googleBooksResolver2 = ServiceFactory.getGoogleBooksResolver();
        expect(googleBooksResolver1).toBe(googleBooksResolver2);

        const userBooksService1 = ServiceFactory.getUserBooksService();
        const userBooksService2 = ServiceFactory.getUserBooksService();
        expect(userBooksService1).toBe(userBooksService2);

        const userService1 = ServiceFactory.getUserService();
        const userService2 = ServiceFactory.getUserService();
        expect(userService1).toBe(userService2);
    });
});
