import { Static, Type } from "@sinclair/typebox";

export const RedisConfigSchema = Type.Object({
    host: Type.String(),
    port: Type.Number(),
    password: Type.String(),
});

export type RedisConfig = Static<typeof RedisConfigSchema>;

export const ApplicationConfigSchema = Type.Object({
    port: Type.Number(),
    googleBooks: Type.Object({
        baseUrl: Type.String(),
    }),
    redis: RedisConfigSchema,
});

export type ApplicationConfig = Static<typeof ApplicationConfigSchema>;
