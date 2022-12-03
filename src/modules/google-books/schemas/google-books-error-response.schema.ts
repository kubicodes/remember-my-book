import { Static, Type } from "@sinclair/typebox";

export const GoogleBooksErrorResponseSchema = Type.Object({
    message: Type.String(),
});

export type GoogleBooksErrorResponse = Static<typeof GoogleBooksErrorResponseSchema>;
