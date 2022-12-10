import { Static, Type } from "@sinclair/typebox";

export const GoogleBooksItemSchema = Type.Object({
    id: Type.String(),
    volumeInfo: Type.Object({
        title: Type.String(),
        subtitle: Type.Optional(Type.String()),
        authors: Type.Optional(Type.Array(Type.String())),
        publishedDate: Type.Optional(Type.String()),
        description: Type.Optional(Type.String()),
        pageCount: Type.Optional(Type.Number()),
        imageLinks: Type.Optional(
            Type.Object({
                smallThumbnail: Type.String(),
                thumbnail: Type.String(),
            }),
        ),
        language: Type.String(),
    }),
});

export type GoogleBooksItem = Static<typeof GoogleBooksItemSchema>;

export const GoogleBooksApiResponseSchema = Type.Object({
    totalItems: Type.Number(),
    items: Type.Array(GoogleBooksItemSchema),
});

export type GoogleBooksApiResponse = Static<typeof GoogleBooksApiResponseSchema>;

export const ResolvedGoogleBooksResponseSchema = Type.Object({
    count: Type.Number(),
    limit: Type.Number(),
    offset: Type.Number(),
    items: Type.Array(GoogleBooksItemSchema),
});

export type ResolvedGoogleBooksResponse = Static<typeof ResolvedGoogleBooksResponseSchema>;
