import { Static, Type } from "@sinclair/typebox";

export const ApplicationConfigSchema = Type.Object({
    port: Type.Number(),
});

export type ApplicationConfig = Static<typeof ApplicationConfigSchema>;
