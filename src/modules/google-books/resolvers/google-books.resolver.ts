import { GoogleBooksApiResponse, GoogleBooksItem, ResolvedGoogleBooksResponse } from "../schemas/google-books.schema";

export const name = "GoogleBooksResolver";

export interface IGoogleBooksResolver {
    resolve(response: GoogleBooksApiResponse, limit: number, offset: number): ResolvedGoogleBooksResponse;
}

export class GoogleBooksResolver implements IGoogleBooksResolver {
    public resolve(response: GoogleBooksApiResponse, limit: number, offset: number): ResolvedGoogleBooksResponse {
        return {
            count: response.items.length,
            limit,
            offset,
            items: response.items.map(
                (item: GoogleBooksItem): GoogleBooksItem => ({
                    id: item.id,
                    volumeInfo: {
                        title: item.volumeInfo.title,
                        language: item.volumeInfo.language,
                        ...(item.volumeInfo.subtitle ? { subtitle: item.volumeInfo.subtitle } : {}),
                        ...(item.volumeInfo.description ? { description: item.volumeInfo.description } : {}),
                        ...(item.volumeInfo.authors ? { authors: item.volumeInfo.authors } : {}),
                        ...(item.volumeInfo.imageLinks ? { imageLinks: item.volumeInfo.imageLinks } : {}),
                        ...(item.volumeInfo.pageCount ? { pageCount: item.volumeInfo.pageCount } : {}),
                        ...(item.volumeInfo.publishedDate ? { publishedDate: item.volumeInfo.publishedDate } : {}),
                    },
                }),
            ),
        };
    }
}
