import { PrismaClient } from "@prisma/client";

export const name = "PrismaDBClient";

export class PrismaDBClient {
    private static dbClient: PrismaClient;

    // Singleton (as recommended)
    public static getInstance(): PrismaClient {
        if (!this.dbClient) {
            this.dbClient = new PrismaClient();
        }

        return this.dbClient;
    }
}
