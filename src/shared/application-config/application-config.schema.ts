import { Static, Type } from "@sinclair/typebox";

export const ApplicationConfigSchema = Type.Object({
    port: Type.Number(),
    googleBooks: Type.Object({
        baseUrl: Type.String(),
    }),
});

export type ApplicationConfig = Static<typeof ApplicationConfigSchema>;
