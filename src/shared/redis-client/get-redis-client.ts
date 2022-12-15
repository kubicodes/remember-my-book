import Redis from "ioredis";
import { RedisConfig } from "../application-config/application-config.schema";

// Singleton Instance - caching
let redis: Redis;

export function getRedisClientSingleton(redisConfig: RedisConfig): Redis {
    if (!redis) {
        redis = new Redis({
            port: redisConfig.port,
            host: redisConfig.host,
            password: redisConfig.password,
        });
    }

    // needed in order to stop the client during tests
    if (process.env.NODE_ENV === "test") {
        redis.quit();
    }

    return redis;
}
