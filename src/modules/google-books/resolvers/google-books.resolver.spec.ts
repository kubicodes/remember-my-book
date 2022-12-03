import { GoogleBooksApiResponse } from "../schemas/google-books.schema";
import { GoogleBooksResolver, IGoogleBooksResolver } from "./google-books.resolver";

describe("Google Books Resolver", () => {
    let googleBooksResolver: IGoogleBooksResolver;

    beforeEach(() => {
        googleBooksResolver = new GoogleBooksResolver();
    });

    describe("resolve", () => {
        it("resolves total, count, limit and offset properly", () => {
            const response = getGoogleBooksApiResponse({ totalItems: 1 });
            const result = googleBooksResolver.resolve(response, 1, 0);

            expect(result.count).toBe(1);
            expect(result.total).toBe(1);
            expect(result.limit).toBe(1);
            expect(result.offset).toBe(0);
        });

        it("resolves title, subtitle, description, authors, imageLinks, language, pageCount and publishedDate properly", () => {
            const response = getGoogleBooksApiResponse({
                items: {
                    title: "title",
                    subtitle: "subtitle",
                    description: "description",
                    authors: ["author"],
                    imageLinks: { thumbnail: "thumbnail", smallThumbnail: "smallThumbnail" },
                    language: "language",
                    pageCount: 1,
                    publishedDate: "22-10-2022",
                },
            });
            const result = googleBooksResolver.resolve(response, 1, 0);

            expect(result.items[0].volumeInfo.title).toBe("title");
            expect(result.items[0].volumeInfo.subtitle).toBe("subtitle");
            expect(result.items[0].volumeInfo.description).toBe("description");
            expect(result.items[0].volumeInfo.authors).toEqual(["author"]);
            expect(result.items[0].volumeInfo.imageLinks).toEqual({ thumbnail: "thumbnail", smallThumbnail: "smallThumbnail" });
            expect(result.items[0].volumeInfo.language).toBe("language");
            expect(result.items[0].volumeInfo.pageCount).toBe(1);
            expect(result.items[0].volumeInfo.publishedDate).toBe("22-10-2022");
        });

        it("does not include empty values to the resolved result", () => {
            const response: GoogleBooksApiResponse = {
                totalItems: 1,
                items: [
                    {
                        id: "id",
                        volumeInfo: {
                            title: "title",
                            language: "de",
                        },
                    },
                ],
            };

            const result = googleBooksResolver.resolve(response, 1, 0);

            expect(result).toEqual({
                total: 1,
                count: 1,
                limit: 1,
                offset: 0,
                items: [
                    {
                        id: "id",
                        volumeInfo: {
                            title: "title",
                            language: "de",
                        },
                    },
                ],
            });
        });
    });
});

interface ApiResponseOptions {
    totalItems?: number;
    items?: {
        id?: string;
        title?: string;
        subtitle?: string;
        description?: string;
        authors?: string[];
        imageLinks?: { smallThumbnail?: string; thumbnail?: string };
        language?: string;
        pageCount?: number;
        publishedDate?: string;
    };
}
function getGoogleBooksApiResponse(options?: ApiResponseOptions): GoogleBooksApiResponse {
    return {
        totalItems: options?.totalItems ?? 20,
        items: [
            {
                id: options?.items?.id ?? "id",
                volumeInfo: {
                    title: options?.items?.title ?? "title",
                    subtitle: options?.items?.subtitle ?? "subtitle",
                    description: options?.items?.description ?? "description",
                    authors: options?.items?.authors ?? ["author"],
                    imageLinks: {
                        smallThumbnail: options?.items?.imageLinks?.smallThumbnail ?? "small-thumbnail",
                        thumbnail: options?.items?.imageLinks?.thumbnail ?? "thumbnail",
                    },
                    language: options?.items?.language ?? "language",
                    pageCount: options?.items?.pageCount ?? 1,
                    publishedDate: options?.items?.publishedDate ?? "22-10-22",
                },
            },
        ],
    };
}
