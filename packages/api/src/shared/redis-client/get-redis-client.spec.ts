import Redis from "ioredis";
import { RedisConfig } from "../application-config/application-config.schema";
import { getRedisClientSingleton } from "./get-redis-client";

describe("getRedisClientSingleton", () => {
    let client1: Redis;
    let client2: Redis;

    const redisConfig: RedisConfig = {
        port: 1234,
        host: "host",
        password: "password",
    };

    afterEach(() => {
        // needed in order to prevent jest timeout
        client1.quit();
        client2.quit();
    });

    it("returns a singleton of the redis client", () => {
        client1 = getRedisClientSingleton(redisConfig);
        client2 = getRedisClientSingleton(redisConfig);

        expect(client1).toBe(client2);
    });
});
