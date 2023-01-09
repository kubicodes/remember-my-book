import { PrismaDBClient } from "./database-client.service";

describe("Database Client Service", () => {
    describe("getClient", () => {
        it("returns a singleton", () => {
            const client1 = PrismaDBClient.getInstance();
            const client2 = PrismaDBClient.getInstance();

            expect(client1).toBe(client2);
        });
    });
});
