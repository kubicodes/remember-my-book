import { Static, Type } from "@sinclair/typebox";

export const ApplicationConfigSchema = Type.Object({
    port: Type.Number(),
    googleBooks: Type.Object({
        queryLimit: Type.Number(),
    }),
});

export type ApplicationConfig = Static<typeof ApplicationConfigSchema>;
